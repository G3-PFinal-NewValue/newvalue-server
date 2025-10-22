const AppointmentModel = require('../models/AppointmentModel');
const UserModel = require('../models/UserModel');
const SessionModel = require('../models/SessionModel');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.findAll({
      include: [
        { model: UserModel, as: 'patient', attributes: ['id', 'name', 'email'] },
        { model: UserModel, as: 'psychologist', attributes: ['id', 'name', 'email'] },
        { model: SessionModel, as: 'sessions' },
      ],
      order: [['date', 'ASC']],
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentModel.findByPk(id, {
      include: [
        { model: UserModel, as: 'patient' },
        { model: UserModel, as: 'psychologist' },
        { model: SessionModel, as: 'sessions' },
      ],
    });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointment', error });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const newAppointment = await AppointmentModel.create(req.body);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating appointment', error });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await AppointmentModel.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating appointment', error });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AppointmentModel.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};