import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import PsychologistModel from './PsychologistModel.js';

const ArticleModel = sequelize.define('Article', {
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
  tableName: 'articles',
  timestamps: true,
  underscored: true,
});

export default ArticleModel;