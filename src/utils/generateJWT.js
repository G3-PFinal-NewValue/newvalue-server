const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJWT = (user) => {
  // Incluye el rol en el JWT si está disponible.  Si no se proporciona rol,
  // se puede usar un valor por defecto.  TODO: confirmar lógica de roles.
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'User'
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};
