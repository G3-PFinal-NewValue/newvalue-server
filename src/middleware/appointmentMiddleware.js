import AppointmentModel from "../models/AppointmentModel.js";

const appointmentOwnershipMiddleware = async (req, res, next) => {
  const user = req.user; // viene del authMiddleware
  const appointmentId = parseInt(req.params.id);

  console.log("🔍 AppointmentMiddleware - Usuario:", {
    id: user?.id,
    role: user?.role,
  });
  console.log(
    "🔍 AppointmentMiddleware - AppointmentId desde params:",
    req.params.id
  );
  console.log(
    "🔍 AppointmentMiddleware - AppointmentId parseado:",
    appointmentId
  );

  if (!user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (isNaN(appointmentId)) {
    console.error("❌ AppointmentId no válido:", req.params.id);
    return res.status(400).json({ message: "ID de cita no válido" });
  }

  try {
    console.log("📋 Buscando cita en la base de datos...");
    const appointment = await AppointmentModel.findByPk(appointmentId);
    console.log(
      "📋 Resultado de la búsqueda:",
      appointment ? "Encontrada" : "No encontrada"
    );

    if (appointment) {
      console.log("📋 Detalles de la cita:", {
        id: appointment.id,
        patient_id: appointment.patient_id,
        psychologist_id: appointment.psychologist_id,
        status: appointment.status,
      });
    }

    if (!appointment) {
      console.error("❌ Cita no encontrada en BD:", appointmentId);
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // Solo puede modificar/eliminar si es el paciente o el psicólogo asignado
    const hasPermission =
      user.role === "admin" ||
      user.id === appointment.patient_id ||
      user.id === appointment.psychologist_id;

    console.log("🔐 Verificación de permisos:", {
      userRole: user.role,
      userId: user.id,
      patientId: appointment.patient_id,
      psychologistId: appointment.psychologist_id,
      hasPermission,
    });

    if (hasPermission) {
      return next();
    }

    console.error("❌ Usuario sin permisos para acceder a la cita");
    return res
      .status(403)
      .json({ message: "No tienes permiso para esta acción" });
  } catch (err) {
    console.error("💥 Error en appointmentOwnershipMiddleware:", err);
    return res
      .status(500)
      .json({ message: "Error verificando propiedad de la cita" });
  }
};

export default appointmentOwnershipMiddleware;
