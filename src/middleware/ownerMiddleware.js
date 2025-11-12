import AppointmentModel from "../models/AppointmentModel.js";
import PatientModel from "../models/PatientModel.js";

const ownershipMiddleware = async (req, res, next) => {
  const user = req.user;
  const resourceId = req.params.id ? parseInt(req.params.id) : user?.id;

  if (!user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (user.role === "admin" || user.id === resourceId) {
    return next();
  }

  try {
    const patient = await PatientModel.findByPk(resourceId);
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    if (user.role === "psychologist") {
      const count = await AppointmentModel.count({
        where: {
          psychologist_id: user.id,
          patient_id: patient.user_id,
        },
      });
      if (count > 0) {
        return next();
      }
    }

    return res
      .status(403)
      .json({ message: "No tienes permiso para esta acción" });
  } catch (error) {
    console.error("Error en ownershipMiddleware:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default ownershipMiddleware;
