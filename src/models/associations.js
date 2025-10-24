import { sequelize } from "../config/database.js"; 
import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";
import UserRoleModel from "./UserRoleModel.js";
import PsychologistModel from "./PsychologistModel.js";
import SpecialtyModel from "./SpecialtyModel.js";
import ArticleModel from "./ArticleModel.js"
import CategoryArticleModel from "./CategoryArticleModel.js"

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

export { UserModel, RoleModel, UserRoleModel, PsychologistSpecialty, PsychologistModel, SpecialtyModel, ArticleModel, CategoryArticleModel };
