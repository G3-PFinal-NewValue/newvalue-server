import AppointmentModel from "../models/AppointmentModel.js";
import UserModel from "../models/UserModel.js";
import AvailabilityModel from "../models/AvailabilityModel.js";
import SessionModel from "../models/SessionModel.js";
import { sequelize } from "../config/database.js";
import { Op } from "sequelize";
import axios from "axios";

// Configuración de CometChat API
const APP_ID = process.env.COMETCHAT_APP_ID;
const REGION = process.env.COMETCHAT_REGION;
const REST_API_KEY =
  process.env.COMETCHAT_REST_API_KEY || process.env.COMETCHAT_AUTH_KEY;
const API_BASE_URL = `https://api-${REGION}.cometchat.io/v3`;

if (!APP_ID || !REGION || !REST_API_KEY) {
  console.warn(
    "⚠️ Faltan variables de entorno de CometChat (APP_ID, REGION o REST_API_KEY). Verifica tu archivo .env"
  );
}

const cometchatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    appId: APP_ID,
    apiKey: REST_API_KEY,
    "Content-Type": "application/json",
  },
});

const parseTimeString = (timeStr = "00:00") => {
  const [hours, minutes] = (timeStr ?? "00:00").split(":").map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
};

// -------------------------
// CONTROLADOR DE APPOINTMENTS
// -------------------------

// Obtener todas las citas
export const getAllAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      psychologist_id,
      patient_id,
      status,
    } = req.query;
    const offset = (page - 1) * limit;

    //que pacientes solo vean sus citas y psicólogos las suyas
    let whereClause = {};

    if (req.user.role === "patient") {
      whereClause.patient_id = req.user.id;
    } else if (req.user.role === "psychologist") {
      whereClause.psychologist_id = req.user.id;
    }

    //Filtros opcionales por query
    if (psychologist_id) whereClause.psychologist_id = psychologist_id;
    if (patient_id) whereClause.patient_id = patient_id;
    if (status) whereClause.status = status;

    const { rows: appointments, count } =
      await AppointmentModel.findAndCountAll({
        where: whereClause,
        include: [
          // CA: antes tenía name y en el modelo es last_name
          {
            model: UserModel,
            as: "patient",
            attributes: ["id", "first_name", "last_name", "email"],
          },
          {
            model: UserModel,
            as: "psychologist",
            attributes: ["id", "first_name", "last_name", "email"],
          },
          { model: SessionModel, as: "sessions" },
        ],
        order: [["date", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      appointments,
    });
  } catch (error) {
    console.error("Error al recuperar citas:", error);
    res
      .status(500)
      .json({ message: "Error al recuperar citas", error: error.message });
  }
};

