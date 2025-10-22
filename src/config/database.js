import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conexión a la base de datos establecida correctamente.');
    await sequelize.sync(); // opcional: crea las tablas si no existen
  } catch (error) {
    console.error('🔴 Error al conectar con la base de datos:', error);
    process.exit(1); // Detiene el servidor si no hay conexión
  }
};



