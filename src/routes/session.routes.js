import express from 'express';
import * as sessionController from '../controllers/session.controller.js';

const sessionRouter = express.Router();

sessionRouter.get('/', sessionController.getAllSessions);
sessionRouter.get('/:id', sessionController.getSessionById);
sessionRouter.post('/', sessionController.createSession);
sessionRouter.put('/:id', sessionController.updateSession);
sessionRouter.delete('/:id', sessionController.deleteSession);

export default sessionRouter;