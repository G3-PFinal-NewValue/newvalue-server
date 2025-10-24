import SpecialityModel from "../models/SpecialityModel.js";

export const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await SpecialityModel.findAll();
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSpeciality = async (req, res) => {
  const { name } = req.body;
  try {
    const newSpeciality = await SpecialityModel.create({ name });
    res.status(201).json(newSpeciality);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSpeciality = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const speciality = await SpecialityModel.findByPk(id);
    if (!speciality) return res.status(404).json({ message: "Speciality not found" });
    speciality.name = name;
    await speciality.save();
    res.json(speciality);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSpeciality = async (req, res) => {
  const { id } = req.params;
  try {
    const speciality = await SpecialityModel.findByPk(id);
    if (!speciality) return res.status(404).json({ message: "Speciality not found" });
    await speciality.destroy();
    res.json({ message: "Speciality deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
