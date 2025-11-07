import 'dotenv/config';
import app from './app.js';
import { sequelize } from './config/database.js';

// Levantar servidor después de conectar DB
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Database connected');

    // Sincroniza todos los modelos y crea tablas si no existen
    if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({});
    console.log('✅ Database synchronized');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

await startServer();