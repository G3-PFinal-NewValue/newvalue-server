const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const PsychologistModel = require('./PsychologistModel'); 

const AvailabilityModel = sequelize.define('Availability', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  psychologist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PsychologistModel, 
      key: 'user_id', 
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  weekday: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 7,
    },
  },

  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },

  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  tableName: 'availability',
  timestamps: false,
  underscored: true,
});

module.exports = AvailabilityModel;