import PatientModel from "../models/PatientModel.js";

// Obtener todos los pacientes activos (por defecto)
export const getAllPatients = async (req, res) => {
    try {
        const { includeInactive } = req.query; // ?includeInactive=true
        const whereClause = includeInactive ? {} : { status: 'active' };

        const patients = await PatientModel.findAll({ where: whereClause });
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
        res.status(400).json({ message: error.message });
    }
};

// Obtener paciente por ID
export const getPatientById = async (req, res) => {
    try {
        const patient = await PatientModel.findByPk(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
        res.status(200).json(patient);
    } catch (error) {
        console.error('Error al obtener el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Crear nuevo paciente
export const createPatient = async (req, res) => {
    try {
        const newPatient = await PatientModel.create({ ...req.body, status: 'active' });
        res.status(201).json({ message: 'Paciente creado correctamente', patient: newPatient });
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar paciente
export const updatePatient = async (req, res) => {
    try {
        const [rowsUpdated] = await PatientModel.update(req.body, {
            where: { user_id: req.params.id },
        });

        if (rowsUpdated === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        const updatedPatient = await PatientModel.findByPk(req.params.id);
        res.status(200).json({ message: 'Paciente actualizado', patient: updatedPatient });
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar objetivos de terapia y historial médico
export const updateTherapyData = async (req, res) => {
    try {
        const patient = await PatientModel.findByPk(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });

        const { therapy_goals, medical_history } = req.body;
        if (therapy_goals !== undefined) patient.therapy_goals = therapy_goals;
        if (medical_history !== undefined) patient.medical_history = medical_history;

        await patient.save();
        res.status(200).json({ message: 'Datos de terapia actualizados', patient });
    } catch (error) {
        console.error('Error al actualizar datos de terapia:', error);
        res.status(400).json({ message: error.message });
    }
};

// "Eliminar" paciente (desactivar cuenta)
export const deactivatePatient = async (req, res) => {
    try {
        const [rowsUpdated] = await PatientModel.update(
            { status: 'inactive' },
            { where: { user_id: req.params.id } }
        );

        if (rowsUpdated === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        res.status(200).json({ message: 'Cuenta de paciente desactivada correctamente' });
    } catch (error) {
        console.error('Error al desactivar el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Reactivar paciente
export const activatePatient = async (req, res) => {
    try {
        const [rowsUpdated] = await PatientModel.update(
            { status: 'active' },
            { where: { user_id: req.params.id } }
        );

        if (rowsUpdated === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        res.status(200).json({ message: 'Cuenta de paciente reactivada correctamente' });
    } catch (error) {
        console.error('Error al reactivar el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Eliminar paciente permanentemente (solo si realmente lo necesitas)
export const deletePatient = async (req, res) => {
    try {
        const rowsDeleted = await PatientModel.destroy({
            where: { user_id: req.params.id },
            force: false, // si usas paranoid:true, false = soft delete
        });

        if (rowsDeleted === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        res.status(200).json({ message: 'Paciente eliminado (soft delete)' });
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Historial de sesiones del paciente
export const getPatientSessions = async (req, res) => {
    try {
        const sessions = await SessionModel.findAll({
            where: { patient_id: req.params.id },
        });
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error al obtener sesiones del paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Citas del paciente
export const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await AppointmentModel.findAll({
            where: { patient_id: req.params.id },
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error al obtener citas del paciente:', error);
        res.status(400).json({ message: error.message });
    }
};