import bcrypt from 'bcrypt';
import authService from '../services/auth.service.js';
import UserModel from '../models/UserModel.js';
import { generateJWT } from '../utils/generateJWT.js';
import dotenv from 'dotenv';

dotenv.config();


// Login con Google
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

// Registro con email y contraseña
export const registerController = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    // Validar campos obligatorios
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Rol por defecto (patient)
    const userRole = role && ['patient', 'psychologist'].includes(role)
      ? role
      : 'patient';

    // Crear usuario
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      role: userRole,
      status: 'active',
    });

    // Generar token JWT
    const token = generateJWT(newUser);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

//Login con email y contraseña
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

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Verificar si el usuario está activo
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Cuenta inactiva o suspendida.' });
    }

    const token = generateJWT(user);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: error.message });
  }
};
