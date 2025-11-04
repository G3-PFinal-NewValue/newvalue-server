import express from 'express';
import { assignRole, getAllUsers,deactivateUser, activateUser } from '../controllers/user.controller.js';
import { createUserAndSendEmail } from '../controllers/firstSession.controller.js';
//CA: Acá voy a importar los controladores y los middlewares que ya están definidos pero no importados. Arriba importé getAllUsers deactivateUser, activateUser
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const userRouter = express.Router();

// CA: Acá añado la ruta GET para que solo el admin pueda obtener todos los usuarios.
userRouter.get('/', authMiddleware, roleMiddleware('admin'), getAllUsers);

userRouter.patch('/assign-role', assignRole);

userRouter.post('/', createUserAndSendEmail);

// CA: Acá añado las rutas para activar y desactivar usuarios
userRouter.patch('/:id/deactivate', authMiddleware, roleMiddleware('admin'), deactivateUser);
userRouter.patch('/:id/activate', authMiddleware, roleMiddleware('admin'), activateUser);

export default userRouter;