// Obtener una cita por su ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("🔍 getAppointmentById - Parámetros:", {
      appointmentId: id,
      userId,
      userRole,
    });

    // Busca la cita en la base de datos con la información relacionada necesaria
    const appointment = await AppointmentModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "patient",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: UserModel,
          as: "psychologist",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        { model: SessionModel, as: "sessions" },
      ],
    });

    console.log(
      "📋 getAppointmentById - Resultado de búsqueda:",
      appointment ? "Encontrada" : "No encontrada"
    );

    if (!appointment) {
      console.error("❌ Cita no encontrada en el controller:", id);
      return res.status(404).send({ message: "Cita no encontrada." });
    }

    console.log("📋 getAppointmentById - Detalles de la cita:", {
      id: appointment.id,
      patient_id: appointment.patient_id,
      psychologist_id: appointment.psychologist_id,
      status: appointment.status,
    });

    // --- Verificación de Seguridad ---
    // Solo el paciente de la cita, el psicólogo de la cita,
    // o un admin pueden ver los detalles.
    const hasPermission =
      userRole === "admin" ||
      appointment.patient_id === userId ||
      appointment.psychologist_id === userId;

    console.log("🔐 getAppointmentById - Verificación de permisos:", {
      userRole,
      userId,
      patientId: appointment.patient_id,
      psychologistId: appointment.psychologist_id,
      hasPermission,
    });

    if (!hasPermission) {
      console.error("❌ Usuario sin permisos en controller:", userId);
      return res
        .status(403)
        .send({ message: "No tienes permiso para ver esta cita." });
    }

    console.log("✅ getAppointmentById - Enviando respuesta exitosa");

    // Asegurar que ambos usuarios existan en CometChat
    await ensureCometChatUsers(appointment);

    // Crear o verificar que el grupo existe
    await ensureCometChatGroup(appointment);

    // ¡Importante! El frontend espera { data: { ... } }
    res.status(200).send({ data: appointment });
  } catch (error) {
    console.error("💥 Error al obtener la cita por ID:", error);
    res.status(500).send({ message: "Error interno del servidor." });
  }
};
// Crear una nueva cita
export const createAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const patient_id = req.user.id;
    const {
      availability_id,
      psychologist_id,
      date,
      session_link,
      duration_minutes,
      notes,
    } = req.body;

    const duration = Number(duration_minutes) || 45;

    if (!availability_id || !psychologist_id || !date) {
      await transaction.rollback();
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const availability = await AvailabilityModel.findByPk(availability_id, {
      transaction,
    });
    if (!availability) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "La disponibilidad seleccionada no existe." });
    }

    if (availability.psychologist_id !== Number(psychologist_id)) {
      await transaction.rollback();
      return res.status(400).json({
        message: "La disponibilidad no pertenece al psicólogo seleccionado.",
      });
    }

    const slotStart = new Date(date);
    if (isNaN(slotStart.getTime())) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "La fecha de la cita no es válida." });
    }
    const slotEnd = new Date(slotStart.getTime() + duration * 60000);

    const availabilityDate = availability.specific_date
      ? new Date(`${availability.specific_date}T00:00:00`)
      : slotStart;

    const { hours: availStartHour, minutes: availStartMinute } =
      parseTimeString(availability.start_time);
    const { hours: availEndHour, minutes: availEndMinute } = parseTimeString(
      availability.end_time
    );

    const availabilityStart = new Date(availabilityDate);
    availabilityStart.setHours(availStartHour, availStartMinute, 0, 0);
    const availabilityEnd = new Date(availabilityDate);
    availabilityEnd.setHours(availEndHour, availEndMinute, 0, 0);

    if (slotStart < availabilityStart || slotEnd > availabilityEnd) {
      await transaction.rollback();
      return res.status(400).json({
        message: "La cita seleccionada está fuera del horario disponible.",
      });
    }

    const existingAppointments = await AppointmentModel.findAll({
      where: {
        availability_id,
        status: { [Op.in]: ["pending", "confirmed"] },
      },
      transaction,
    });

    const overlaps = existingAppointments.some((appointment) => {
      const existingStart = new Date(appointment.date);
      const existingEnd = new Date(
        existingStart.getTime() + (appointment.duration_minutes || 45) * 60000
      );
      return slotStart < existingEnd && slotEnd > existingStart;
    });

    if (overlaps) {
      await transaction.rollback();
      return res.status(400).json({
        message: "La disponibilidad seleccionada ya está ocupada.",
      });
    }

    const newAppointment = await AppointmentModel.create(
      {
        patient_id,
        psychologist_id,
        availability_id,
        date: slotStart,
        duration_minutes: duration,
        status: "pending",
        session_link: session_link || null,
        notes: notes || "",
      },
      { transaction }
    );

    await transaction.commit();
    res
      .status(201)
      .json({
        message: "Cita creada correctamente",
        appointment: newAppointment,
      });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear cita:", error);
    res
      .status(500)
      .json({ message: "Error al crear cita", error: error.message });
  }
};

