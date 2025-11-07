import express from 'express';
import * as availabilityController from '../controllers/availability.controller.js';
import { 
  createSpecificAvailabilityValidator, 
  updateSpecificAvailabilityValidator,
  createAvailabilityValidator 
} from '../validators/availabilityValidator.js'; //  Importar validadores
import { validationResult } from 'express-validator'; //  Para manejar errores de validación

const availabilityRouter = express.Router();

availabilityRouter.get('/', availabilityController.getAllAvailabilities);
availabilityRouter.get('/:id', availabilityController.getAvailabilityById);
availabilityRouter.post('/', availabilityController.createAvailability);
availabilityRouter.put('/:id', availabilityController.updateAvailability);
availabilityRouter.delete('/:id', availabilityController.deleteAvailability);

//NECESARIO PARA OBTENER LAS DISPONIBILIDADES DE UN PSICÓLOGO
availabilityRouter.get('/psychologist/:psychologistId', availabilityController.getAvailabilityByPsychologist);

// NUEVAS RUTAS PARA EL SISTEMA DE CALENDARIO AVANZADO
availabilityRouter.get('/psychologist/:psychologist_id/calendar', availabilityController.getAvailabilityByDateRange); // Obtener disponibilidades por rango de fechas
availabilityRouter.post('/calendar', createSpecificAvailabilityValidator, availabilityController.createSpecificAvailability); // Con validaciones
availabilityRouter.put('/calendar/:id', updateSpecificAvailabilityValidator, availabilityController.updateSpecificAvailability); // Con validaciones

export default availabilityRouter;