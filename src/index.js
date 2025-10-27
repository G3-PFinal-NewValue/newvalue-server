import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';
import authRouter from './routes/auth.routes.js';
import patientRouter from './routes/patient.routes.js';
import psychologistRouter from './routes/psychologist.routes.js';
import appointmentRouter from './routes/appointment.routes.js';
import availabilityRouter from './routes/availability.routes.js';
import sessionRouter from './routes/session.routes.js';
import articleRouter from './routes/article.routes.js';
import RoleModel from './models/RoleModel.js';
import userRouter from './routes/user.routes.js';
import './models/associations.js';

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
app.use ('/appointment', appointmentRouter)
app.use('/availability', availabilityRouter);
app.use('/session', sessionRouter);
app.use('/article', articleRouter);
app.use('/user', userRouter); // Esto hará que /user/assign-role funcione

// Ruta de prueba
app.get('/', (req, res) => res.send('API Running...'));

// Levantar servidor después de conectar DB
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Database connected');

    // Sincroniza todos los modelos y crea tablas si no existen
    await sequelize.sync({});
    console.log('✅ Database synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};
export const initializeRoles = async () => {
  const roles = ['admin', 'patient', 'psychologist'];

  for (const name of roles) {
    await RoleModel.findOrCreate({ where: { name } });
  }

  console.log('✅ Roles verificados o creados correctamente');
};

await startServer();
await initializeRoles();