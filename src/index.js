require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('../src/config/database');
const userRoutes = require('../src/routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
sequelize.sync(); // Crea tablas si no existen

app.get('/', (req, res) => res.json({ message: 'Backend SQL funcionando 🚀' }));

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));



