import bcrypt from "bcrypt";
import authService from "../services/auth.service.js";
import UserModel from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";
import { generateJWT } from "../utils/generateJWT.js";

// Login con Google
export const googleLogin = async (req, res) => {
  try {
    console.log("=== CONTROLLER: googleLogin ===");
    const { token } = req.body;

    console.log("1. Token recibido en body:", token ? "SÍ" : "NO");

    if (!token) {
      console.log("❌ No se recibió token");
      return res.status(400).json({ message: "Token requerido" });
    }

    console.log("2. Llamando a authService.googleLogin...");
    const data = await authService.googleLogin(token);

    console.log("3. Datos recibidos de authService:", data ? "SÍ" : "NO");

    if (!data) {
      console.error("❌ authService.googleLogin devolvió datos vacíos");
      return res
        .status(500)
        .json({ message: "Error al procesar login de Google" });
    }

    console.log("4. Verificando data.user...", data.user ? "SÍ" : "NO");

    if (!data.user) {
      console.error("❌ authService.googleLogin no devolvió usuario");
      console.error("Datos completos:", JSON.stringify(data, null, 2));
      return res.status(400).json({ message: "User is not defined" });
    }

    console.log("✅ Login con Google exitoso para:", data.user.email);
    console.log("5. Enviando respuesta al cliente...");
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ ERROR CAPTURADO en googleLogin controller:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      message: error.message || "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Registro con email y contraseña
export const registerController = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      phone,
      postal_code,
      province,
      full_address,
      city,
      country,
      dni_nie_cif,
    } = req.body;

    // Validar campos obligatorios
    // if (!first_name || !last_name || !email || !password) {
    //   return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    // }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Establecer el rol por defecto si no se envía
    const roleName = role ? role.toLowerCase() : "patient";

    // Buscar rol en la base de datos
    const roleRecord = await RoleModel.findOne({ where: { name: roleName } });
    if (!roleRecord) {
      return res
        .status(400)
        .json({ message: "Rol no válido o no encontrado." });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      role_id: roleRecord.id,
      status: "active",
      phone,
      postal_code,
      province,
      full_address,
      city,
      country,
      dni_nie_cif,
    });

    // Generar token JWT
    const token = generateJWT({
      id: newUser.id,
      email: newUser.email,
      role: roleRecord.name,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: roleRecord.name,
      },
      token,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }
    res
      .status(500)
      .json({ message: "Error en el registro", error: error.message });
  }
};

// Login con email y contraseña
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar que se envíen los campos
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña requeridos." });
    }

    // Buscar usuario con la relación 'role'
    const user = await UserModel.findOne({
      where: { email },
      include: {
        model: RoleModel,
        as: "role",
        attributes: ["id", "name"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // Verificar si el usuario está activo
    if (user.status !== "active") {
      return res.status(403).json({ message: "Cuenta inactiva o suspendida." });
    }

    const token = generateJWT({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role.name,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: error.message });
  }
};
