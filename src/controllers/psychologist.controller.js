import PsychologistModel from "../models/PsychologistModel.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import SpecialityModel from "../models/SpecialityModel.js";
import fs from "fs";
import { sequelize } from "../config/database.js";
import UserModel from "../models/UserModel.js";
import AvailabilityModel from "../models/AvailabilityModel.js";

// Obtener todos los psicólogos (activos y validados)
export const getAllPsychologists = async (req, res) => {
  try {
    const { includeInactive, specialities } = req.query;

    const whereClause = includeInactive
      ? {}
      : { status: "active", validated: true };

    const include = [
      {
        model: SpecialityModel,
        as: "specialities",
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    ];

    // Si hay filtro por especialidades
    if (specialities) {
      const specialityIds = specialities.split(",").map((id) => parseInt(id));
      include[0].where = { id: specialityIds };
    }

    const psychologists = await PsychologistModel.findAll({
      where: whereClause,
      include,
    });

    res.status(200).json(psychologists);
  } catch (error) {
    console.error("Error al obtener los psicólogos/as:", error);
    res.status(400).json({ message: error.message });
  }
};

// GET por user_id
//CA: Agregan User Model y Availability model
export const getPsychologistById = async (req, res) => {
  try {
    const profile = await PsychologistModel.findOne({
      where: { user_id: req.params.id },
      include: [
        {
          model: SpecialityModel,
          as: "specialities",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
        {
          model: UserModel, // <-- Añade el modelo User
          as: "user", // <-- Usa el alias que definimos
          attributes: ["first_name", "last_name", "email", "avatar"], // Trae solo los datos necesarios
        },
        {
          model: AvailabilityModel, // <-- Añade el modelo Availability
          as: "availabilities", // <-- Usa el alias que definimos
          attributes: ["weekday", "start_time", "end_time"], // Trae los datos necesarios
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ message: "Psicólogo/a no encontrado/a" });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error al obtener el psicólogo/a:", error);
    res.status(400).json({ message: error.message });
  }
};

// POST: crear perfil de psicólogo con foto opcional
export const createPsychologistProfile = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const user_id = req.user.id;
    const { license_number, specialities, professional_description } = req.body;

    //Validación Basica
    if (!license_number) {
      return res
        .status(400)
        .json({ message: "El número de colegiado es obligatorio" });
    }

    //Verificar si ya existe un perfil para este usuario
    const existingProfile = await PsychologistModel.findOne({
      where: { user_id },
    });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Ya existe un perfil para este usuario" });
    }

    //Subida opcional de foto a Cloudinary
    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "psychologists",
      });
      imageUrl = result.secure_url;
      publicId = result.public_id;
      fs.unlinkSync(req.file.path); // eliminar archivo temporal
    }

    // Crear perfil
    const newProfile = await PsychologistModel.create({
      user_id,
      license_number,
      professional_description,
      photo: imageUrl,
      photo_public_id: publicId,
      status: "active",
      validated: false,
    });

    //si envia especialidades ( pueden ser nombres o ids)
    if (specialities) {
      const specialityArray = Array.isArray(specialities)
        ? specialities
        : JSON.parse(specialities);

      const specialityInstances = await Promise.all(
        specialityArray.map(async (item) => {
          if (!item) return null;
          if (!isNaN(item)) {
            return SpecialityModel.findByPk(item);
          } else {
            const [speciality] = await SpecialityModel.findOrCreate({
              where: { name: item.trim() },
            });
            return speciality;
          }
        })
      );

      //asociar las especialidades al psicologo
      await newProfile.setSpecialities(specialityInstances.filter(Boolean));
    }

    // Incluir especialidades en la respuesta
    const createdProfile = await PsychologistModel.findByPk(
      newProfile.user_id,
      {
        include: {
          model: SpecialityModel,
          as: "specialities",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      }
    );

    res.status(201).json({
      message: "Perfil de psicólogo/a creado correctamente",
      profile: newProfile,
    });
  } catch (error) {
    console.error("Error al crear el perfil:", error);
    res.status(400).json({ message: error.message });
  }
};

