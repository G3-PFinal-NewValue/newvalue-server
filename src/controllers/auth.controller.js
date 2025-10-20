const { OAuth2Client } = require('google-auth-library');
const generateJWT = require('../utils/generateJWT');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ where: { googleId: sub } });
    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        avatar: picture
      });
    }

    const jwtToken = generateJWT(user);

    res.json({
      success: true,
      token: jwtToken,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Error en Google Login:', error);
    res.status(401).json({ success: false, message: 'Token inválido o error al autenticar.' });
  }
};
