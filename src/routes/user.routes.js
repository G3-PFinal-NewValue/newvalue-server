import express from 'express';
import { assignRole } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.patch('/assign-role', assignRole); 

export default userRouter;