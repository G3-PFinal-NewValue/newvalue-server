import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const SpecialityModel = sequelize.define("speciality", {
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
  tableName: "speciality",
  timestamps: false, 
  paranoid: true,
  underscored: true

});

export default SpecialityModel;
