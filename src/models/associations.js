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
import LanguageModel from "./LanguageModel.js";

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
//RELACIÓN PSYCHOLOGIST/PATIENT <-> APPOINTMENT
// ------------------------------------
PsychologistModel.hasMany(AppointmentModel, {
  foreignKey: "psychologist_id",
  as: "appointments",
  onDelete: "CASCADE",
});
AppointmentModel.belongsTo(UserModel, {
  foreignKey: "psychologist_id", // CA: usar relación directa con user para psicólogo
  as: "psychologist", // CA: alias coincide con lo utilizado en los includes
  onDelete: "CASCADE", // CA: mantener reglas de cascada al alinear con usuarios
  onUpdate: "CASCADE", // CA: asegurar consistencia en actualizaciones
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

AppointmentModel.hasMany(SessionModel, { // CA: vincular citas con sesiones para habilitar include
  foreignKey: "appointment_id", // CA: usar la FK existente en session
  as: "sessions", // CA: alias requerido por los controladores
  onDelete: "CASCADE", // CA: limpiar sesiones al eliminar la cita
  onUpdate: "CASCADE", // CA: mantener integridad en updates
});
SessionModel.belongsTo(AppointmentModel, { // CA: asegurar referencia inversa con alias útil
  foreignKey: "appointment_id", // CA: misma FK de la relación
  as: "appointment", // CA: alias descriptivo para lecturas de sesión
});

PsychologistModel.belongsToMany(LanguageModel, {
  through: 'psychologist_languages',
  foreignKey: 'psychologist_id',
  otherKey: 'language_id',
  as: 'languages',
  timestamps: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

LanguageModel.belongsToMany(PsychologistModel, {
  through: 'psychologist_languages',
  foreignKey: 'language_id',
  otherKey: 'psychologist_id',
  as: 'psychologists',
  timestamps: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export { UserModel, RoleModel, PatientModel, PsychologistSpeciality, PsychologistModel, SpecialityModel, ArticleModel, CategoryArticleModel, AvailabilityModel, AppointmentModel, SessionModel, LanguageModel};
