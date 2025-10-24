'use strict';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import AppointmentModel from './AppointmentModel.js';

const SessionModel = sequelize.define('Session', {
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
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
});

// Relación con Appointment
SessionModel.belongsTo(AppointmentModel, { foreignKey: 'appointment_id' });

export default SessionModel;
