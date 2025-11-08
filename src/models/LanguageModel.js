import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const LanguageModel = sequelize.define("language", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    code: {
        type: DataTypes.STRING(5),
        allowNull: true,
        unique: true,
    },
}, {
    tableName: "language",
    timestamps: false,
    underscored: true,
});

export default LanguageModel;
