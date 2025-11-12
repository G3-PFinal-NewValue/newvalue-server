import AvailabilityModel from "../models/AvailabilityModel.js";
import PsychologistModel from '../models/PsychologistModel.js';
<<<<<<< HEAD
import { Op } from 'sequelize'; //  Para operadores de Sequelize (between, not, etc.)
=======
import AppointmentModel from '../models/AppointmentModel.js';
import { sequelize } from "../config/database.js";
>>>>>>> develop

//-------------------------------
//Controlador de disponibilidades
//-------------------------------

//Obtener disponibilidades segun rol
export const getAllAvailabilities = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role === "psychologist") {
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
    console.error("Error al obtener la disponibilidad:", error);
    res.status(500).json({ message: "Error al obtener la disponibilidad.", error: error.message });
  }
};

//obtener disponibilidades de un psicologo por id (para pacientes)
export const getAvailabilitiesByPsychologist = async (req, res) => {
  try {
    const { psychologist_id } = req.params;

    const availabilities = await AvailabilityModel.findAll({
      where: { psychologist_id, status: "available" },
      order: [['weekday', 'ASC'], ['start_time', 'ASC']],
    });

    if (!availabilities.length) {
      return res.status(404).json({ message: "No se encontraron disponibilidades para este psicologo" });
    }

    res.status(200).json(availabilities);
  } catch (error) {
    console.error("Error al obtener la disponibilidad:", error);
    res.status(500).json({ message: "Error al obtener la disponibilidad.", error: error.message });
  }
};

