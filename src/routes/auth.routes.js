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

authRouter.post('/register', registerValidator, handleValidationErrors, registerController);
authRouter.post('/login', loginValidator, handleValidationErrors, loginController);

//si el admin creo al usuario y este va a establecer su contraseña
authRouter.post('/set-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Buscar usuario con token válido
        const user = await User.findOne({
            where: {
                user_password_token: token,
                user_password_token_expiration: { [Op.gt]: new Date() }
            }
        });

        if (!user) return res.status(400).json({ message: 'Token inválido o expirado' });

        // Hashear y guardar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Limpiar token
        user.user_password_token = null;
        user.user_password_token_expiration = null;

        await user.save();

        res.json({ message: 'Contraseña establecida correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error estableciendo contraseña' });
    }
});

export default authRouter;