// PUT: actualizar perfil de psicólogo con posible nueva foto
export const updatePsychologistProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      license_number,
      specialities,
      professional_description,
      status,
      validated,
    } = req.body;

    const profile = await PsychologistModel.findOne({ where: { user_id: id } });
    if (!profile) {
      return res.status(404).json({ message: "Psicólogo/a no encontrado" });
    }

    // Subir nueva foto si existe
    if (req.file) {
      if (profile.photo_public_id) {
        await cloudinary.uploader.destroy(profile.photo_public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "psychologists",
      });
      profile.photo = result.secure_url;
      profile.photo_public_id = result.public_id;
      fs.unlinkSync(req.file.path);
    }

    // Actualizar campos básicos
    if (license_number) profile.license_number = license_number;
    if (professional_description)
      profile.professional_description = professional_description;
    if (status) profile.status = status;
    if (validated !== undefined) profile.validated = validated;

    // Actualizar especialidades
    if (specialities) {
      const specialityArray = Array.isArray(specialities)
        ? specialities
        : JSON.parse(specialities);

      const specialityInstances = await Promise.all(
        specialityArray.map(async (item) => {
          if (!item) return null;
          if (!isNaN(item)) {
            return SpecialityModel.findByPk(item);
          } else {
            const [speciality] = await SpecialityModel.findOrCreate({
              where: { name: item.trim() },
            });
            return speciality;
          }
        })
      );

      // Reemplazar las especialidades anteriores por las nuevas
      await profile.setSpecialities(specialityInstances.filter(Boolean));
    }

    await profile.save();

    const updatedProfile = await PsychologistModel.findByPk(id, {
      include: {
        model: SpecialityModel,
        as: "specialities",
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    });

    res.status(200).json({
      message: "Perfil de psicólogo/a actualizado correctamente",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res
      .status(400)
      .json({ message: "Error al actualizar el perfil", error: error.message });
  }
};

// Desactivar psicólogo (activar/inactivar)
export const deactivatePsychologist = async (req, res) => {
  try {
    const [rowsUpdated] = await PsychologistModel.update(
      { status: "inactive" },
      { where: { user_id: req.params.id } }
    );

    if (rowsUpdated === 0)
      return res.status(404).json({ message: "Psicólogo/a no encontrado/a" });

    res.status(200).json({ message: "Psicólogo/a desactivado correctamente" });
  } catch (error) {
    console.error("Error al desactivar psicólogo/a:", error);
    res.status(400).json({ message: error.message });
  }
};

// Reactivar psicólogo
export const activatePsychologist = async (req, res) => {
  try {
    const [rowsUpdated] = await PsychologistModel.update(
      { status: "active" },
      { where: { user_id: req.params.id } }
    );

    if (rowsUpdated === 0)
      return res.status(404).json({ message: "Psicólogo/a no encontrado/a" });

    res.status(200).json({ message: "Psicólogo/a reactivado correctamente" });
  } catch (error) {
    console.error("Error al reactivar psicólogo/a:", error);
    res.status(400).json({ message: error.message });
  }
};

// Validar registro de psicólogo (solo admin)
export const validatePsychologist = async (req, res) => {
  try {
    const [rowsUpdated] = await PsychologistModel.update(
      { validated: true },
      { where: { user_id: req.params.id } }
    );

    if (rowsUpdated === 0)
      return res.status(404).json({ message: "Psicólogo/a no encontrado/a" });

    res
      .status(200)
      .json({ message: "Registro de psicólogo/a validado correctamente" });
  } catch (error) {
    console.error("Error al validar psicólogo:", error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deletePsychologist = async (req, res) => {
  try {
    const profile = await PsychologistModel.findOne({
      where: { user_id: req.params.id },
    });
    if (!profile)
      return res.status(404).json({ message: "Psicólogo/a no encontrado/a" });

    // Eliminar foto de Cloudinary si existe
    if (profile.photo_public_id) {
      await cloudinary.uploader.destroy(profile.photo_public_id);
    }

    const rowsDeleted = await PsychologistModel.destroy({
      where: { user_id: req.params.id },
      force: false,
    });

    res.status(200).json({ message: "Psicólogo/a eliminado/a" });
  } catch (error) {
    console.error("Error al eliminar psicólogo/a:", error);
    res.status(400).json({ message: error.message });
  }
};
