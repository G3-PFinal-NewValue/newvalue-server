import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
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
  paranoid:true,
});

export default AvailabilityModel;