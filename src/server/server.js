import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import {sequelize} from './config/database.js';


const PORT = process.env.PORT || 4000;

try {
  await sequelize.sync({});
  console.log('✅ Database connected');
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (err) {
  console.error('❌ Database connection failed:', err);
}
