const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJWT = (user) => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateJWT;
