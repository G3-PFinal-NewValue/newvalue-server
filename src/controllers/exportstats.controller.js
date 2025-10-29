import { sequelize } from "../config/database.js"
import ExcelJS from "exceljs";
import UserModel from "../models/UserModel.js";
import AppointmentModel from "../models/AppointmentModel.js";

export const exportStats = async (req, res) => {
  try {
    // 📊 1. Datos generales
    const totalUsers = await UserModel.count();
    const totalPsychologists = await UserModel.count({ where: { role_id: 2 } });
    const totalPatients = await UserModel.count({ where: { role_id: 1 } });
    const activeUsers = await UserModel.count({ where: { status: "active" } });
    const inactiveUsers = await UserModel.count({ where: { status: "inactive" } });

    // 📅 2. Datos de citas
    const totalAppointments = await AppointmentModel.count();
    const cancelledAppointments = await AppointmentModel.count({ where: { status: "cancelled" } });
    const completedAppointments = await AppointmentModel.count({ where: { status: "completed" } });
    const pendingAppointments = await AppointmentModel.count({ where: { status: "pending" } });

    // 🧮 3. Crear libro Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Coramind System";
    workbook.created = new Date();

    // --- Hoja 1: Estadísticas globales ---
    const sheet1 = workbook.addWorksheet("Resumen General");
    sheet1.columns = [
      { header: "Métrica", key: "metric", width: 35 },
      { header: "Valor", key: "value", width: 15 },
    ];

    const dataRows = [
      { metric: "Total de usuarios", value: totalUsers },
      { metric: "Psicólogos registrados", value: totalPsychologists },
      { metric: "Pacientes registrados", value: totalPatients },
      { metric: "Usuarios activos", value: activeUsers },
      { metric: "Usuarios inactivos", value: inactiveUsers },
      { metric: "Total de citas", value: totalAppointments },
      { metric: "Citas completadas", value: completedAppointments },
      { metric: "Citas canceladas", value: cancelledAppointments },
      { metric: "Citas pendientes", value: pendingAppointments },
    ];
    sheet1.addRows(dataRows);

    // --- Hoja 2: Citas por mes ---
    const sheet2 = workbook.addWorksheet("Citas por mes");
    const appointmentsByMonth = await AppointmentModel.findAll({
      attributes: [
        [sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["month"],
      raw: true,
    });

    sheet2.columns = [
      { header: "Mes", key: "month", width: 15 },
      { header: "Número de citas", key: "count", width: 20 },
    ];
    sheet2.addRows(appointmentsByMonth);

    // 📦 4. Enviar archivo al frontend
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=estadisticas_coramind.xlsx");

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error al generar estadísticas:", error);
    res.status(500).json({ message: "Error al generar el Excel" });
  }
};