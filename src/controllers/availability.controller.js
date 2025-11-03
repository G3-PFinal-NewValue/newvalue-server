import AvailabilityModel from '../models/AvailabilityModel.js';
import PsychologistModel from '../models/PsychologistModel.js';
import AppointmentModel from '../models/AppointmentModel.js';
import { sequelize } from "../config/database.js";

//-------------------------------
//Controlador de disponibilidades
//-------------------------------

//Obtener disponibilidades segun rol
export const getAllAvailabilities = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role === 'psychologist') {
      whereClause.psychologist_id = req.user.id;
    }

    const availabilities = await AvailabilityModel.findAll({
      where: whereClause,
      include: [
        {
          model: PsychologistModel,
          as: 'psychologist',
          attributes: ['user_id', 'name', 'email'],
        },
      ],
      order: [['weekday', 'ASC'], ['start_time', 'ASC']],
    });

    res.status(200).json(availabilities);
  } catch (error) {
    console.error('Error al obtener la disponibilidad:', error);
    res.status(500).json({ message: 'Error al obtener la disponibilidad.', error: error.message });
  }
};

//obtener disponibilidades de un psicologo por id (para pacientes)
export const getAvailabilitiesByPsychologist = async (req, res) => {
  try {
    const { psychologist_id } = req.params;

    const availabilities = await AvailabilityModel.findAll({
      where: { psychologist_id, status: 'available' },
      order: [['weekday', 'ASC'], ['start_time', 'ASC']],
    });

    if (!availabilities.length) {
      return res.status(404).json({ message: 'No se encontraron disponibilidades para este psicologo' });
    }

    res.status(200).json(availabilities);
  } catch (error) {
    console.error('Error al obtener la disponibilidad:', error);
    res.status(500).json({ message: 'Error al obtener la disponibilidad.', error: error.message });
  }
};

//crear bloque de disponibilidad (solo psicologo)
export const createAvailability = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { weekday, start_time, end_time } = req.body;
    const psychologist_id = req.user.id;

    if (!weekday || !start_time || !end_time) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    //validacion minima de 30 minutos
    const start = new Date(`1970-01-01T${start_time}:00`);
    const end = new Date(`1970-01-01T${end_time}:00`);
    const diffMinutes = (end - start) / (1000 * 60);

    if (diffMinutes < 30) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cada bloque debe durar al menos 30 minutos' })
    }

    const newAvailability = await AvailabilityModel.create({
      psychologist_id,
      weekday,
      start_time,
      end_time,
      status: 'available',
    }, {
      transaction,
    });

    await transaction.commit();
    res.status(201).json({message: 'Disponibilidad creada correctamente', availability: newAvailability});

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear disponibilidad:', error);
    res.status(500).json({ message: 'Error al crear disponibilidad.', error: error.message });
  }
};

//actualizar bloque de disponibilidad (solo psicologo)
export const updateAvailability = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { weekday, start_time, end_time } = req.body;

    const availability = await AvailabilityModel.findByPk(id, { transaction });
    if (!availability) {
      await transaction.rollback();
      return res.status(404).json({ message: 'No se encontró la disponibilidad' });
    }

    if (availability.psychologist_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta disponibilidad' });
    }

    //No se puede actualizar una disponibilidad ya reservada
    if (availability.status === 'booked') {
      await transaction.rollback();
      return res.status(400).json({ message: 'No se puede editar una disponibilidad reservada' });
    }

    //validacion minima de 30 minutos
    if (start_time && end_time) {
      const start = new Date(`1970-01-01T${start_time}:00`);
      const end = new Date(`1970-01-01T${end_time}:00`);
      const diffMinutes = (end - start) / (1000 * 60);
      if (diffMinutes < 30) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Cada bloque debe ser mínimo de 30 minutos' });
      }
      availability.start_time = start_time;
      availability.end_time = end_time;
    }

    if (weekday) {
      availability.weekday = weekday;
    }

    await availability.save({ transaction });
    await transaction.commit();
    res.status(200).json({ message: 'Disponibilidad actualizada correctamente', availability });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar disponibilidad:', error);
    res.status(500).json({ message: 'Error al actualizar disponibilidad.', error: error.message });
  }
};

//eliminar bloque de disponibilidad (solo psicologo)
export const deleteAvailability = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const availability = await AvailabilityModel.findByPk(id, { transaction });
    
    if (!availability) {
      await transaction.rollback();
      return res.status(404).json({ message: 'No se encontró la disponibilidad' });
    }

    if (availability.psychologist_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta disponibilidad' });
    }

    //No permitir eliminar si hay una cita vinculada
    const assigned = await AppointmentModel.findOne({
      where: { availability_id: id },
      transaction,
    });
    if (assigned) {
      await transaction.rollback();
      return res.status(400).json({ message: 'No se puede eliminar una disponibilidad vinculada a una cita' });
    }

    await availability.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({ message: 'Disponibilidad eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar la disponibilidad:', error);
    res.status(500).json({ message: 'Error al eliminar la disponibilidad.', error: error.message });
  }
};

//Validacion: verificar minimo 5 bloques semanales
export const validateMinimumAvailability = async (req, res) => {
  try {
    const psychologist_id = req.user.id

    const count = await AvailabilityModel.count({
      where: { psychologist_id },
    });

    if (count < 5) {
      return res.status(400).json({
        message: 'El psicólogo debe tener al menos 5 bloques de disponibilidad semanales',
        currentCount: count,
      });
    }

    res.status(200).json({ message: 'Disponibilidad minima cumplida', count });
  } catch (error) {
    console.error('Error al validar disponibilidad mínima:', error);
    res.status(500).json({ message: 'Error al validar disponibilidad mínima.', error: error.message });
  }
};