import express from "express";
import { createTransfer, getTransfers } from "../controllers/transferController.js";

const router = express.Router();

router.get("/", getTransfers);   // GET all transfers
router.post("/", createTransfer); // Add a new transfer

export default router;
