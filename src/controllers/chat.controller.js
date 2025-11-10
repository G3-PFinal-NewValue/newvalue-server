import axios from 'axios';
import 'dotenv/config';

// --- Configuración de la API REST de CometChat ---
const APP_ID = process.env.COMETCHAT_APP_ID;
const REGION = process.env.COMETCHAT_REGION;
const AUTH_KEY = process.env.COMETCHAT_AUTH_KEY;

// v3 es la versión que coincide con los paquetes de frontend @cometchat-pro/chat
const API_BASE_URL = `https://api-${REGION}.cometchat.io/v3`;

// Creamos una instancia de axios pre-configurada para la API de CometChat
const cometchatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'apiKey': AUTH_KEY // Así autenticamos nuestro servidor
  }
});
// --- Fin de la Configuración ---


/**
 * Genera un token de autenticación de CometChat para el usuario logueado.
 * Si el usuario no existe en CometChat, lo crea primero.
 */
export const getCometChatToken = async (req, res) => {
  try {
    // 1. Obtener tu usuario logueado (gracias al authMiddleware)
    const userId = req.user.id.toString();
    // Asumo que el nombre está en req.user, ajústalo si es necesario
    const userName = req.user.name || `${req.user.firstName} ${req.user.lastName}` || `Usuario ${userId}`;

    // 2. Intentar crear el usuario en CometChat
    try {
      await cometchatApi.post('/users', {
        uid: userId,
        name: userName,
      });
      console.log('Usuario creado en CometChat:', userId);
    } catch (error) {
      // Si el error es 'UID_ALREADY_EXISTS', está bien, significa que ya existe
      if (error.response && error.response.data?.error?.code === 'UID_ALREADY_EXISTS') {
        console.log('Usuario ya existe en CometChat:', userId);
      } else {
        // Otro error (ej. 401 Unauthenticated)
        console.error('Error al crear usuario en CometChat:', error.response?.data || error.message);
        throw new Error('Error al crear usuario de chat');
      }
    }

    // 3. Generar un Auth Token para ese usuario
    // Usamos force: true para generar un nuevo token y evitar conflictos
    const tokenResponse = await cometchatApi.post(`/users/${userId}/auth_tokens`, {
      force: true 
    });

    const authToken = tokenResponse.data.data.authToken;

    // 4. Enviar el token al frontend
    res.status(200).send({
      uid: userId,
      authToken: authToken,
    });

  } catch (error) {
    console.error('Error final en getCometChatToken:', error.message);
    res.status(500).send({ message: 'Error interno del servidor (CometChat)' });
  }
};