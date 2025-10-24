import express from 'express';
import * as appointmentController from '../controllers/appointment.controller.js';

const appointmentRouter = express.Router();

appointmentRouter.get('/', appointmentController.getAllAppointments);
appointmentRouter.get('/:id', appointmentController.getAppointmentById);
appointmentRouter.post('/', appointmentController.createAppointment);
appointmentRouter.put('/:id', appointmentController.updateAppointment);
appointmentRouter.delete('/:id', appointmentController.deleteAppointment);

export default appointmentRouter;