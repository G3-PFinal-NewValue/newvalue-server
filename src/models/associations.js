import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";
import UserRoleModel from "./UserRoleModel.js";

// Relación User <-> Role
UserModel.belongsToMany(RoleModel, { through: UserRoleModel, foreignKey: "userId" });
RoleModel.belongsToMany(UserModel, { through: UserRoleModel, foreignKey: "roleId" });

export { UserModel, RoleModel, UserRoleModel };
