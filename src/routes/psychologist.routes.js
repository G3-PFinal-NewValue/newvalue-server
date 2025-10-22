import { Router } from "express";
import { createPsychologistProfile, getAllPsychologists,getPsychologistById,updatePsychologistProfile } from "../controllers/psychologist.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Crear perfil de psicólogo
router.post('/', createPsychologistProfile);

// Obtener todos los psicólogos
router.get('/', getAllPsychologists);

// Obtener psicólogo por user_id
router.get('/:id', getPsychologistById);

// Actualizar perfil de psicólogo
router.put('/:id', updatePsychologistProfile);

// Desactivar psicólogo
router.patch('/:id/deactivate', deactivatePsychologist);

// Activar psicólogo
router.patch('/:id/activate', activatePsychologist);

// Validar registro de psicólogo
router.patch('/:id/validate', validatePsychologist);

// Eliminar psicólogo 
router.delete('/:id', deletePsychologist);

export default router;