import express from 'express';
import { assignRole } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.patch('/assign-role', assignRole); // <== esta es la ruta que busca tu frontend

export default userRouter;