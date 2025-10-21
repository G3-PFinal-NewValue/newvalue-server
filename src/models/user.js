const { DataTypes } = require('sequelize');
// Import the Sequelize instance from the database configuration
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },
  avatar: {
    type: DataTypes.STRING
  },
  // Rol del usuario en la aplicación (p. ej., 'Paciente', 'Psicólogo', 'Administrador').
  // TODO: confirmar los valores posibles y su gestión según el brief.
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
});

module.exports = User;