import express from 'express';
import corsConfig from './config/cors.config.js';
import authRoutes from './routes/auth.routes.js';
import patientRouter from './routes/patient.routes.js';

const app = express();

app.use(express.json());
app.use(corsConfig);

app.use('/auth', authRoutes);
app.use('/patient', patientRouter);

app.get('/', (req, res) => res.send('API Running...'));

export default app;