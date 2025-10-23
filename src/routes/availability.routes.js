import express from 'express';
import * as availabilityController from '../controllers/availability.controller.js';

const availabilityRouter = express.Router();

availabilityRouter.get('/', availabilityController.getAllAvailabilities);
availabilityRouter.get('/:id', availabilityController.getAvailabilityById);
availabilityRouter.post('/', availabilityController.createAvailability);
availabilityRouter.put('/:id', availabilityController.updateAvailability);
availabilityRouter.delete('/:id', availabilityController.deleteAvailability);

export default availabilityRouter;