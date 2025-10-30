import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import * as availabilityController from '../controllers/availability.controller.js';
import { auth } from 'google-auth-library';

const availabilityRouter = express.Router();

/**
 * RUTAS DE DISPONIBILIDAD
 * -----------------------
 * - Admin → puede ver todas, actualizar o eliminar cualquier disponibilidad.
 * - Psicólogo → solo puede gestionar las suyas.
 * - Paciente → puede ver la disponibilidad de un psicólogo.
 */

// Obtener todas las disponibilidades
// - Admin: ve todas
// - Psicólogo: solo las suyas
availabilityRouter.get('/', authMiddleware, roleMiddleware('psychologist', 'admin'), availabilityController.getAllAvailabilities);

// Obtener disponibilidades de un psicólogo (para pacientes)
availabilityRouter.get('/psychologist/:psychologist_id', authMiddleware, roleMiddleware('patient', 'admin'), availabilityController.getAvailabilitiesByPsychologist);

//Crear nueva disponibilidad (solo psicologo)
availabilityRouter.post('/', authMiddleware, roleMiddleware('psychologist'), availabilityController.createAvailability);

//Actualizar disponibilidad (solo psicólogo o admin)
availabilityRouter.put('/:id', authMiddleware, roleMiddleware('psychologist', 'admin'), availabilityController.updateAvailability);

//Eliminar disponibilidad (solo psicólogo o admin)
availabilityRouter.delete('/:id', authMiddleware, roleMiddleware('psychologist', 'admin'), availabilityController.deleteAvailability);

//validar minimo de disponibilidades (solo admin)
availabilityRouter.get('/validate/minimum', authMiddleware, roleMiddleware('admin'), availabilityController.validateMinimumAvailability);

export default availabilityRouter;