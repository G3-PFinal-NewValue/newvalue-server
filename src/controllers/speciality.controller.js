import SpecialityModel from '../models/SpecialityModel.js';

// Obtener todas las especialidades
export const getAllSpecialities = async (req, res) => {
  try {
    const specialities = await SpecialityModel.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
    res.status(200).json(specialities);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.status(500).json({ message: 'Error al obtener especialidades', error });
  }
};

// Crear una nueva especialidad manualmente
export const createSpeciality = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'El nombre de la especialidad es obligatorio' });
    }

    const [speciality, created] = await SpecialityModel.findOrCreate({
      where: { name: name.trim() },
    });

    if (!created) {
      return res.status(409).json({ message: 'La especialidad ya existe' });
    }

    res.status(201).json({ message: 'Especialidad creada correctamente', speciality });
  } catch (error) {
    console.error('Error al crear especialidad:', error);
    res.status(500).json({ message: 'Error al crear especialidad', error });
  }
};
