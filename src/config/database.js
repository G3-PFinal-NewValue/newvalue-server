import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";

// Elegir base de datos según el entorno
const DBNAME = NODE_ENV === "test" ? process.env.DB_TEST_NAME : process.env.DB_NAME;


export const sequelize = new Sequelize(
  DBNAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_HOST.includes('tidbcloud.com') ? {
        require: true,
        rejectUnauthorized: true
      } : false
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conexión a la base de datos establecida correctamente.');
    await sequelize.sync(); // Crea/actualiza tablas según modelos
  } catch (error) {
    console.error('🔴 Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};


