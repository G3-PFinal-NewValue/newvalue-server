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
  try {
    const newAvailability = await AvailabilityModel.create(req.body);
    res.status(201).json(newAvailability);
  } catch (error) {
    console.error('Error creating availability:', error);
    res.status(400).json({ message: 'Error creating availability', error });
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