import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import SpecialtyModel from "./SpecialityModel.js";


const PsychologistModel = sequelize.define("psychologist", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "user", 
      key: "id"
    }
  },

  license_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: "El número de colegiado es obligatorio."
      },
      len: {
        args: [3, 50],
        msg: "El número de colegiado debe tener entre 3 y 50 caracteres."
      }
    }
  },

  specialty_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SpecialtyModel,
      key: "id"
    }
  },

  professional_description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [10, 2000],
        msg: "Este campo debe tener como mínimo 10 caracteres."
      }
    }
  },

  photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: {
        msg: "El campo foto debe contener una URL válida."
      }
    }
  },

  validated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  }

}, {
  tableName: "psychologist",
  timestamps: true,
  paranoid:true
});

export default PsychologistModel;
