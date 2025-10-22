import PatientModel from "../models/PatientModel.js";
import cloudinary from '../utils/cloudinaryConfig.js';
import fs from 'fs';

// Crear nuevo paciente con foto opcional
export const createPatient = async (req, res) => {
    try {
        let imageUrl = null;
        let publicId = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'patients' });
            imageUrl = result.secure_url;
            publicId = result.public_id;

            // Eliminar archivo temporal
            fs.unlinkSync(req.file.path);
        }

        const newPatient = await PatientModel.create({
            ...req.body,
            status: 'active',
            photo: imageUrl,
            photo_public_id: publicId
        });

        res.status(201).json({ message: 'Paciente creado correctamente', patient: newPatient });
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar paciente con posible nueva foto
export const updatePatient = async (req, res) => {
    try {
        const patient = await PatientModel.findByPk(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });

        // Subir nueva foto si existe
        if (req.file) {
            // Eliminar imagen anterior de Cloudinary si existe
            if (patient.photo_public_id) {
                await cloudinary.uploader.destroy(patient.photo_public_id);
            }

            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'patients' });
            patient.photo = result.secure_url;
            patient.photo_public_id = result.public_id;

            // Borrar archivo temporal
            fs.unlinkSync(req.file.path);
        }

        // Actualizar otros campos
        Object.keys(req.body).forEach(key => {
            if (key !== 'photo' && key !== 'photo_public_id') {
                patient[key] = req.body[key];
            }
        });

        await patient.save();
        res.status(200).json({ message: 'Paciente actualizado', patient });
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        res.status(400).json({ message: error.message });
    }
};