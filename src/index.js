const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
