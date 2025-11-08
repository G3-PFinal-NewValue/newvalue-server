import express from "express";
import {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deactivatePatient,
    activatePatient,
    deletePatient,
    getMyProfile,
    updateMyProfile,
    // getPatientSessions,
    // getPatientAppointments,
    // updateTherapyData,
} from "../controllers/patient.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import ownerMiddleware from "../middleware/ownerMiddleware.js";
import multer from "multer";

const patientRouter = express.Router();

// Configuración de Multer
const upload = multer({ dest: 'uploads/' }); // carpeta temporal

// Solo admin puede ver todos los pacientes
patientRouter.get("/", authMiddleware, roleMiddleware("admin"), getAllPatients);

// Cualquier usuario puede registrarse como paciente (con foto opcional)
patientRouter.post("/", authMiddleware, upload.single('photo'), createPatient);

// Endpoints específicos del paciente
patientRouter.get("/profile", authMiddleware, getMyProfile);
patientRouter.put("/profile", authMiddleware, upload.single('photo'), updateMyProfile);

// Admin o el propio usuario pueden ver/editar/desactivar/eliminar su cuenta
patientRouter.get("/:id", authMiddleware, ownerMiddleware, getPatientById);
patientRouter.put("/:id", authMiddleware, ownerMiddleware, upload.single('photo'), updatePatient);
patientRouter.patch("/:id/deactivate", authMiddleware, ownerMiddleware, deactivatePatient);
patientRouter.delete("/:id", authMiddleware, ownerMiddleware, deletePatient);

// Solo admin puede reactivar una cuenta
patientRouter.patch("/:id/activate", authMiddleware, roleMiddleware("admin"), activatePatient);


// patientRouter.get("/:id/sessions", authMiddleware, ownershipMiddleware, getPatientSessions);
// patientRouter.get("/:id/appointments", authMiddleware, ownershipMiddleware, getPatientAppointments);
// patientRouter.patch("/:id/therapy-data", authMiddleware, ownershipMiddleware, updateTherapyData);

export default patientRouter;