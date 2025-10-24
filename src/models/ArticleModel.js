import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import PsychologistModel from './PsychologistModel.js';

const ArticleModel = sequelize.define('article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PsychologistModel,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  published_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'article',
  timestamps: true,
  underscored: true,
  paranoid: true
});

export default ArticleModel;