import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateJWT = (user) => {
  // Incluye el rol en el JWT si está disponible.
  // Si no se proporciona rol, se usa un valor por defecto.
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'User',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};
