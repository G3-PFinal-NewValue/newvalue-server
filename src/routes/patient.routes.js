import express from "express";
import {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deactivatePatient,
    activatePatient,
    deletePatient,
} from "../controllers/patient.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import ownershipMiddleware from "../middleware/ownerMiddleware.js";
import multer from "multer";

const patientRouter = express.Router();

// Configuración de Multer
const upload = multer({ dest: 'uploads/' }); // carpeta temporal

// Solo admin puede ver todos los usuarios
patientRouter.get("/", roleMiddleware("admin"), getAllPatients);

// Cualquier usuario puede registrarse y crear una cuenta (con foto opcional)
patientRouter.post("/", upload.single('photo'), createPatient);

// Admin o el propio usuario pueden gestionar su cuenta (ver, editar, eliminar)
patientRouter.get("/:id", getPatientById);
patientRouter.put("/:id", upload.single('photo'), updatePatient);
patientRouter.patch("/:id/deactivate", deactivatePatient);
patientRouter.delete("/:id", deletePatient);

// Solo admin puede reactivar una cuenta
patientRouter.patch("/:id/activate", activatePatient);

export default patientRouter;