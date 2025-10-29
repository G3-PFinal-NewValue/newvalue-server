import AppointmentModel from '../models/AppointmentModel.js';
import UserModel from '../models/UserModel.js';
import SessionModel from '../models/SessionModel.js';
import {sequelize} from "../config/database.js";

// -------------------------
// CONTROLADOR DE APPOINTMENTS
// -------------------------

// Obtener todas las citas
export const getAllAppointments = async (req, res) => {
    try {
      const { page = 1, limit = 10, psychologist_id, patient_id, status} = req.query;
      const offset = (page - 1) * limit;

    //que pacientes solo vean sus citas y psicólogos las suyas
    let whereClause = {};

    if (req.user.role === 'patient') {
      whereClause.patient_id = req.user.id;
    } else if (req.user.role === 'psychologist') {
      whereClause.psychologist_id = req.user.id;
    }

    //Filtros opcionales por query
    if (psychologist_id) whereClause.psychologist_id = psychologist_id;
    if (patient_id) whereClause.patient_id = patient_id;
    if (status) whereClause.status = status;

    const {rows: appointments, count} = await AppointmentModel.findAndCountAll({
      where: whereClause,
      include: [
        { model: UserModel, as: 'patient', attributes: ['id', 'name', 'email'] },
        { model: UserModel, as: 'psychologist', attributes: ['id', 'name', 'email'] },
        { model: SessionModel, as: 'sessions' },
      ],
      order: [['date', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.status(200).json({
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
    appointments,
    });
  } catch (error) {
    console.error('Error al recuperar citas:', error);
    res.status(500).json({ message: 'Error al recuperar citas', error: error.message });
  }
};

// Obtener una cita por su ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await AppointmentModel.findByPk(id, {
      include: [
        { model: UserModel, as: 'patient', attributes: ['id', 'name', 'email']},
        { model: UserModel, as: 'psychologist', attributes: ['id', 'name', 'email']},
        { model: SessionModel, as: 'sessions' },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ message: 'No se ha encontrado ninguna cita.' });
    }

    //Validar que quien consulta la cita sea el apciente, psicologo o el admin
    if (
      req.user.role !== 'admin' &&
      req.user.id !== appointment.patient_id &&
      req.user.id !== appointment.psychologist_id
    ){
      return res.status(403).json({message: 'No tienes permiso para ver esta cita.'})
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error al recuperar cita:', error);
    res.status(500).json({ message: 'Error al recuperar cita', error: error.message });
  }
};

// Crear una nueva cita
export const createAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const patient_id = req.user.id;
    const { psychologist_id, date, session_link, duration_minutes, notes } = req.body;

    //Validaciones Basicas
    if (!psychologist_id || !date) {
      await transaction.rollback();
        return res.status(400).json({message:'Faltan datos obligatorios'})
    }

    // Validar que la fecha sea futura
    if (new Date(date) < new Date()) {
      await transaction.rollback();
      return res.status(400).json({ message: 'La fecha de la cita debe ser futura'});
    }

    //Revisar disponibilidad del psicólogo
    const overlapping = await AppointmentModel.findOne({
      where: {
        psychologist_id,
        date
      },
      transaction,
    });

    if (overlapping) {
      await transaction.rollback();
      return res.status(400).json({message: 'El psicólogo no esta disponible en esta fecha/hora.'})
};

    //Crear la cita
    const newAppointment = await AppointmentModel.create({
      patient_id,
      psychologist_id,
      date,
      status: 'pending',
      session_link,
      duration_minutes: duration_minutes || 50,
      notes: notes || '',
    }, { transaction });

    await transaction.commit();
    res.status(201).json(newAppointment);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear cita:', error);
    res.status(500).json({ message: 'Error al crear cita', error:error.message });
  }
};

//Actualizar cita
export const updateAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status, session_link, notes } = req.body;

    const appointment = await AppointmentModel.findByPk(id, { transaction });
    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Cita no encontrada'});
    }

    //Validar permisos
    if (
      req.user.role !== 'admin' &&
      req.user.id !== appointment.patient_id &&
      req.user.id !== appointment.psychologist_id
    ){
      await transaction.rollback();
      return res.status(403).json({message: 'No tienes permiso para editar esta cita.'})
    }

    //solo permitimos actualizar datos seguros
    if (status) appointment.status = status;
    if (session_link) appointment.session_link = session_link;
    if (notes) appointment.notes = notes;

    await appointment.save({ transaction });
    await transaction.commit();

    res.status(200).json({ message: 'Cita actualizada correctamente', appointment });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ message: 'Error al actualizar cita', error: error.message });
  }
};

//Eliminar cita
export const deleteAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const appointment = await AppointmentModel.findByPk(id, { transaction });
    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Cita no encontrada'});
    }

    //Validar permisos
    if (
      req.user.role !== 'admin' &&
      req.user.id !== appointment.patient_id &&
      req.user.id !== appointment.psychologist_id
    ){
      await transaction.rollback();
      return res.status(403).json({message: 'No tienes permiso para eliminar esta cita.'})
    }

    await appointment.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ message: 'Error al eliminar cita', error: error.message });
  }
};