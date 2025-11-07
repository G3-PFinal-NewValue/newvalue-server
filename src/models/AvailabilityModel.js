import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import PsychologistModel from './PsychologistModel.js';

const AvailabilityModel = sequelize.define('availability', {
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
    allowNull: true, 
    validate: {
      min: 1,
      max: 7,
    },
  },

  specific_date: { // Campo para fechas específicas
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
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

  is_available: { //  Determina si está disponible (true) o no disponible (false)
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  notes: { //  Campo opcional para notas adicionales
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'availability',
  timestamps: false,
  underscored: true,
  paranoid:true
});

export default AvailabilityModel;