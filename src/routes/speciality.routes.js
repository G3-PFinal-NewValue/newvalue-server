import { Router } from 'express';
import { getAllSpecialities, createSpeciality } from '../controllers/speciality.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const specialityRouter = Router();

// Cualquiera autenticado puede verlas
specialityRouter.get('/', authMiddleware, getAllSpecialities);

// Solo psicólogos o admins pueden crear nuevas
specialityRouter.post('/', authMiddleware, roleMiddleware('psychologist', 'admin'), createSpeciality);

export default specialityRouter;
