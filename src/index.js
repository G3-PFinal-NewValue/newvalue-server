import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {sequelize} from './config/database.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


const PORT = process.env.PORT || 4001;

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});