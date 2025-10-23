import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import UserModel from './UserModel.js';

const AppointmentModel = sequelize.define('appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  psychologist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },

  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50,
    validate: {
      min: 15,
      max: 180,
    },
  },

  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  session_link: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
}, {
  tableName: 'appointment',
  timestamps: true,
  underscored: true,
  paranoid:true,
  indexes: [
    { fields: ['psychologist_id', 'date'] },
    { fields: ['patient_id', 'date'] },
  ],
});

export default AppointmentModel;