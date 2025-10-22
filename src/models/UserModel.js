import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import RoleModel from './RoleModel.js';

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },
  avatar: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
});

UserModel.belongsToMany(RoleModel, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id",
});

export default UserModel;
