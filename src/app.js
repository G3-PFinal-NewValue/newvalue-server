const express = require('express');
const corsConfig = require('./config/cors.config');
const authRoutes = require('./routes/auth.routes');
import patientRouter from './routes/patient.routes';

const app = express();

app.use(express.json());
app.use(corsConfig);

app.use('/auth', authRoutes);
app.use('/patient', patientRouter);

app.get('/', (req, res) => res.send('API Running...'));

module.exports = app;
