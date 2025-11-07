import AvailabilityModel from '../models/AvailabilityModel.js';
import PsychologistModel from '../models/PsychologistModel.js';
import { Op } from 'sequelize'; //  Para operadores de Sequelize (between, not, etc.)

export const getAllAvailabilities = async (req, res) => {
  try {
    const availabilities = await AvailabilityModel.findAll({
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
    console.error('Error fetching availabilities:', error);
    res.status(500).json({ message: 'Error retrieving availabilities', error });
  }
};

export const getAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await AvailabilityModel.findByPk(id, {
      include: [
        {
          model: PsychologistModel,
          as: 'psychologist',
          attributes: ['user_id', 'name', 'email'],
        },
      ],
    });
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Error retrieving availability', error });
  }
};

export const createAvailability = async (req, res) => {
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

  
  if (!specific_date && !weekday) {
    return res.status(400).json({ message: 'Error: specific_date o weekday es obligatorio.' });
  }
  try {
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
    const psychologist = await PsychologistModel.findOne({ where: { user_id: psychologist_id } });
    if (!psychologist) {
        return res.status(404).json({ message: 'Perfil de psicólogo no encontrado.' });
    }

    // 2. Borrar todas las disponibilidades ANTIGUAS de este psicólogo (solo weekdays)
    await AvailabilityModel.destroy({
      where: { 
        psychologist_id: psychologist_id,
        specific_date: null 
      } 
    });

    // 3. Preparar los nuevos datos, asociándolos al psicólogo
    const availabilitiesToCreate = availabilityData.map(item => ({
      ...item,
      psychologist_id: psychologist_id,
      specific_date: null, 
      is_available: true,   
      notes: null         
    }));

    // 4. Crear todas las nuevas disponibilidades
    if (availabilitiesToCreate.length > 0) {
        const newAvailabilities = await AvailabilityModel.bulkCreate(availabilitiesToCreate);
        res.status(201).json(newAvailabilities);
    } else {
        res.status(200).json({ message: 'Disponibilidad borrada, no se añadieron nuevos horarios.' });
    }

  } catch (error) {
    console.error('Error creating/updating availability:', error);
    res.status(400).json({ message: 'Error creating availability', error: error.message });
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
    console.error('Error fetching availability by psychologist:', error);
    res.status(500).json({ message: 'Error retrieving availability', error });
  }
};

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

export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await AvailabilityModel.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(400).json({ message: 'Error updating availability', error });
  }
};

export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AvailabilityModel.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ message: 'Error deleting availability', error });
  }
};