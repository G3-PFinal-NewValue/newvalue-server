import { sequelize } from "./src/config/database.js";
import AppointmentModel from "./src/models/AppointmentModel.js";

const checkAppointments = async () => {
  try {
    await sequelize.authenticate();
    console.log("📊 Verificando citas en la base de datos...");

    const appointments = await AppointmentModel.findAll({
      attributes: ["id", "patient_id", "psychologist_id", "status", "date"],
    });

    console.log("📋 Total de citas encontradas:", appointments.length);

    if (appointments.length === 0) {
      console.log("❌ No hay citas en la base de datos");
    } else {
      appointments.forEach((apt) => {
        console.log(
          `📄 ID: ${apt.id}, Patient: ${apt.patient_id}, Psychologist: ${apt.psychologist_id}, Status: ${apt.status}, Date: ${apt.date}`
        );
      });
    }

    // Específicamente buscar la cita ID 5
    const appointment5 = await AppointmentModel.findByPk(5);
    console.log("🔍 Cita ID 5:", appointment5 ? "Existe" : "No existe");
    if (appointment5) {
      console.log("📄 Detalles de cita 5:", {
        id: appointment5.id,
        patient_id: appointment5.patient_id,
        psychologist_id: appointment5.psychologist_id,
        status: appointment5.status,
        date: appointment5.date,
      });
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("💥 Error:", error);
    process.exit(1);
  }
};

checkAppointments();
