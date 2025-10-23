import express from 'express';
import * as sessionController from '../controllers/session.controller.js';

const router = express.Router();

router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSessionById);
router.post('/', sessionController.createSession);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

export default router;