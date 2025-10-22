import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserModel = sequelize.define('User', {
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
  // Rol del usuario en la aplicación (p. ej., 'Paciente', 'Psicólogo', 'Administrador')
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
});

export default UserModel;
