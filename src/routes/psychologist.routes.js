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
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = Router();

// Configuración de Multer
const upload = multer({ dest: 'uploads/' }); // carpeta temporal

// Crear perfil de psicólogo con foto opcional
router.post('/', authMiddleware, upload.single('photo'), createPsychologistProfile);

// Obtener todos los psicólogos
router.get('/', authMiddleware, getAllPsychologists);

// Obtener psicólogo por user_id
router.get('/:id', authMiddleware, getPsychologistById);

// Actualizar perfil de psicólogo con posible nueva foto
router.put('/:id', authMiddleware, upload.single('photo'), updatePsychologistProfile);

// Desactivar psicólogo
router.patch('/:id/deactivate', authMiddleware, deactivatePsychologist);

// Activar psicólogo
router.patch('/:id/activate', authMiddleware, activatePsychologist);

// Validar registro de psicólogo
router.patch('/:id/validate', authMiddleware, validatePsychologist);

// Eliminar psicólogo 
router.delete('/:id', authMiddleware, deletePsychologist);

export default router;
