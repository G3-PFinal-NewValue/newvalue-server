import express from 'express';
import * as availabilityController from '../controllers/availability.controller.js';

const availabilityRouter = express.Router();

availabilityRouter.get('/', availabilityController.getAllAvailabilities);
availabilityRouter.get('/:id', availabilityController.getAvailabilityById);
availabilityRouter.post('/', availabilityController.createAvailability);
availabilityRouter.put('/:id', availabilityController.updateAvailability);
availabilityRouter.delete('/:id', availabilityController.deleteAvailability);

//NECESARIO PARA OBTENER LAS DISPONIBILIDADES DE UN PSICÓLOGO
availabilityRouter.get('/psychologist/:psychologistId', availabilityController.getAvailabilityByPsychologist);

export default availabilityRouter;