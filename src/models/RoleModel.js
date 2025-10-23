import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

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
            isIn: [["admin", "patient", "psychologist"]],
        },
    },
}, {
    tableName: "role",
    timestamps: false,
    paranoid:true,
});

RoleModel.belongsToMany(UserModel, {
    through: "user_role",
    foreignKey: "role_id",
    otherKey: "user_id",
});

export default RoleModel;
