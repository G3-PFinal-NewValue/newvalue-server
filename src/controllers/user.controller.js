import UserModel from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";
import { generateJWT } from "../utils/generateJWT.js";



// =========================
// CONTROLADOR DE USUARIOS
// =========================

// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const include = [{
            model: RoleModel,
            as: 'role',
            attributes: ['name'],
        }];

        // Si se pide filtrar por rol (patient, psychologist, admin)
        let whereClause = {};
        if (role) {
            const roleRecord = await RoleModel.findOne({
                where: { name: role.toLowerCase() },
            });

            if (!roleRecord) {
                return res.status(400).json({ message: `El rol '${role}' no existe` });
            }

            whereClause = { role_id: roleRecord.id };
        }
        const users = await UserModel.findAll({
            where: whereClause,
            include,
            attributes: ["id", "first_name", "last_name", "email", "created_at"],
            order: [["id", "ASC"]],
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(400).json({ message: error.message });
    }
};

//Obtener un usuario por ID (solo admin)
export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.params.id, {
            include: {
                model: RoleModel,
                as: 'role',
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
        const {
            email,
            first_name,
            last_name,
            phone,
            postal_code,
            province,
            full_address,
            city,
            country,
            dni_nie_cif,
            roleName
        } = req.body;

        // Validación de campos obligatorios
        if (!email || !first_name || !last_name || !phone || !postal_code || !province || !full_address || !city || !country || !dni_nie_cif) {
            return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
        }

        const newUser = await UserModel.create({
            email,
            first_name,
            last_name,
            phone,
            postal_code,
            province,
            full_address,
            city,
            country,
            dni_nie_cif,
            role_id: 3 // paciente por defecto
        });

        // Asignar rol
        const role = await RoleModel.findOne({ where: { name: roleName || "patient" } });
        newUser.role_id = role.id;
        await newUser.save();

        res.status(201).json({ message: "Usuario creado correctamente", user: newUser, role: role.name });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

//actualizar usuario (admin o propio usuario)
export const updateUser = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            phone,
            postal_code,
            province,
            full_address,
            city,
            country,
            dni_nie_cif,
            email
        } = req.body;

        const [rows, [updatedUser]] = await UserModel.update(
            { first_name, last_name, phone, postal_code, province, full_address, city, country, dni_nie_cif, email },
            { where: { id: req.params.id }, returning: true }
        );

        if (!rows) return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

//desactivar cuenta de usuario
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

//activar cuenta de usuario
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

// soft delete de eliminacion de usuario
export const deleteUser = async (req, res) => {
    try {
        const deleted = await UserModel.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(400).json({ message: error.message });
    }
};

// Asignar rol a usuario (solo admin)
export const assignRole = async (req, res) => {
    try {
        const { roleName } = req.body;

        if (!roleName) return res.status(400).json({ message: "Se requiere roleName" });

        const user = await UserModel.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const role = await RoleModel.findOne({ where: { name: roleName } });
        if (!role) return res.status(404).json({ message: "Rol no encontrado" });

        user.role_id = role.id;
        await user.save();

        // Recargar usuario con la relación
        await user.reload({ include: { model: RoleModel, as: 'role' } });

        // Generar nuevo token
        const token = generateJWT({
            id: user.id,
            email: user.email,
            role: user.role.name,
        });

        res.status(200).json({
            message: "Rol asignado correctamente",
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role.name,
            },
            token,
        })

        console.log('12. Enviando respuesta completa:', response);
        res.status(200).json(response);

    } catch (error) {
        console.error("Error al asignar rol:", error);
        res.status(500).json({ message: error.message });
    }
};