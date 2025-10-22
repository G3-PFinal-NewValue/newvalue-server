import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

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
},
    {
    tableName:'roles'
});


export default RoleModel;
