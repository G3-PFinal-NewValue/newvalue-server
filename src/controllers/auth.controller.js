import bcrypt from 'bcrypt';
import authService from '../services/auth.service.js';
import UserModel from '../models/UserModel.js';
import { generateJWT } from '../utils/generateJWT.js';

// 🔹 Login con Google
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const data = await authService.googleLogin(token);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

// 🔹 Registro con email y contraseña
export const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashea la contraseña
    const hashPassword = await bcrypt.hash(password, 10);

    // Crea el usuario
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
      role: role || 'User',
    });

    // Genera token JWT
    const token = generateJWT(newUser);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Login con email y contraseña
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateJWT(user);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: error.message });
  }
};
