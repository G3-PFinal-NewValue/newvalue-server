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
            isIn: [["admin", "psychologist", "patient"]],
        },
    },
}, {
    tableName: "role",
    timestamps: false,
    paranoid:true,
    underscored: true
});

export default RoleModel;
