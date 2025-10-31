import { sequelize } from "../config/database.js"; 
import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";
import PsychologistModel from "./PsychologistModel.js";
import SpecialityModel from "./SpecialityModel.js";
import ArticleModel from "./ArticleModel.js"
import CategoryArticleModel from "./CategoryArticleModel.js"
import AppointmentModel from "./AppointmentModel.js";
import AvailabilityModel from "./AvailabilityModel.js";
import SessionModel from "./SessionModel.js";
import PatientModel from "./PatientModel.js";

// Tabla intermedia para Psychologist <-> Speciality
const PsychologistSpeciality = sequelize.define(
  "psychologist_speciality",
  {}, 
  { timestamps: false }
);

// Relación muchos a muchos Psychologist <-> Speciality
PsychologistModel.belongsToMany(SpecialityModel, { through: PsychologistSpeciality, as: "specialities", foreignKey: "psychologist_id" });
SpecialityModel.belongsToMany(PsychologistModel, { through: PsychologistSpeciality, as: "psychologists", foreignKey: "speciality_id" });

// ------------------------------------
// RELACIÓN USER <-> PATIENT
// ------------------------------------
UserModel.hasOne(PatientModel, {
  foreignKey: "user_id",
  as: "patient",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

PatientModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

// ------------------------------------
// RELACIÓN USER <-> PSYCHOLOGIST
// ------------------------------------
UserModel.hasOne(PsychologistModel, {
  foreignKey: "user_id",
  as: "psychologist",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

PsychologistModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

// Relación Category <-> Article (una categoría tiene muchos artículos)
CategoryArticleModel.hasMany(ArticleModel, {
  foreignKey: "category_id",
  as: "articles",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// Un artículo pertenece a una categoría
ArticleModel.belongsTo(CategoryArticleModel, {
  foreignKey: "category_id",
  as: "category",
});

// Relación User <-> Article 
UserModel.hasMany(ArticleModel, {
  foreignKey: "author_id",
  as: "articles",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Un artículo pertenece al admin
ArticleModel.belongsTo(UserModel, {
  foreignKey: "author_id",
  as: "author",
});

// ------------------------------------
// RELACIÓN PSYCHOLOGIST <-> AVAILABILITY 
// ------------------------------------
PsychologistModel.hasMany(AvailabilityModel, {
  foreignKey: "psychologist_id",
  as: "availabilities",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

AvailabilityModel.belongsTo(PsychologistModel, {
  foreignKey: "psychologist_id",
  as: "psychologist",
});

// ------------------------------------
// RELACIÓN AVAILABILITY <-> APPOINTMENT 
// ------------------------------------
AvailabilityModel.hasOne(AppointmentModel, {
  foreignKey: "availability_id",
  as: "appointment",
  onDelete: "SET NULL", // si se elimina la cita, la disponibilidad queda libre
  onUpdate: "CASCADE",
});

AppointmentModel.belongsTo(AvailabilityModel, {
  foreignKey: "availability_id",
  as: "availability",
});

// ------------------------------------
// (Opcional) RELACIÓN PSYCHOLOGIST/PATIENT <-> APPOINTMENT
// ------------------------------------
PsychologistModel.hasMany(AppointmentModel, {
  foreignKey: "psychologist_id",
  as: "appointments",
  onDelete: "CASCADE",
});
AppointmentModel.belongsTo(PsychologistModel, {
  foreignKey: "psychologist_id",
  as: "psychologist",
});

UserModel.hasMany(AppointmentModel, {
  foreignKey: "patient_id",
  as: "appointments",
  onDelete: "CASCADE",
});
AppointmentModel.belongsTo(UserModel, {
  foreignKey: "patient_id",
  as: "patient",
});


export { UserModel, RoleModel, PatientModel, PsychologistSpeciality, PsychologistModel, SpecialityModel, ArticleModel, CategoryArticleModel, AvailabilityModel, AppointmentModel, SessionModel};
