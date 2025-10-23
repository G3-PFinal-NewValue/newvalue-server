import express from 'express';
import * as availabilityController from '../controllers/availability.controller.js';

const router = express.Router();

router.get('/', availabilityController.getAllAvailabilities);
router.get('/:id', availabilityController.getAvailabilityById);
router.post('/', availabilityController.createAvailability);
router.put('/:id', availabilityController.updateAvailability);
router.delete('/:id', availabilityController.deleteAvailability);

export default router;