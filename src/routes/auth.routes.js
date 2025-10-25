import express from 'express';
import { registerController, loginController, googleLogin } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';
import { handleValidationErrors } from '../middleware/validationResultHandler.js';

const authRouter = express.Router();
// Ruta para iniciar sesión con Google. El cliente envía el token
// recibido del flujo de Google Identity Services en el cuerpo de la petición.
authRouter.post('/google', googleLogin);

// También se expone una ruta de callback por si se usa el flujo de redirección.
// TODO: confirmar si esta ruta debe usarse y ajustar la URL según el brief.
authRouter.post('/google/callback', googleLogin);

authRouter.post('/register',registerValidator, handleValidationErrors, registerController);
authRouter.post('/login', loginValidator, handleValidationErrors, loginController);


export default authRouter;
