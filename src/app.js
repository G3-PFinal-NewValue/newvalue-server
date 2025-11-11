import express from 'express';
import corsConfig from './config/cors.config.js';
import { connectDB } from './config/database.js';
import './models/associations.js'

//rutas
import authRouter from './routes/auth.routes.js';
import patientRouter from './routes/patient.routes.js';
import psychologistRouter from './routes/psychologist.routes.js';
import appointmentRouter from './routes/appointment.routes.js';
import availabilityRouter from './routes/availability.routes.js';
import sessionRouter from './routes/session.routes.js';
import articleRouter from './routes/article.routes.js';
import userRouter from './routes/user.routes.js';
import specialityRoutes from './routes/speciality.routes.js';
import chatRoutes from './routes/chat.routes.js';


const app = express();

// Middlewares
app.use(express.json());
app.use(corsConfig);
connectDB();

// Rutas
app.use('/auth', authRouter);
app.use('/patient', patientRouter);
app.use('/psychologist', psychologistRouter);
app.use('/appointment', appointmentRouter)
app.use('/availability', availabilityRouter);
app.use('/session', sessionRouter);
app.use('/article', articleRouter);
app.use('/user', userRouter);
app.use('/', specialityRoutes);
app.use('/api/chat', chatRoutes);


// Ruta de prueba
app.get('/', (req, res) => res.send('API Running...'));

//error handler 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' })
})


export default app;
