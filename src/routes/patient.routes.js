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


const patientRouter = express.Router();

//solo admin puede ver todos los usuarios
patientRouter.get("/", roleMiddleware("admin"), getAllPatients);

//Cualquier usuario puede registrarse y crear una cuenta
patientRouter.post("/", createPatient);

//admin o el propio usuario pueden gestionar su cuenta(ver, editar, eliminar)
patientRouter.get("/:id", getPatientById);
patientRouter.put("/:id", updatePatient);
patientRouter.patch("/:id/deactivate", deactivatePatient);
patientRouter.delete("/:id", deletePatient);

//solo admin puede reactivar una cuenta
patientRouter.patch("/:id/activate", activatePatient);

export default patientRouter;
