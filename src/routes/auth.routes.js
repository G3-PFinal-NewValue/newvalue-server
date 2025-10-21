
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta para iniciar sesión con Google. El cliente envía el token
// recibido del flujo de Google Identity Services en el cuerpo de la petición.
router.post('/google', authController.googleLogin);

// También se expone una ruta de callback por si se usa el flujo de redirección.
// TODO: confirmar si esta ruta debe usarse y ajustar la URL según el brief.
router.post('/google/callback', authController.googleLogin);

module.exports = router;