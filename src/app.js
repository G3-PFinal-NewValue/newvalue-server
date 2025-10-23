import express from 'express';
import corsConfig from './config/cors.config.js';
import authRouter from './routes/auth.routes.js';
import patientRouter from './routes/patient.routes.js';
import psychologistRouter from './routes/psychologist.routes.js'

const app = express();

app.use(express.json());
app.use(corsConfig);

app.use('/auth', authRouter);
app.use('/patient', patientRouter);
app.use('/psychologist', psychologistRouter)

//app.get('/', (req, res) => res.send('API Running...'));

export default app;