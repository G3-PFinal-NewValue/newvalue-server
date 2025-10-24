import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const SpecialtyModel = sequelize.define("specialty", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [3, 100],
        msg: "El nombre de la especialidad debe tener entre 3 y 100 caracteres"
      }
    }
  }
}, {
  tableName: "specialty",
  timestamps: false, 
  paranoid: true
});

export default SpecialtyModel;
