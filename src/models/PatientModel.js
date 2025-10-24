import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";


const PatientModel = sequelize.define('patient', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  therapy_goals: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  medical_history: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  photo:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
},{
    tableName: 'patient',
    timestamps: true,
    paranoid: true,
    underscored: true
    
});

export default PatientModel;
