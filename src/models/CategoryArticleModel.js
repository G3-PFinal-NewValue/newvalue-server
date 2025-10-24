import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js'
const CategoryModel = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isIn: [[
        'Mindfulness',
        'Estrés',
        'Terapia',
        'Salud Mental',
        'Bienestar',
        'Ansiedad',
        'Comunicación'
      ]],
    },
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

}, {
  tableName: 'category',
  timestamps: false,
  underscored: true,
});

export default CategoryModel;
