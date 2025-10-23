import bcrypt from 'bcrypt';
import authService from '../services/auth.service.js';
import UserModel from '../models/UserModel.js';
import { generateJWT } from '../utils/generateJWT.js';

// 🔹 Login con Google
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const data = await authService.googleLogin(token);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).send({message:error.message});
  }
};

// 🔹 Registro con email y contraseña
export const registerController = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    // Validación básica
    if (!email || !password || !first_name) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Verifica si el usuario ya existe
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya esta registrado' });
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el usuario
    const newUser = await UserModel.create({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      status: 'active',
    });

    // Genera token JWT
    const token = generateJWT(newUser);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: newUser.id, email: newUser.email, first_name: newUser.first_name, last_name: newUser.last_name },
      token,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Login con email y contraseña
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

     // Verificar que se envíen los campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña requeridos.' });
    }

    //Buscar usuario
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }


    const checkPassword = await bcrypt.compare(password, user.password_hash);
    if (!checkPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateJWT(user);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: error.message });
  }
};
