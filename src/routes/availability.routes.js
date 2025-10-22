const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availability.controller');

router.get('/', availabilityController.getAllAvailabilities);
router.get('/:id', availabilityController.getAvailabilityById);
router.post('/', availabilityController.createAvailability);
router.put('/:id', availabilityController.updateAvailability);
router.delete('/:id', availabilityController.deleteAvailability);

module.exports = router;