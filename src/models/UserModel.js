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
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[+]?[\d\s()-]+$/i,
      },
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    full_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dni_nie_cif: {
      type: DataTypes.STRING(50),
      allowNull: false,
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

    // Estado y fechas
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
UserModel.belongsTo(RoleModel, { foreignKey: 'role_id', as: 'role'});
RoleModel.hasMany(UserModel, { foreignKey: 'role_id', as: 'users'});

export default UserModel;