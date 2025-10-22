import PsychologistModel from "../models/PsychologistModel";

// Obtener todos los psicólogos (activos)
export const getAllPsychologists = async (req, res) => {
  try {
    const { includeInactive } = req.query; 
    const whereClause = includeInactive ? {} : { status: 'activate' };

    const psychologists = await PsychologistModel.findAll({ where: whereClause });
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

// POST 
export const createPsychologistProfile = async (req, res) => {
  try {
    const { user_id, license_number, specialty, professional_description, photo } = req.body;

    if (!user_id) return res.status(400).json({ message: "El user_id es obligatorio" });
    if (!license_number) return res.status(400).json({ message: "El número de colegiado es obligatorio" });

    // Verificar si ya existe un perfil para este user_id
    const existingProfile = await PsychologistModel.findOne({ where: { user_id } });
    if (existingProfile) return res.status(400).json({ message: "Ya existe un perfil para este usuario" });

    const newProfile = await PsychologistModel.create({
      user_id,
      license_number,
      specialty,
      professional_description,
      photo,
      status: 'activate',     
      validated: false        
    });
    res.status(201).json({ message: 'Perfil de psicólogo/a creado correctamente', profile: newProfile });
  } catch (error) {
    console.error('Error al crear el perfil:', error);
    res.status(400).json({ message: error.message });
  }
};

// PUT
export const updatePsychologistProfile = async (req, res) => {
  try {
    const [rowsUpdated] = await PsychologistModel.update(req.body, {
      where: { user_id: req.params.id },
    });

    if (rowsUpdated === 0) return res.status(404).json({ message: 'Psicólogo/a no encontrado' });

    const updatedProfile = await PsychologistModel.findOne({ where: { user_id: req.params.id } });
    res.status(200).json({ message: 'Perfil actualizado correctamente', profile: updatedProfile });
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
    const rowsDeleted = await PsychologistModel.destroy({
      where: { user_id: req.params.id },
      force: false, 
    });

    if (rowsDeleted === 0) return res.status(404).json({ message: 'Psicólogo/a no encontrado/a' });

    res.status(200).json({ message: 'Psicólogo/a eliminado/a' });
  } catch (error) {
    console.error('Error al eliminar psicólogo/a:', error);
    res.status(400).json({ message: error.message });
  }
};