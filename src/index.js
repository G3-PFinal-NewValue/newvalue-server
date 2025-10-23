import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';
import authRouter from './routes/auth.routes.js';
import patientRouter from './routes/patient.routes.js';
import psychologistRouter from './routes/psychologist.routes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Cambiar según frontend
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/auth', authRouter);
app.use('/patient', patientRouter);
app.use('/psychologist', psychologistRouter);

app.get('/', (req, res) => res.send('API Running...'));

// Levantar servidor después de conectar DB
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Database connected');

    // Sincroniza todos los modelos y crea tablas si no existen
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

startServer();
