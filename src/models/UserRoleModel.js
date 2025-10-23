import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";

const UserRoleModel = sequelize.define(
  "user_role",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: "user", key: "id" },
      primaryKey: true,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: { model: "role", key: "id" },
      primaryKey: true,
      allowNull: false
    }
  },
  {
    tableName: "user_role",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "role_id"]
      }
    ]
  }
);

export default UserRoleModel;
