import { Router } from "express";
import {
  createPsychologistProfile,
  getAllPsychologists,
  getPsychologistById,
  updatePsychologistProfile,
  deactivatePsychologist,
  activatePsychologist,
  validatePsychologist,
  deletePsychologist
} from "../controllers/psychologist.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = Router();

// Configuración de Multer
const upload = multer({ dest: 'uploads/' }); // carpeta temporal

// Crear perfil de psicólogo con foto opcional
router.post('/', authenticateToken, upload.single('photo'), createPsychologistProfile);

// Obtener todos los psicólogos
router.get('/', authenticateToken, getAllPsychologists);

// Obtener psicólogo por user_id
router.get('/:id', authenticateToken, getPsychologistById);

// Actualizar perfil de psicólogo con posible nueva foto
router.put('/:id', authenticateToken, upload.single('photo'), updatePsychologistProfile);

// Desactivar psicólogo
router.patch('/:id/deactivate', authenticateToken, deactivatePsychologist);

// Activar psicólogo
router.patch('/:id/activate', authenticateToken, activatePsychologist);

// Validar registro de psicólogo
router.patch('/:id/validate', authenticateToken, validatePsychologist);

// Eliminar psicólogo 
router.delete('/:id', authenticateToken, deletePsychologist);

export default router;