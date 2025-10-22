const SessionModel = require('../models/SessionModel');
const AppointmentModel = require('../models/AppointmentModel');

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await SessionModel.findAll({
      include: [
        {
          model: AppointmentModel,
          as: 'appointment',
          attributes: ['id', 'date', 'status'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Error retrieving sessions', error });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await SessionModel.findByPk(id, {
      include: [
        {
          model: AppointmentModel,
          as: 'appointment',
          attributes: ['id', 'date', 'status'],
        },
      ],
    });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Error retrieving session', error });
  }
};

exports.createSession = async (req, res) => {
  try {
    const newSession = await SessionModel.create(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(400).json({ message: 'Error creating session', error });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await SessionModel.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json({ message: 'Session updated successfully' });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(400).json({ message: 'Error updating session', error });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SessionModel.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Error deleting session', error });
  }
};
