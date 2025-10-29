import express from "express";
import { exportStats } from "../controllers/exportstats.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js"

const router = express.Router();

router.get("/export-stats", authMiddleware, exportStats);



export default router;