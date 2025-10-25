import { Router } from "express";
import {
  getAllSpecialties,
  createSpeciality,
  updateSpeciality,
  deleteSpeciality
} from "../controllers/specialityController.js";

const router = Router();

router.get("/", getAllSpecialties);
router.post("/", createSpeciality);
router.put("/:id", updateSpeciality);
router.delete("/:id", deleteSpeciality);

export default router;