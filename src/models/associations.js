import { sequelize } from "../config/database.js"; 
import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";
import PsychologistModel from "./PsychologistModel.js";
import SpecialityModel from "./SpecialityModel.js";
import ArticleModel from "./ArticleModel.js"
import CategoryArticleModel from "./CategoryArticleModel.js"
import AvailabilityModel from "./AvailabilityModel.js";

// Tabla intermedia para Psychologist <-> Speciality
const PsychologistSpeciality = sequelize.define(
  "psychologist_speciality",
  {}, 
  { timestamps: false }
);

// Relación muchos a muchos Psychologist <-> Speciality
PsychologistModel.belongsToMany(SpecialityModel, { through: PsychologistSpeciality, as: "specialities", foreignKey: "psychologist_id" });
SpecialityModel.belongsToMany(PsychologistModel, { through: PsychologistSpeciality, as: "psychologists", foreignKey: "speciality_id" });

//CA: Agrego estas nuevas asociaciones
// Relación User <-> Psychologist (Uno a Uno)
// Un usuario tiene un perfil de psicólogo
UserModel.hasOne(PsychologistModel, { foreignKey: 'user_id', as: 'psychologist_profile' });
// Un perfil de psicólogo pertenece a un usuario
PsychologistModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

// Relación Psychologist <-> Availability (Uno a Muchos)
// Un psicólogo tiene muchas disponibilidades
PsychologistModel.hasMany(AvailabilityModel, { foreignKey: 'psychologist_id', as: 'availabilities' });
// Una disponibilidad pertenece a un psicólogo
AvailabilityModel.belongsTo(PsychologistModel, { foreignKey: 'psychologist_id', as: 'psychologist' });

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


export { UserModel, RoleModel, PsychologistSpeciality, PsychologistModel, SpecialityModel, ArticleModel, CategoryArticleModel, AvailabilityModel };
