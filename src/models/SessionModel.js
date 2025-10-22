import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import AppointmentModel from './AppointmentModel.js';

const SessionModel = sequelize.define('session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AppointmentModel,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  recommendations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  materials_sent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'session',
  timestamps: true,
  underscored: true,
});

export default SessionModel;