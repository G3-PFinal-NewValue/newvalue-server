import express from 'express';
import corsConfig from './config/cors.config.js';
import authRouter from './routes/auth.routes.js';
import patientRouter from './routes/patient.routes.js';
import psychologistRouter from './routes/psychologist.routes.js';
import appointmentRouter from './routes/appointment.routes.js';
import availabilityRouter from './routes/availability.routes.js';
import sessionRouter from './routes/session.routes.js';
import articleRouter from './routes/article.routes.js';
import categoryRouter from './routes/category.routes.js';
import userRouter from './routes/user.routes.js';



const app = express();

// Middlewares
app.use(express.json());
app.use(corsConfig);

// Rutas
app.use('/auth', authRouter); 
app.use('/patient', patientRouter);
app.use('/psychologist', psychologistRouter);
app.use ('/appointment', appointmentRouter)
app.use('/availability', availabilityRouter);
app.use('/session', sessionRouter);
app.use('/article', articleRouter);
app.use('/user', userRouter);


// Ruta de prueba
app.get('/', (req, res) => res.send('API Running...'));

export default app;
