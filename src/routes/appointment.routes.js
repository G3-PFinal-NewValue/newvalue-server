import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as appointmentController from '../controllers/appointment.controller.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import appointmentOwnershipMiddleware from '../middleware/appointmentMiddleware.js';

const appointmentRouter = express.Router();

appointmentRouter.get('/', authMiddleware, appointmentController.getAllAppointments);
appointmentRouter.get('/:id', authMiddleware, appointmentOwnershipMiddleware, appointmentController.getAppointmentById);
appointmentRouter.post('/', authMiddleware, roleMiddleware('patient'), appointmentController.createAppointment);
appointmentRouter.put('/:id', authMiddleware, appointmentOwnershipMiddleware, appointmentController.updateAppointment);
appointmentRouter.delete('/:id', authMiddleware, appointmentOwnershipMiddleware, appointmentController.deleteAppointment);

export default appointmentRouter;