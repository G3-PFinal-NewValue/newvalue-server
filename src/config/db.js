const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', // o 'postgres' si usas PostgreSQL
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión SQL exitosa');
  } catch (error) {
    console.error('❌ Error conectando a SQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };


