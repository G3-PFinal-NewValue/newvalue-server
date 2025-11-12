import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // Frontend local desarrollo
  'http://localhost:3000', // Frontend alternativo
  process.env.FRONTEND_URL, // URL de producción desde .env
].filter(Boolean); // Elimina valores undefined/null

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (Postman, apps móviles, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked: ${origin}`);
      callback(new Error('CORS not allowed by policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default cors(corsOptions);