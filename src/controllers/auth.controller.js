const authService = require('../services/auth.service');

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    // Llama al servicio para autenticar con Google y obtener token JWT + usuario
    const data = await authService.googleLogin(token);
    // data contiene { user: { ... }, token }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};