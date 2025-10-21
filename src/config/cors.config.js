const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173', // Frontend local
  // Producción
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed by policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};

module.exports = cors(corsOptions);
