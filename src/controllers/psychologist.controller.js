import PsychologistModel from "../models/PsychologistModel";
import { sequelize } from "../config/database.js";
import user from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from '../utils/cloudinaryConfig.js';


//CREAR USER PSICÓLOGO
export const createPsychologistProfile = async (req, res) => {
    const { license_number, specialty, professional_description } = req.body;
    const user_id = req.user.id; //desde el token
    const transaction = await sequelize.transaction();

    try {
        // Verificar si el perfil existe
        const existingProfile = await PsychologistModel.findOne({ where: { user_id } });
        if (existingProfile) {
            return res.status(400).json({ message: "Ya existe un perfil para este usuario" });
        }

        // Subir imagen si hay archivo
        let imageUrl = null;
        let publicId = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'psychologists' });
            imageUrl = result.secure_url;
            publicId = result.public_id;
        }

        const newProfile = await PsychologistModel.create(
            {
                user_id,
                license_number,
                specialty,
                professional_description,
                photo: imageUrl,
                photo_public_id: publicId
            },
            { transaction }
        );

        await transaction.commit();
        res.status(201).json({ message: "Perfil creado correctamente.", profile: newProfile });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: "Error al crear perfil de psicólogo.", error: error.message });
    }
};

//GET ALL 
export const getAllPsychologists = async (req, res) => {
  try {
    const psychologists = await PsychologistModel.findAll();
    res.json({ psychologists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener psicólogos.", error: error.message });
  }
};
//GET por user_id
export const getPsychologistById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const profile = await PsychologistModel.findOne({ where: { user_id } });
    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }
    res.json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener perfil.", error: error.message });
  }
};

//PUT
export const updatePsychologistProfile = async (req, res) => {
  const { license_number, specialty, professional_description, status, validated } = req.body;
  const user_id = req.user.id; 

  try {
    const profile = await PsychologistModel.findOne({ where: { user_id } });
    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    // Subir nueva foto si hay archivo
    if (req.file) {
        // Eliminar imagen anterior de Cloudinary si existe
        if (profile.photo_public_id) {
            await cloudinary.uploader.destroy(profile.photo_public_id);
        }
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'psychologists' });
        profile.photo = result.secure_url;
        profile.photo_public_id = result.public_id;
    }

    // Actualizar otros campos permitidos
    if (license_number) profile.license_number = license_number;
    if (specialty) profile.specialty = specialty;
    if (professional_description) profile.professional_description = professional_description;
    if (status) profile.status = status;
    if (validated !== undefined) profile.validated = validated; 

    await profile.save();

    res.json({ message: "Perfil actualizado correctamente.", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar perfil.", error: error.message });
  }
};