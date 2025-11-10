import PsychologistModel from "../models/PsychologistModel.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import SpecialityModel from "../models/SpecialityModel.js";
import LanguageModel from "../models/LanguageModel.js";
import fs from "fs";
import { sequelize } from "../config/database.js";
import UserModel from "../models/UserModel.js";
import AvailabilityModel from "../models/AvailabilityModel.js";
import AppointmentModel from "../models/AppointmentModel.js";
import { Op } from "sequelize";

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
      {
        model: UserModel,
        as: 'user', // CA: alias se mantiene para datos de usuario
        attributes: ['first_name', 'last_name', 'email'] // CA: eliminar avatar porque no existe en la tabla
      }
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
          model: LanguageModel, // CA: separar include de idiomas para evitar mezcla de modelos
          as: 'languages', // CA: mantener alias correcto para idiomas
          attributes: ['id', 'name'], // CA: limitar atributos de idiomas
          through: { attributes: [] }, // CA: omitir datos de tabla pivote
        },
        {
          model: UserModel, // CA: incluir solo campos existentes del usuario
          as: "user", // CA: alias requerido en el frontend
          attributes: ["first_name", "last_name", "email"], // CA: eliminar avatar inexistente
        },
        {
          model: AvailabilityModel, // CA: mantener disponibilidades en bloque independiente
          as: "availabilities", // CA: alias correcto para disponibilidades
          attributes: ["weekday", "start_time", "end_time"], // CA: limitar atributos de disponibilidad
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
    //CA: Agregué availabilities
    const { license_number, specialities, professional_description, availabilities } = req.body;

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
    }, { transaction: t });

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
await newProfile.setSpecialities(specialityInstances.filter(Boolean), { transaction: t });    }

    // CA: lógica de las disponibilidades
    if (availabilities) {
      const availabilityArray = JSON.parse(availabilities);
      if (Array.isArray(availabilityArray) && availabilityArray.length > 0) {
        
        const availData = availabilityArray.map(a => ({
          psychologist_id: user_id,
          weekday: a.weekday,
          start_time: a.start_time,
          end_time: a.end_time
        }));
        await AvailabilityModel.bulkCreate(availData, { transaction: t });
      }
    }
    await t.commit();

    // Incluir especialidades en la respuesta
    const createdProfile = await PsychologistModel.findByPk(
      newProfile.user_id,
      {
        include: [{
          model: SpecialityModel,
          as: "specialities",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
        { model: AvailabilityModel, as: 'availabilities', attributes: ['weekday', 'start_time', 'end_time'] }
      ]
      }
    );

    res.status(201).json({
      message: "Perfil de psicólogo/a creado correctamente",
      profile: createdProfile,
    });
  } catch (error) {
    console.error("Error al crear el perfil:", error);
    res.status(400).json({ message: error.message });
  }
};

// PUT: actualizar perfil de psicólogo con posible nueva foto
export const updatePsychologistProfile = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      license_number,
      specialities,
      professional_description,
      status,
      validated,
      availabilities
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

    if (availabilities) {
      // 4a. Borrar todas las disponibilidades anteriores
      await AvailabilityModel.destroy({
        where: { psychologist_id: id },
        transaction: t
      });

      // 4b. Crear las nuevas disponibilidades
      const availabilityArray = JSON.parse(availabilities);
      if (Array.isArray(availabilityArray) && availabilityArray.length > 0) {
        
        const availData = availabilityArray.map(a => ({
          psychologist_id: id,
          weekday: a.weekday,
          start_time: a.start_time,
          end_time: a.end_time
        }));

        await AvailabilityModel.bulkCreate(availData, { transaction: t });
      }
    }

    await profile.save({ transaction: t }); 
    await t.commit(); 

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

export const getPsychologistBookedSlots = async (req, res) => {
  try {
    const psychologist_id = req.params.id;
    const now = new Date();

    const appointments = await AppointmentModel.findAll({
      where: {
        psychologist_id: psychologist_id,
        status: {
          [Op.or]: ['confirmed', 'pending'] // Solo queremos citas activas
        },
        date: {
          [Op.gte]: now // Solo citas de hoy en adelante
        }
      },
      attributes: ['date', 'duration_minutes'] // Solo necesitamos esta info
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error al obtener citas reservadas:', error);
    res.status(400).json({ message: error.message });
  }
};

//PARA EL PSICOLOGO

//Ver perfil propio
export const getMyProfile = async (req, res) => {
  try {
    const psychologist = await PsychologistModel.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: SpecialityModel,
          as: 'specialities',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: LanguageModel,
          as: 'languages',
          attributes: ['id', 'name'],
          through: { attributes: [] }, // oculta la tabla intermedia
        },
      ],
    });

    if (!psychologist) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.status(200).json(psychologist);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(400).json({ message: error.message });
  }
};

//Actualizar perfil propio
export const updateMyProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const user_id = req.user.id;
    const { license_number, specialities, professional_description, photo, languages } = req.body;

    const profile = await PsychologistModel.findOne({
      where: { user_id },
      include: [{ association: 'languages' }, { association: 'specialities' }],
        transaction
    });

    if (!profile) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    //Subir nueva foto si viene un archivo
    if (req.file) {
      if (profile.photo_public_id) {
        await cloudinary.uploader.destroy(profile.photo_public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'psychologists' });
      profile.photo = result.secure_url;
      profile.photo_public_id = result.public_id;
      fs.unlinkSync(req.file.path);
    } else if (photo) {
      //si manda directamente una url
      profile.photo = photo;
    }

    //Actualizar campos básicos
    if (license_number) profile.license_number = license_number;
    if (professional_description) profile.professional_description = professional_description;

    //Actualizar especialidades
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
      )
      await profile.setSpecialities(specialityInstances.filter(Boolean));
    }

    // Actualizar idiomas (si se envía el campo)
    if (languages) {
      const languageArray = Array.isArray(languages)
        ? languages
        : JSON.parse(languages);

      const languageInstances = await Promise.all(
        languageArray.map(async (item) => {
          if (!item) return null;
          if (!isNaN(item)) {
            // si es id
            return LanguageModel.findByPk(item);
          } else {
            // si es nombre nuevo
            const [language] = await LanguageModel.findOrCreate({
              where: { name: item.trim() },
              defaults: {code: null},
              transaction,
            });
            return language;
          }
        })
      );
      await profile.setLanguages(languageInstances.filter(Boolean));
    }

    await profile.save({ transaction });
    await transaction.commit();

    const updatedProfile = await PsychologistModel.findOne({
      where: { user_id },
      include: [
        {
          model: SpecialityModel,
          as: 'specialities',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: LanguageModel,
          as: 'languages',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).json({ message: 'Perfil actualizado correctamente', profile: updatedProfile });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar perfil', error);
    res.status(400).json({ message: error.message });
  }
}
