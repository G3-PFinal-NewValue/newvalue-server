import { sequelize } from "../config/database.js"; 
import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";
import UserRoleModel from "./UserRoleModel.js";
import PsychologistModel from "./PsychologistModel.js";
import SpecialtyModel from "./SpecialtyModel.js";

// Relación User <-> Role
UserModel.belongsToMany(RoleModel, { through: UserRoleModel, foreignKey: "userId" });
RoleModel.belongsToMany(UserModel, { through: UserRoleModel, foreignKey: "roleId" });

// Tabla intermedia para Psychologist <-> Specialty
const PsychologistSpecialty = sequelize.define(
  "psychologist_specialty",
  {}, 
  { timestamps: false }
);

// Relación muchos a muchos Psychologist <-> Specialty
PsychologistModel.belongsToMany(SpecialtyModel, { through: PsychologistSpecialty, foreignKey: "psychologistId" });
SpecialtyModel.belongsToMany(PsychologistModel, { through: PsychologistSpecialty, foreignKey: "specialtyId" });

export { UserModel, RoleModel, UserRoleModel, PsychologistSpecialty, PsychologistModel, SpecialtyModel };