//crear bloque de disponibilidad (solo psicologo)
export const createAvailability = async (req, res) => {
<<<<<<< HEAD
  const { 
    availabilityData, 
    psychologist_id,
    specific_date,    
    start_time,
    end_time,
    is_available = true,
    notes = null,        
    weekday              
  } = req.body;

  if (!psychologist_id) {
    return res.status(400).json({ message: 'Error: psychologist_id es obligatorio en el body.' });
  }
=======
    const transaction = await sequelize.transaction();
>>>>>>> develop

  
  if (!specific_date && !weekday) {
    return res.status(400).json({ message: 'Error: specific_date o weekday es obligatorio.' });
  }
  try {
<<<<<<< HEAD
    if (specific_date) {
      const newAvailability = await AvailabilityModel.create({
        psychologist_id,
        specific_date,   
        start_time,
        end_time,
        is_available,    
        notes,           
        weekday: null    
      });
      return res.status(201).json(newAvailability);
    }


    if (!Array.isArray(availabilityData)) {
        return res.status(400).json({ message: 'El body debe contener un array availabilityData.' });
    }

    // 1. Validar que el psicólogo exista 
=======
    const psychologist_id = req.user.id; // se obtiene desde el token
    const { availabilityData } = req.body;

    if (!Array.isArray(availabilityData)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Debe enviar un array 'availabilityData' con las disponibilidades." });
    }

    // Verificar que el psicólogo exista
>>>>>>> develop
    const psychologist = await PsychologistModel.findOne({ where: { user_id: psychologist_id } });
    if (!psychologist) {
      await transaction.rollback();
      return res.status(404).json({ message: "Perfil de psicólogo no encontrado." });
    }

<<<<<<< HEAD
    // 2. Borrar todas las disponibilidades ANTIGUAS de este psicólogo (solo weekdays)
    await AvailabilityModel.destroy({
      where: { 
        psychologist_id: psychologist_id,
        specific_date: null 
      } 
=======
    // Validar duración mínima (≥ 30 minutos)
    for (const item of availabilityData) {
      if (!item.weekday || !item.start_time || !item.end_time) {
        await transaction.rollback();
        return res.status(400).json({ message: "Cada disponibilidad debe incluir 'weekday', 'start_time' y 'end_time'." });
      }

      const start = new Date(`1970-01-01T${item.start_time}:00`);
      const end = new Date(`1970-01-01T${item.end_time}:00`);
      const diffMinutes = (end - start) / (1000 * 60);

      if (diffMinutes < 30) {
        await transaction.rollback();
        return res.status(400).json({
          message: `El bloque del día ${item.weekday} debe durar al menos 30 minutos.`,
        });
      }
    }

    // Borrar disponibilidades anteriores
    await AvailabilityModel.destroy({
      where: { psychologist_id },
      transaction,
>>>>>>> develop
    });

  // Crear nuevas disponibilidades
    const availabilitiesToCreate = availabilityData.map(item => ({
<<<<<<< HEAD
      ...item,
      psychologist_id: psychologist_id,
      specific_date: null, 
      is_available: true,   
      notes: null         
=======
      psychologist_id,
      weekday: item.weekday,
      start_time: item.start_time,
      end_time: item.end_time,
      status: "available",
>>>>>>> develop
    }));

    const newAvailabilities = await AvailabilityModel.bulkCreate(availabilitiesToCreate, { transaction });

    await transaction.commit();
    res.status(201).json({
      message: "Disponibilidades actualizadas correctamente.",
      availabilities: newAvailabilities,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar disponibilidades:", error);
    res.status(500).json({
      message: "Error al actualizar disponibilidades.",
      error: error.message,
    });
  }
};

export const getAvailabilityByPsychologist = async (req, res) => {
  try {
    // Este ID viene de la URL (ej: /api/availability/psychologist/123)
    const { psychologistId } = req.params;
    const availabilities = await AvailabilityModel.findAll({
      where: { psychologist_id: psychologistId },
      order: [['weekday', 'ASC'], ['start_time', 'ASC']],
    });

    if (!availabilities) {
      return res.status(200).json([]);
    }
    res.status(200).json(availabilities);
  } catch (error) {
    console.error("Error fetching availability by psychologist:", error);
    res.status(500).json({ message: "Error retrieving availability", error });
  }
};

<<<<<<< HEAD
// Obtener disponibilidades por rango de fechas (para el calendario)
export const getAvailabilityByDateRange = async (req, res) => {
  try {
    const { psychologist_id } = req.params;
    const { start_date, end_date } = req.query; // Filtros opcionales para rango

    const where = {
      psychologist_id,
      specific_date: { [Op.not]: null } // Solo fechas específicas (calendario nuevo)
    };

    // Agregar filtro de rango si se proporciona
    if (start_date && end_date) {
      where.specific_date = {
        [Op.between]: [start_date, end_date]
      };
    }

    const availabilities = await AvailabilityModel.findAll({
      where,
      order: [['specific_date', 'ASC'], ['start_time', 'ASC']], // CAMBIO: Ordenar por fecha específica
    });

    res.status(200).json(availabilities || []);
  } catch (error) {
    console.error('Error fetching availability by date range:', error);
    res.status(500).json({ message: 'Error retrieving availability by date range', error });
  }
};

//  Actualizar disponibilidad específica (para editar desde el calendario)
export const updateSpecificAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      specific_date, 
      start_time, 
      end_time, 
      is_available, 
      notes 
    } = req.body;

    const [updated] = await AvailabilityModel.update({
      specific_date,  // Actualizar fecha específica
      start_time,
      end_time, 
      is_available,   //  Actualizar estado de disponibilidad
      notes          // Actualizar notas
    }, { 
      where: { id },
      returning: true 
    });

    if (!updated) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    //  Devolver el registro actualizado
    const updatedAvailability = await AvailabilityModel.findByPk(id);
    res.status(200).json(updatedAvailability);
  } catch (error) {
    console.error('Error updating specific availability:', error);
    res.status(400).json({ message: 'Error updating availability', error: error.message });
  }
};

//  Crear disponibilidad específica 
export const createSpecificAvailability = async (req, res) => {
  try {
    const { 
      psychologist_id,
      specific_date,
      start_time,
      end_time,
      is_available = true, // Por defecto disponible
      notes = null
    } = req.body;

    // Validaciones básicas
    if (!psychologist_id || !specific_date || !start_time || !end_time) {
      return res.status(400).json({ 
        message: 'psychologist_id, specific_date, start_time y end_time son obligatorios' 
      });
    }

    const newAvailability = await AvailabilityModel.create({
      psychologist_id,
      specific_date,
      start_time,
      end_time,
      is_available,
      notes,
      weekday: null // null para fechas específicas
    });

    res.status(201).json(newAvailability);
  } catch (error) {
    console.error('Error creating specific availability:', error);
    res.status(400).json({ message: 'Error creating specific availability', error: error.message });
  }
};

=======
>>>>>>> develop
export const updateAvailability = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { weekday, start_time, end_time } = req.body;

    const availability = await AvailabilityModel.findByPk(id, { transaction });
    if (!availability) {
      await transaction.rollback(); // Se agrega rollback en caso de error
      return res.status(404).json({ message: "No se encontró la disponibilidad" });
    }

    if (availability.psychologist_id !== req.user.id) {
      await transaction.rollback(); // Se agrega rollback en caso de error
      return res.status(403).json({ message: "No tienes permiso para actualizar esta disponibilidad" });
    }

    //No se puede actualizar una disponibilidad ya reservada
    if (availability.status === "booked") {
      await transaction.rollback();
      return res.status(400).json({ message: 'No se puede editar una disponibilidad reservada' });
    }

    //validacion minima de 30 minutos
    if (start_time && end_time) {
      const start = new Date(`1970-01-01T${start_time}:00`);
      const end = new Date(`1970-01-01T${end_time}:00`);
      const diffMinutes = (end - start) / (1000 * 60);
      if (diffMinutes < 30) {
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
    res.status(200).json({ message: "Disponibilidad actualizada correctamente", availability });
  } catch (error) {
    await transaction.rollback(); // Se agrega rollback en caso de error
    console.error('Error al actualizar disponibilidad:', error);
    res.status(500).json({ message: 'Error al actualizar disponibilidad.', error: error.message });
  }
};

//eliminar bloque de disponibilidad (solo psicologo)
export const deleteAvailability = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const availability = await AvailabilityModel.findByPk(id, { transaction }); // Se agrega transaction

    if (!availability) {
      await transaction.rollback(); // Se agrega rollback en caso de error
      return res.status(404).json({ message: "No se encontró la disponibilidad" });
    }

    if (availability.psychologist_id !== req.user.id) {
      await transaction.rollback(); // Se agrega rollback en caso de error
      return res.status(403).json({ message: "No tienes permiso para eliminar esta disponibilidad" });
    }

    //No permitir eliminar si hay una cita vinculada
    const assigned = await AppointmentModel.findOne({
      where: { availability_id: id },
      transaction,
    });
    if (assigned) { // Se agrega rollback en caso de error
      await transaction.rollback();
      return res.status(400).json({ message: "No se puede eliminar una disponibilidad vinculada a una cita" });
    }

    await availability.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({ message: "Disponibilidad eliminada correctamente" });
  } catch (error) { // Se agrega rollback en caso de error
    await transaction.rollback();
    console.error('Error al eliminar la disponibilidad:', error);
    res.status(500).json({ message: 'Error al eliminar la disponibilidad.', error: error.message });
  }
};

//Validacion: verificar minimo 5 bloques semanales
export const validateMinimumAvailability = async (req, res) => {
  try {
    const psychologist_id = req.user.id;

    const count = await AvailabilityModel.count({
      where: { psychologist_id },
    });

    if (count < 5) {
      return res.status(400).json({ // Se agrega return
        message: "El psicólogo debe tener al menos 5 bloques de disponibilidad semanales",
        currentCount: count,
      });
    }

    res.status(200).json({ message: "Disponibilidad minima cumplida", count });
  } catch (error) {
    console.error('Error al validar disponibilidad mínima:', error);
    res.status(500).json({ message: 'Error al validar disponibilidad mínima.', error: error.message });
  }
};