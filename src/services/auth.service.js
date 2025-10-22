import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authService = {
  googleLogin: async (token) => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ where: { googleId: sub } });
    if (!user) {
      user = await User.create({ googleId: sub, email, name, avatar: picture });
    }

    const role = user.role || 'User';
    const jwtToken = jwt.sign({ id: user.id, email: user.email, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role }, token: jwtToken };
  }
};

export default authService;
