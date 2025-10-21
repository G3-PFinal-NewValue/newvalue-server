const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AppointmentModel = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  psychologist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user', 
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
    defaultValue: 50, // Default duration is 50 minutes
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
  tableName: 'appointments',
  timestamps: true,
  underscored: true, // Use snake_case for automatically added attributes
  indexes: [
    { fields: ['patient_id'] },
    { fields: ['psychologist_id'] },
    { fields: ['date'] },
  ],
});

module.exports = AppointmentModel;