//Actualizar cita
export const updateAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      status,
      session_link,
      notes,
      availability_id,
      date,
      duration_minutes,
    } = req.body;

    const appointment = await AppointmentModel.findByPk(id, { transaction });
    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    if (
      req.user.role !== "admin" &&
      req.user.id !== appointment.patient_id &&
      req.user.id !== appointment.psychologist_id
    ) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar esta cita." });
    }

    const wantsReschedule =
      availability_id || date || duration_minutes !== undefined;

    if (wantsReschedule) {
      if (!availability_id || !date) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "Para reprogramar necesitas enviar availability_id y la nueva fecha.",
        });
      }

      const newAvailability = await AvailabilityModel.findByPk(
        availability_id,
        { transaction }
      );

      if (!newAvailability) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "La disponibilidad seleccionada no existe." });
      }

      if (newAvailability.psychologist_id !== appointment.psychologist_id) {
        await transaction.rollback();
        return res.status(400).json({
          message: "La disponibilidad no pertenece a tu psicólogo.",
        });
      }

      const slotStart = new Date(date);
      if (isNaN(slotStart.getTime())) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "La fecha proporcionada no es válida." });
      }

      const duration =
        Number(duration_minutes) || appointment.duration_minutes || 45;
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      const availabilityDate = newAvailability.specific_date
        ? new Date(`${newAvailability.specific_date}T00:00:00`)
        : slotStart;

      const { hours: availStartHour, minutes: availStartMinute } =
        parseTimeString(newAvailability.start_time);
      const { hours: availEndHour, minutes: availEndMinute } = parseTimeString(
        newAvailability.end_time
      );

      const availabilityStart = new Date(availabilityDate);
      availabilityStart.setHours(availStartHour, availStartMinute, 0, 0);
      const availabilityEnd = new Date(availabilityDate);
      availabilityEnd.setHours(availEndHour, availEndMinute, 0, 0);

      if (slotStart < availabilityStart || slotEnd > availabilityEnd) {
        await transaction.rollback();
        return res.status(400).json({
          message: "La nueva cita está fuera del horario disponible.",
        });
      }

      const overlapping = await AppointmentModel.findAll({
        where: {
          availability_id,
          id: { [Op.ne]: appointment.id },
          status: { [Op.in]: ["pending", "confirmed"] },
        },
        transaction,
      });

      const hasConflict = overlapping.some((app) => {
        const existingStart = new Date(app.date);
        const existingEnd = new Date(
          existingStart.getTime() + (app.duration_minutes || 45) * 60000
        );
        return slotStart < existingEnd && slotEnd > existingStart;
      });

      if (hasConflict) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "La disponibilidad seleccionada ya está ocupada." });
      }

      appointment.availability_id = availability_id;
      appointment.date = slotStart;
      appointment.duration_minutes = duration;
      appointment.status = "pending";
    }

    if (status) appointment.status = status;
    if (session_link) appointment.session_link = session_link;
    if (notes) appointment.notes = notes;

    await appointment.save({ transaction });
    await transaction.commit();

    res
      .status(200)
      .json({ message: "Cita actualizada correctamente", appointment });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar cita:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar cita", error: error.message });
  }
};

//Eliminar cita
export const deleteAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const appointment = await AppointmentModel.findByPk(id, { transaction });
    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    //Validar permisos
    if (
      req.user.role !== "admin" &&
      req.user.id !== appointment.patient_id &&
      req.user.id !== appointment.psychologist_id
    ) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta cita." });
    }

    //liberar la disponibilidad si existia
    if (appointment.availability_id) {
      const availability = await AvailabilityModel.findByPk(
        appointment.availability_id,
        { transaction }
      );
      if (availability) {
        availability.status = "available";
        await availability.save({ transaction });
      }
    }

    await appointment.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al eliminar cita:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar cita", error: error.message });
  }
};

