import PsychologistModel from "../models/PsychologistModel.js";
import cloudinary from '../utils/cloudinaryConfig.js';
import fs from 'fs';

// Obtener todos los psicólogos (activos y validados)
export const getAllPsychologists = async (req, res) => {
  try {
    const { includeInactive } = req.query;

    const whereClause = includeInactive
      ? {}
      : { status: 'active', validated: true };

    const psychologists = await PsychologistModel.findAll({
      where: whereClause
    });

    res.status(200).json(psychologists);
  } catch (error) {
    console.error('Error al obtener los psicólogos/as:', error);
    res.status(400).json({ message: error.message });
  }
};


// GET por user_id
export const getPsychologistById = async (req, res) => {
  try {
    const profile = await PsychologistModel.findOne({ where: { user_id: req.params.id } });
    if (!profile) return res.status(404).json({ message: 'Psicólogo/a no encontrado/a' });
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error al obtener el psicólogo/a:', error);
    res.status(400).json({ message: error.message });
  }
};

// POST: crear perfil de psicólogo con foto opcional
export const createPsychologistProfile = async (req, res) => {
  try {
    const { user_id, license_number, specialty, professional_description } = req.body;

    if (!user_id) return res.status(400).json({ message: "El user_id es obligatorio" });
    if (!license_number) return res.status(400).json({ message: "El número de colegiado es obligatorio" });

    const existingProfile = await PsychologistModel.findOne({ where: { user_id } });
    if (existingProfile) return res.status(400).json({ message: "Ya existe un perfil para este usuario" });

    let imageUrl = null;
    let publicId = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'psychologists' });
      imageUrl = result.secure_url;
      publicId = result.public_id;
      fs.unlinkSync(req.file.path); // eliminar archivo temporal
    }

    const newProfile = await PsychologistModel.create({
      user_id,
      license_number,
      specialty,
      professional_description,
      photo: imageUrl,
      photo_public_id: publicId,
      status: 'activate',     
      validated: false        
    });
    res.status(201).json({ message: 'Perfil de psicólogo/a creado correctamente', profile: newProfile });
  } catch (error) {
    console.error('Error al crear el perfil:', error);
    res.status(400).json({ message: error.message });
  }
};

// PUT: actualizar perfil de psicólogo con posible nueva foto
export const updatePsychologistProfile = async (req, res) => {
  try {
    const profile = await PsychologistModel.findOne({ where: { user_id: req.params.id } });
    if (!profile) return res.status(404).json({ message: 'Psicólogo/a no encontrado' });

    // Subir nueva foto si existe
    if (req.file) {
      if (profile.photo_public_id) {
        await cloudinary.uploader.destroy(profile.photo_public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'psychologists' });
      profile.photo = result.secure_url;
      profile.photo_public_id = result.public_id;
      fs.unlinkSync(req.file.path);
    }

    // Actualizar otros campos permitidos
    const fieldsToUpdate = ['license_number', 'specialty', 'professional_description', 'status', 'validated'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) profile[field] = req.body[field];
    });

    await profile.save();
    res.status(200).json({ message: 'Perfil actualizado correctamente', profile });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(400).json({ message: error.message });
  }
};

// Desactivar psicólogo (activar/inactivar)
export const deactivatePsychologist = async (req, res) => {
  try {
    const [rowsUpdated] = await PsychologistModel.update(
      { status: 'inactive' },
      { where: { user_id: req.params.id } }
    );

    if (rowsUpdated === 0) return res.status(404).json({ message: 'Psicólogo/a no encontrado/a' });

    res.status(200).json({ message: 'Psicólogo/a desactivado correctamente' });
  } catch (error) {
    console.error('Error al desactivar psicólogo/a:', error);
    res.status(400).json({ message: error.message });
  }
};

// Reactivar psicólogo
export const activatePsychologist = async (req, res) => {
  try {
    const [rowsUpdated] = await PsychologistModel.update(
      { status: 'activate' },
      { where: { user_id: req.params.id } }
    );

    if (rowsUpdated === 0) return res.status(404).json({ message: 'Psicólogo/a no encontrado/a' });

    res.status(200).json({ message: 'Psicólogo/a reactivado correctamente' });
  } catch (error) {
    console.error('Error al reactivar psicólogo/a:', error);
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

    if (rowsUpdated === 0) return res.status(404).json({ message: 'Psicólogo/a no encontrado/a' });

    res.status(200).json({ message: 'Registro de psicólogo/a validado correctamente' });
  } catch (error) {
    console.error('Error al validar psicólogo:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deletePsychologist = async (req, res) => {
  try {
    const profile = await PsychologistModel.findOne({ where: { user_id: req.params.id } });
    if (!profile) return res.status(404).json({ message: 'Psicólogo/a no encontrado/a' });

    // Eliminar foto de Cloudinary si existe
    if (profile.photo_public_id) {
      await cloudinary.uploader.destroy(profile.photo_public_id);
    }

    const rowsDeleted = await PsychologistModel.destroy({
      where: { user_id: req.params.id },
      force: false, 
    });

    res.status(200).json({ message: 'Psicólogo/a eliminado/a' });
  } catch (error) {
    console.error('Error al eliminar psicólogo/a:', error);
    res.status(400).json({ message: error.message });
  }
};