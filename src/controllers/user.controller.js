import UserModel from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";
import { generateJWT } from "../utils/generateJWT.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll({
            include: {
                model: RoleModel,
                as: 'role',
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
        console.log('=== assignRole ===');
        const { userId, roleName } = req.body;
        console.log('1. Datos recibidos:', { userId, roleName });

        // Validación de entrada
        if (!userId || !roleName) {
            return res.status(400).json({ message: 'userId y roleName son requeridos' });
        }

        // Buscar usuario
        console.log('2. Buscando usuario con id:', userId);
        const user = await UserModel.findByPk(userId);
        if (!user) {
            console.log('❌ Usuario no encontrado');
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log('3. Usuario encontrado:', user.email);

        // Buscar rol
        console.log('4. Buscando rol:', roleName);
        const role = await RoleModel.findOne({ where: { name: roleName } });
        if (!role) {
            console.log('❌ Rol no encontrado');
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        console.log('5. Rol encontrado, id:', role.id);

        // Asignar rol
        console.log('6. Asignando rol al usuario...');
        user.role_id = role.id;
        await user.save();
        console.log('7. Rol guardado');

        // Recargar con la relación
        console.log('8. Recargando usuario con relación role...');
        await user.reload({ include: { model: RoleModel, as: 'role' } });
        console.log('9. Usuario recargado. Rol actual:', user.role?.name);

        // Generar nuevo token con el rol actualizado
        console.log('10. Generando nuevo JWT...');
        const token = generateJWT({
            id: user.id,
            email: user.email,
            role: user.role.name,
        });
        console.log('11. JWT generado');

        // ESTA ES LA PARTE CRÍTICA - Devolver usuario completo y token
        const response = {
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                avatar: user.avatar,
                role: user.role.name,
            },
            token,
        };

        console.log('12. Enviando respuesta completa:', response);
        res.status(200).json(response);
        
    } catch (error) {
        console.error("❌ Error al asignar rol:", error);
        res.status(500).json({ message: error.message });
    }
};