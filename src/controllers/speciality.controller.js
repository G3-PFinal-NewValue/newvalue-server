import SpecialtyModel from "../models/SpecialtyModel.js";

export const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await SpecialtyModel.findAll();
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSpecialty = async (req, res) => {
  const { name } = req.body;
  try {
    const newSpecialty = await SpecialtyModel.create({ name });
    res.status(201).json(newSpecialty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSpecialty = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const specialty = await SpecialtyModel.findByPk(id);
    if (!specialty) return res.status(404).json({ message: "Specialty not found" });
    specialty.name = name;
    await specialty.save();
    res.json(specialty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSpecialty = async (req, res) => {
  const { id } = req.params;
  try {
    const specialty = await SpecialtyModel.findByPk(id);
    if (!specialty) return res.status(404).json({ message: "Specialty not found" });
    await specialty.destroy();
    res.json({ message: "Specialty deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
