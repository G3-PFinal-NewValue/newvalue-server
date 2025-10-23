import express from 'express';
import { registerController, loginController, googleLogin } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';
import { handleValidationErrors } from '../middleware/validationResultHandler.js';

const AuthRouter = express.Router();
// Ruta para iniciar sesión con Google. El cliente envía el token
// recibido del flujo de Google Identity Services en el cuerpo de la petición.
AuthRouter.post('/google', googleLogin);

// También se expone una ruta de callback por si se usa el flujo de redirección.
// TODO: confirmar si esta ruta debe usarse y ajustar la URL según el brief.
AuthRouter.post('/google/callback', googleLogin);

AuthRouter.post('/register',registerValidator, handleValidationErrors, registerController);
AuthRouter.post('/login', loginValidator. handleValidationErrors, loginController);


export default AuthRouter;
