import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getAllUsers, getUserById, createUser, updateUser, deactivateUser, activateUser, deleteUser, assignRole } from '../controllers/user.controller.js';
import ownerMiddleware from '../middleware/ownerMiddleware.js';

const userRouter = express.Router();

// -----------------------
// RUTAS PARA ADMIN
// -----------------------

// Ver todos los usuarios (solo admin)
userRouter.get('/', authMiddleware, roleMiddleware('admin'), getAllUsers);

//ver un usuario por ID (admin)
userRouter.get('/:id', authMiddleware, roleMiddleware('admin'), getUserById);

//activar usuario (solo admin)
userRouter.patch('/:id/activate', authMiddleware, roleMiddleware('admin'), activateUser);

//desactivar usuario (solo admin)
userRouter.patch('/:id/deactivate', authMiddleware, roleMiddleware('admin'), deactivateUser);

//eliminar usuario (solo admin)
userRouter.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

//asignar rol a usuario (solo admin)
userRouter.patch('/:id/assign-role', authMiddleware, roleMiddleware('admin'), assignRole);

// -----------------------
// RUTAS PARA USUARIO PROPIO
// -----------------------

// Actualizar propio usuario
userRouter.put("/:id", authMiddleware, ownerMiddleware, updateUser);

export default userRouter;