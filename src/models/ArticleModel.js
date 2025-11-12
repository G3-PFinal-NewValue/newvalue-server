import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import UserModel from './UserModel.js';


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
      model: 'user',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },

  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'category',
      key: 'id',
    },
    onDelete: 'SET NULL',
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

    image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
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