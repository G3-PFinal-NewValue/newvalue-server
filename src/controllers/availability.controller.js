import AvailabilityModel from '../models/AvailabilityModel.js';
import PsychologistModel from '../models/PsychologistModel.js';

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
 
  const { availabilityData, psychologist_id } = req.body;

  if (!psychologist_id) {
    return res.status(400).json({ message: 'Error: psychologist_id es obligatorio en el body.' });
  }
  if (!Array.isArray(availabilityData)) {
      return res.status(400).json({ message: 'El body debe contener un array availabilityData.' });
  }

  try {
    // 1. Validar que el psicólogo exista 
    const psychologist = await PsychologistModel.findOne({ where: { user_id: psychologist_id } });
    if (!psychologist) {
        return res.status(404).json({ message: 'Perfil de psicólogo no encontrado.' });
    }

    // 2. Borrar todas las disponibilidades ANTIGUAS de este psicólogo
    await AvailabilityModel.destroy({
      where: { psychologist_id: psychologist_id } 
    });

    // 3. Preparar los nuevos datos, asociándolos al psicólogo
    const availabilitiesToCreate = availabilityData.map(item => ({
      ...item,
      psychologist_id: psychologist_id, 
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

// ESTA ES NUEVA Y CORRESPONDE A LA RUTA ADICIONADA
// Obtener disponibilidades por ID de psicólogo
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

// export const createAvailability = async (req, res) => {
//   try {
//     const newAvailability = await AvailabilityModel.create(req.body);
//     res.status(201).json(newAvailability);
//   } catch (error) {
//     console.error('Error creating availability:', error);
//     res.status(400).json({ message: 'Error creating availability', error });
//   }
// };

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