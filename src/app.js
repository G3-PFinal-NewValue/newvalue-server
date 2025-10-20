const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use('/auth', authRoutes);

sequelize.sync()
  .then(() => console.log('🟢 Base de datos conectada'))
  .catch(err => console.error('🔴 Error al conectar DB:', err));

module.exports = app;