/**
 * Actualizar estado de una cita específica
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar que el status sea válido
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Estado no válido. Debe ser: pending, confirmed, cancelled, o completed",
      });
    }

    // Buscar la cita con información del paciente y psicólogo
    const appointment = await AppointmentModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "patient",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: UserModel,
          as: "psychologist",
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada",
      });
    }

    // Verificar permisos: solo el paciente o psicólogo involucrado puede actualizar
    const userRole = req.user.role?.name || req.user.role;
    const userId = req.user.id;

    if (userRole === "patient" && appointment.patient_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para modificar esta cita",
      });
    }

    if (userRole === "psychologist" && appointment.psychologist_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para modificar esta cita",
      });
    }

    // Actualizar el estado
    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: "Cita actualizada exitosamente",
      appointment: {
        id: appointment.id,
        patient_id: appointment.patient_id,
        psychologist_id: appointment.psychologist_id,
        date: appointment.date,
        duration_minutes: appointment.duration_minutes,
        status: appointment.status,
        patient: appointment.patient
          ? {
              first_name: appointment.patient.first_name,
              last_name: appointment.patient.last_name,
              email: appointment.patient.email,
            }
          : null,
        psychologist: appointment.psychologist
          ? {
              first_name: appointment.psychologist.first_name,
              last_name: appointment.psychologist.last_name,
              email: appointment.psychologist.email,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error actualizando estado de cita:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Función para asegurar que los usuarios de una cita existan en CometChat
const ensureCometChatUsers = async (appointment) => {
  try {
    console.log(
      "🔧 Asegurando usuarios en CometChat para la cita:",
      appointment.id
    );

    const patientId = appointment.patient_id.toString();
    const psychologistId = appointment.psychologist_id.toString();

    // Crear usuario paciente si no existe
    try {
      await cometchatApi.post("/users", {
        uid: patientId,
        name: `${appointment.patient.first_name} ${appointment.patient.last_name}`,
      });
      console.log("✅ Usuario paciente creado en CometChat:", patientId);
    } catch (error) {
      if (error.response?.data?.error?.code === "ERR_UID_ALREADY_EXISTS") {
        console.log("ℹ️ Usuario paciente ya existe en CometChat:", patientId);
      } else {
        console.error(
          "❌ Error al crear usuario paciente en CometChat:",
          error.response?.data || error.message
        );
      }
    }

    // Crear usuario psicólogo si no existe
    try {
      await cometchatApi.post("/users", {
        uid: psychologistId,
        name: `${appointment.psychologist.first_name} ${appointment.psychologist.last_name}`,
      });
      console.log("✅ Usuario psicólogo creado en CometChat:", psychologistId);
    } catch (error) {
      if (error.response?.data?.error?.code === "ERR_UID_ALREADY_EXISTS") {
        console.log(
          "ℹ️ Usuario psicólogo ya existe en CometChat:",
          psychologistId
        );
      } else {
        console.error(
          "❌ Error al crear usuario psicólogo en CometChat:",
          error.response?.data || error.message
        );
      }
    }
  } catch (error) {
    console.error("💥 Error general al asegurar usuarios en CometChat:", error);
    // No lanzamos el error para que no bloquee la respuesta de la cita
  }
};

// Función para asegurar que el grupo de chat existe para una cita
const ensureCometChatGroup = async (appointment) => {
  try {
    const groupId = `cita_${appointment.id}`;
    console.log("🏠 Asegurando grupo en CometChat:", groupId);

    let groupData;

    try {
      const existingGroup = await cometchatApi.get(`/groups/${groupId}`);
      console.log("ℹ️ Grupo ya existe en CometChat:", groupId);
      groupData = existingGroup.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("🆕 Grupo no existe, creando nuevo grupo:", groupId);

        const groupPayload = {
          guid: groupId,
          name: `Consulta ${appointment.id}`,
          type: "private",
          description: `Grupo de chat para la consulta entre ${appointment.patient.first_name} y ${appointment.psychologist.first_name}`,
        };

        const newGroup = await cometchatApi.post("/groups", groupPayload);
        console.log("✅ Grupo creado en CometChat:", groupId);
        groupData = newGroup.data;
      } else {
        throw error;
      }
    }

    await ensureGroupMembers(groupId, appointment);

    return groupData;
  } catch (error) {
    console.error(
      "💥 Error general al asegurar grupo en CometChat:",
      error.response?.data || error.message
    );
    // No lanzamos el error para que no bloquee la respuesta de la cita
  }
};

const ensureGroupMembers = async (groupId, appointment) => {
  const patientId = appointment.patient_id?.toString();
  const psychologistId = appointment.psychologist_id?.toString();

  await addMemberToGroup(groupId, patientId, "participant");
  await addMemberToGroup(groupId, psychologistId, "admin");
};

const addMemberToGroup = async (groupId, userId, role = "participant") => {
  if (!userId) return;

  const payloadKey = role === "admin" ? "admins" : "participants";
  const payload = {
    [payloadKey]: [userId],
  };

  try {
    await cometchatApi.post(`/groups/${groupId}/members`, payload);
    console.log(`👥 Usuario ${userId} añadido al grupo ${groupId} (${role}).`);
  } catch (error) {
    const errorCode = error.response?.data?.error?.code;
    if (errorCode === "ERR_UID_ALREADY_A_MEMBER") {
      console.log(`ℹ️ Usuario ${userId} ya era miembro del grupo ${groupId}.`);
    } else {
      console.error(
        `❌ Error al añadir usuario ${userId} (rol: ${role}) al grupo ${groupId}:`,
        error.response?.data || error.message
      );
    }
  }
};
