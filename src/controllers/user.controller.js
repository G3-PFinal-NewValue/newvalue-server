import UserModel from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll({
            include: {
                model: RoleModel,
                through: { attributes: [] }, 
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.params.id, {
            include: {
                model: RoleModel,
                through: { attributes: [] },
            },
        });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { email, name, roleName } = req.body;

        // Crear usuario
        const newUser = await UserModel.create({ email, name });

        // Asignar rol por defecto o especificado
        const role = await RoleModel.findOne({ where: { name: roleName || "patient" } });
        await newUser.addRole(role);

        res.status(201).json({ user: newUser, role: role.name });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updated = await UserModel.update({ name, email }, {
            where: { id: req.params.id },
            returning: true,
        });
        res.status(200).json({ message: "Usuario actualizado", user: updated[1][0] });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

export const deactivateUser = async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        user.status = "inactive";
        await user.save();

        res.status(200).json({ message: "Usuario desactivado", user });
    } catch (error) {
        console.error("Error al desactivar usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

export const activateUser = async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        user.status = "active";
        await user.save();

        res.status(200).json({ message: "Usuario activado", user });
    } catch (error) {
        console.error("Error al activar usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deleted = await UserModel.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

export const assignRole = async (req, res) => {
    try {
        const { roleName } = req.body;
        const user = await UserModel.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const role = await RoleModel.findOne({ where: { name: roleName } });
        if (!role) return res.status(404).json({ message: "Rol no encontrado" });

        await user.addRole(role);
        res.status(200).json({ message: `Rol ${role.name} asignado al usuario`, user });
    } catch (error) {
        console.error("Error al asignar rol:", error);
        res.status(400).json({ message: error.message });
    }
};
