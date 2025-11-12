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
    allowNull: true, // CA: permitir nulo para compatibilidad con fechas específicas
    validate: { // CA: mantener validación cuando exista
      min: 1, // CA: mínimo lunes
      max: 7, // CA: máximo domingo
    },
  },

  specific_date: {
    type: DataTypes.DATEONLY, // CA: almacenar la fecha exacta seleccionada
    allowNull: false, // CA: los bloques ahora son por día específico
  },

  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },

  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate:{
      isAfterStart(value) {
        if (this.start_time && value <= this.start_time) {
          throw new Error('La hora de finalización debe ser posterior a la hora de inicio');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'unavailable'),
    allowNull: false,
    defaultValue: 'available',
  },
  is_available: {
    type: DataTypes.BOOLEAN, // CA: bandera directa para UI
    allowNull: false, // CA: evitar valores indefinidos
    defaultValue: true, // CA: por defecto disponible
  },
  notes: {
    type: DataTypes.TEXT, // CA: guardar notas opcionales
    allowNull: true, // CA: campo libre
  },
}, {
  tableName: 'availability',
  timestamps: false,
  underscored: true,
  paranoid:true
});

export default AvailabilityModel;
