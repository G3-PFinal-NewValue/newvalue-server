// src/models/UserRoleModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";

const UserRoleModel = sequelize.define("UserRole", {
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: UserModel, key: "id" },
        primaryKey: true,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: { model: RoleModel, key: "id" },
        primaryKey: true,
        allowNull: false,
    },
}, {
    tableName: "user_roles",
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ["userId", "roleId"]
        }
    ]
});

export default UserRoleModel;
