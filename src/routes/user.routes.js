import express from 'express';
import { assignRole } from '../controllers/user.controller.js';
import { createUserAndSendEmail } from '../controllers/firstSession.controller.js';

const userRouter = express.Router();

userRouter.patch('/assign-role', assignRole);

userRouter.post('/', createUserAndSendEmail);

export default userRouter;