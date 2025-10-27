import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import RoleModel from './RoleModel.js';

const UserModel = sequelize.define('user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Autenticación
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true, // Puede ser null si el usuario se registra con Google
    },

    // Datos personales
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[+]?[\d\s()-]+$/i,
      },
    },

    // Google login
    google_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    // Rol
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'role',
        key: 'id',
      },
    },
<<<<<<< HEAD
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[+]?[\d\s()-]+$/i, // opcional: valida formato de teléfono

      },
    },
    // Estado del Usuario
=======

    // Estado y fechas
>>>>>>> develop
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
      allowNull: false,
    },
  },
  {
    tableName: 'user',
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

// Relación con Role
UserModel.belongsTo(RoleModel, { foreignKey: 'role_id' });
RoleModel.hasMany(UserModel, { foreignKey: 'role_id' });

export default UserModel;