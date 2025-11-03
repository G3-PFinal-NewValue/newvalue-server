import { Router } from "express";
import {
  createPsychologistProfile,
  getAllPsychologists,
  getMyProfile,
  updateMyProfile,
  getPsychologistById,
  updatePsychologistProfile,
  deactivatePsychologist,
  activatePsychologist,
  validatePsychologist,
  deletePsychologist
} from "../controllers/psychologist.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ownershipMiddleware from "../middleware/ownerMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import multer from "multer";

const psychologistRouter = Router();

// Configuración de Multer
const upload = multer({ dest: 'uploads/' }); // carpeta temporal

// 🔹 Ver y editar el propio perfil
psychologistRouter.get("/profile", authMiddleware, roleMiddleware("psychologist"), getMyProfile);
psychologistRouter.put("/profile", authMiddleware, roleMiddleware("psychologist"), upload.single("photo"), updateMyProfile);

// Crear perfil de psicólogo con foto opcional
psychologistRouter.post('/', authMiddleware, roleMiddleware('psychologist'), upload.single('photo'), createPsychologistProfile);

// Obtener todos los psicólogos
psychologistRouter.get('/', authMiddleware, roleMiddleware(), getAllPsychologists);

// Obtener psicólogo por user_id
psychologistRouter.get('/:id', authMiddleware, getPsychologistById);

// Actualizar perfil de psicólogo con posible nueva foto
psychologistRouter.put('/:id', authMiddleware, ownershipMiddleware, upload.single('photo'), updatePsychologistProfile);

// Desactivar psicólogo
psychologistRouter.patch('/:id/deactivate', authMiddleware, ownershipMiddleware, deactivatePsychologist);

// Activar psicólogo
psychologistRouter.patch('/:id/activate', authMiddleware, roleMiddleware('admin'), activatePsychologist);

// Validar registro de psicólogo
psychologistRouter.patch('/:id/validate', authMiddleware, roleMiddleware('admin'), validatePsychologist);

// Eliminar psicólogo 
psychologistRouter.delete('/:id', authMiddleware, ownershipMiddleware, deletePsychologist);

export default psychologistRouter;
