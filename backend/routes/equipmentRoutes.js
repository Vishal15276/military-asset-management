import express from "express";
import { createEquipment, getEquipment } from "../controllers/equipmentController.js";

const router = express.Router();

// GET all equipment
router.get("/", getEquipment);

// POST add new equipment
router.post("/", createEquipment);

export default router;
