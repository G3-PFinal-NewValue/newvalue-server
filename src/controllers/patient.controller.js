import PatientModel from "../models/PatientModel.js";
import UserModel from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";
import AppointmentModel from "../models/AppointmentModel.js"; // CA: necesario para vincular pacientes con citas del psicólogo

// Obtener todos los pacientes (admin)
export const getAllPatients = async (req, res) => {
    try {
        const userRole = req.user.role?.name || req.user.role; // CA: tolerar payloads donde role es objeto

        if (userRole === "admin") { // CA: admins mantienen listado completo
            const { includeInactive } = req.query; // ?includeInactive=true
            const whereClause = includeInactive ? {} : { status: 'active' };

            const patients = await PatientModel.findAll({
                where: whereClause,
                include: {
                    model: UserModel,
                    as: 'user',
                    include: { model: RoleModel, as: 'role' },
                },
            });
            return res.status(200).json(patients);
        }

        if (userRole === "psychologist") { // CA: cada psicólogo solo ve pacientes con citas suyas
            const appointments = await AppointmentModel.findAll({
                where: { psychologist_id: req.user.id },
                attributes: ["patient_id"],
                group: ["patient_id"],
                raw: true,
            });

            const patientIds = appointments.map((appt) => appt.patient_id).filter(Boolean);
            if (patientIds.length === 0) {
                return res.status(200).json([]);
            }

            const patients = await PatientModel.findAll({
                where: { user_id: patientIds },
                include: {
                    model: UserModel,
                    as: "user",
                    attributes: ["first_name", "last_name", "email"],
                },
            });

            return res.status(200).json(patients);
        }

        return res.status(403).json({ message: "No autorizado" }); // CA: otros roles no pueden listar pacientes
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
        res.status(400).json({ message: error.message });
    }
};

// Obtener paciente por ID (solo admin)
export const getPatientById = async (req, res) => {
    try {
        const patient = await PatientModel.findByPk(req.params.id, {
            include: { model: UserModel, as: 'user' },
        });

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
        const [rowsUpdated] = await PatientModel.update(req.body, {
            where: { user_id: req.params.id},
        });

        if (rowsUpdated === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const updatedPatient = await PatientModel.findOne({ where: { user_id } });
        res.status(200).json({ message: 'Paciente actualizado', patient: updatedPatient });
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// desactivar cuenta 
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
        const deleted = await PatientModel.destroy({
            where: { user_id: req.params.id },
            force: false, 
        });

        if (deleted === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        res.status(200).json({ message: 'Paciente eliminado (soft delete)' });
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

//PARA EL PACIENTE
// 👤 Obtener el perfil del paciente autenticado
export const getMyProfile = async (req, res) => {
    try {
        const patient = await PatientModel.findOne({
            where: { user_id: req.user.id },
            include: { model: UserModel, as: "user" },
        });

        if (!patient) return res.status(404).json({ message: "Perfil no encontrado" });

        res.status(200).json(patient);
    } catch (error) {
        console.error("Error al obtener el perfil del paciente:", error);
        res.status(400).json({ message: error.message });
    }
};

// ✏️ Actualizar el perfil del paciente autenticado
export const updateMyProfile = async (req, res) => {
    try {
        const { birth_date, gender, therapy_goals, medical_history, photo } = req.body;

        const [updated] = await PatientModel.update(
            { birth_date, gender, therapy_goals, medical_history, photo },
            { where: { user_id: req.user.id } }
        );

        if (!updated) return res.status(404).json({ message: "Perfil no encontrado" });

        const updatedProfile = await PatientModel.findOne({ where: { user_id: req.user.id } });
        res.status(200).json({ message: "Perfil actualizado correctamente", patient: updatedProfile });
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(400).json({ message: error.message });
    }
};
