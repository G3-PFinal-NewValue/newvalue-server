import { sequelize } from "../config/database.js"; 
import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";
import PsychologistModel from "./PsychologistModel.js";
import SpecialityModel from "./SpecialityModel.js";
import ArticleModel from "./ArticleModel.js"
import CategoryArticleModel from "./CategoryArticleModel.js"


// Tabla intermedia para Psychologist <-> Speciality
const PsychologistSpeciality = sequelize.define(
  "psychologist_speciality",
  {}, 
  { timestamps: false }
);

// Relación muchos a muchos Psychologist <-> Speciality
PsychologistModel.belongsToMany(SpecialityModel, { through: PsychologistSpeciality, foreignKey: "psychologistId" });
SpecialityModel.belongsToMany(PsychologistModel, { through: PsychologistSpeciality, foreignKey: "specialityId" });

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

// Relación Psychologist <-> Article (un psicólogo escribe muchos artículos)
PsychologistModel.hasMany(ArticleModel, {
  foreignKey: "author_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Un artículo pertenece a un psicólogo (autor)
ArticleModel.belongsTo(PsychologistModel, {
  foreignKey: "author_id",
  as: "author",
});

export { UserModel, RoleModel, PsychologistSpeciality, PsychologistModel, SpecialityModel, ArticleModel, CategoryArticleModel };
