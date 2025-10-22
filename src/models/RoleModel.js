import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import UserModel from "./UserModel.js";

const RoleModel = sequelize.define("Role", {
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
            isIn: [["admin", "patient", "psychologist"]],
        },
    },
}, {
    tableName: "roles",
    timestamps: false,
});

RoleModel.belongsToMany(UserModel, {
    through: "user_roles",
    foreignKey: "role_id",
    otherKey: "user_id",
});

export default RoleModel;
