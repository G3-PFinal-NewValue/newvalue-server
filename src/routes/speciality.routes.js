import { Router } from "express";
import {
  getAllSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
} from "../controllers/specialtyController.js";

const router = Router();

router.get("/", getAllSpecialties);
router.post("/", createSpecialty);
router.put("/:id", updateSpecialty);
router.delete("/:id", deleteSpecialty);

export default router;