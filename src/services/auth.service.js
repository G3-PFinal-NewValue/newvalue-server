const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
// Importar el modelo de usuario. El nombre del archivo es "User.js".
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub, email, name, picture } = payload;

  let user = await User.findOne({ where: { googleId: sub } });
  if (!user) {
    user = await User.create({
      googleId: sub,
      email,
      name,
      avatar: picture,
    });
  }

  // Incluir el rol del usuario en el token. Si el usuario no tiene rol asignado,
  // se usa un valor por defecto. TODO: confirmar asignación de roles según el brief.
  const role = user.role || 'User';
  const jwtToken = jwt.sign(
    { id: user.id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // Devuelve el usuario junto con el token JWT.
  return { user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role }, token: jwtToken };
};