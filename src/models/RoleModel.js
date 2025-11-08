import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const RoleModel = sequelize.define("role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isIn: [["admin", "psychologist", "patient", "pending"]],
    },
  },
}, {
  tableName: "role",
  timestamps: false,  
  underscored: true,
});

export default RoleModel;