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
        const user_id = req.user.id; 

        //validar si el paciente ya existe
        const existingPatient = await PatientModel.findOne({ where: { user_id } });
        if (existingPatient) {
            return res.status(400).json({ message: 'El paciente ya existe' });
        }

        const { birth_date, gender, therapy_goals, medical_history, photo } = req.body;

        //crear paciente
        const newPatient = await PatientModel.create({
            user_id,
            birth_date,
            gender,
            therapy_goals,
            medical_history,
            photo,
            status: 'active'
        });
        res.status(201).json({ message: 'Paciente creado correctamente', patient: newPatient });
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar paciente
export const updatePatient = async (req, res) => {
    try {
        const user_id = req.user.id;

        const [rowsUpdated] = await PatientModel.update(req.body, {
            where: { user_id },
        });

        if (rowsUpdated === 0){
            return res.status(404).json({ message: 'Paciente no encontrado' });
        } 

        const updatedPatient = await PatientModel.findOne({ where: { user_id } });
        res.status(200).json({ message: 'Paciente actualizado', patient: updatedPatient });
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
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