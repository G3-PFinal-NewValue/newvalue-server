import { Router } from "express";
import { createPsychologistProfile, getAllPsychologists,getPsychologistById,updatePsychologistProfile } from "../controllers/psychologist.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

//crear perfil de psicólogo
router.post("/", authenticateToken, createPsychologistProfile);
//get all
router.get("/", authenticateToken, getAllPsychologists);
//get por user_id
router.get("/:user_id", authenticateToken, getPsychologistById);
//PUT
router.put("/", authenticateToken, updatePsychologistProfile);

export default router;