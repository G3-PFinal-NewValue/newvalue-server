import AppointmentModel from '../models/AppointmentModel.js';

const appointmentOwnershipMiddleware = async (req, res, next) => {
    const user = req.user; // viene del authMiddleware
    const appointmentId = parseInt(req.params.id);

    if (!user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    try {
        const appointment = await AppointmentModel.findByPk(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        // Solo puede modificar/eliminar si es el paciente o el psicólogo asignado
        if (user.role === "admin" || user.id === appointment.patient_id || user.id === appointment.psychologist_id) {
            return next();
        }

        return res.status(403).json({ message: "No tienes permiso para esta acción" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error verificando propiedad de la cita" });
    }
};

export default appointmentOwnershipMiddleware;
