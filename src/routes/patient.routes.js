import express from "express";
import {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deactivatePatient,
    activatePatient,
    deletePatient,
    getPatientSessions,
    getPatientAppointments,
    updateTherapyData,
} from "../controllers/patient.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import ownershipMiddleware from "../middleware/ownerMiddleware.js";

const patientRouter = express.Router();

// Solo admin puede ver todos los pacientes
patientRouter.get("/", authMiddleware, roleMiddleware("admin"), getAllPatients);

// Cualquier usuario puede registrarse como paciente
patientRouter.post("/", createPatient);

// Admin o el propio usuario pueden ver/editar/desactivar/eliminar su cuenta
patientRouter.get("/:id", authMiddleware, ownershipMiddleware, getPatientById);
patientRouter.put("/:id", authMiddleware, ownershipMiddleware, updatePatient);
patientRouter.patch("/:id/deactivate", authMiddleware, ownershipMiddleware, deactivatePatient);
patientRouter.delete("/:id", authMiddleware, ownershipMiddleware, deletePatient);

// Solo admin puede reactivar una cuenta
patientRouter.patch("/:id/activate", authMiddleware, roleMiddleware("admin"), activatePatient);

// Endpoints específicos del paciente
patientRouter.get("/:id/sessions", authMiddleware, ownershipMiddleware, getPatientSessions);
patientRouter.get("/:id/appointments", authMiddleware, ownershipMiddleware, getPatientAppointments);
patientRouter.patch("/:id/therapy-data", authMiddleware, ownershipMiddleware, updateTherapyData);

export default patientRouter;
