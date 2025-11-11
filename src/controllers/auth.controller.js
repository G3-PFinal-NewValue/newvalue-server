import bcrypt from "bcrypt";
import authService from "../services/auth.service.js";
import UserModel from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";
import { generateJWT } from "../utils/generateJWT.js";
import transporter from "../config/nodemailer.js";


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

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const roleName = role ? role.toLowerCase() : "patient";
    const roleRecord = await RoleModel.findOne({ where: { name: roleName } });
    if (!roleRecord) {
      return res
        .status(400)
        .json({ message: "Rol no válido o no encontrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    // === 📧 Enviar correo de bienvenida ===
    await transporter.sendMail({
      from: `"Cora Mind" <${process.env.SMTP_USER}>`,
      to: newUser.email,
      subject: "Bienvenida a Cora Mind",
      html: `
        <div style="background-color: #f4f1e8; font-family: 'Visby', system-ui, sans-serif; color: #333; padding: 30px 20px; font-size: 16px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://res.cloudinary.com/dkm0ahny1/image/upload/v1762168143/coramind-logo-email_aiwngo.png" width="140" alt="Cora Mind Logo" />
            <h2 style="color: #ee9271; margin: 10px 0;">Bienvenida, ${newUser.first_name}</h2>
          </div>
          <p>Tu cuenta ha sido creada correctamente en <strong>Cora Mind</strong>.</p>
          <p>Ya puedes iniciar sesión con tu correo electrónico para acceder a tu área personal.</p>
          <p>Gracias por confiar en nosotros.<br><strong>El equipo de Cora Mind</strong></p>
        </div>
      `,
    });

    // === 🔐 Generar token JWT ===
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

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña requeridos." });
    }

    // Buscar usuario con su rol
    const user = await UserModel.findOne({
      where: { email },
      include: {
        model: RoleModel,
        as: "role",
        attributes: ["id", "name"],
      },
    });

    // Usuario no encontrado
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Si el usuario fue creado por admin y aún no estableció contraseña
    if (!user.password_hash) {
      return res.status(403).json({ message: "Debes establecer una contraseña antes de iniciar sesión." });
    }

    // Comparar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // Verificar estado del usuario
    if (user.status !== "active") {
      return res.status(403).json({ message: "Cuenta inactiva o suspendida." });
    }

    // Generar token JWT
    const token = generateJWT({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    // Respuesta exitosa
    return res.status(200).json({
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
    return res.status(500).json({ message: error.message });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("🟢 Token recibido");

    if (!token || !password) {
      return res.status(400).json({ message: "Token o contraseña faltante." });
    }

    // Buscar usuario con ese token
    const user = await UserModel.findOne({
      where: { user_password_token: token },
    });

    if (!user) {
      console.log("❌ Usuario no encontrado con el token");
      return res.status(400).json({ message: "Token inválido." });
    }

    // Verificar expiración
    if (user.user_password_token_expiration < new Date()) {
      console.log("❌ Token expirado");
      return res.status(400).json({ message: "El enlace ha expirado." });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Contraseña hasheada:", hashedPassword);

    // Guardar nueva contraseña y limpiar token
    user.set({
      password_hash: hashedPassword,
      user_password_token: null,
      user_password_token_expiration: null,
    });

    await user.save();

    console.log("✅ Contraseña guardada correctamente para:", user.email);

    return res
      .status(200)
      .json({ message: "Contraseña establecida correctamente." });
  } catch (error) {
    console.error("❌ Error en setPassword:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};