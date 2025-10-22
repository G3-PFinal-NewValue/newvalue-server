import { Router } from "express";
import {
  createPsychologistProfile,
  getAllPsychologists,
  getPsychologistById,
  updatePsychologistProfile
} from "../controllers/psychologist.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = Router();

// Configuración de Multer
const upload = multer({ dest: 'uploads/' }); // carpeta temporal

// Crear perfil de psicólogo con subida de foto
router.post("/", authenticateToken, upload.single('photo'), createPsychologistProfile);

// Obtener todos los psicólogos
router.get("/", authenticateToken, getAllPsychologists);

// Obtener perfil por user_id
router.get("/:user_id", authenticateToken, getPsychologistById);

// Actualizar perfil de psicólogo con posible nueva foto
router.put("/", authenticateToken, upload.single('photo'), updatePsychologistProfile);

export default router;