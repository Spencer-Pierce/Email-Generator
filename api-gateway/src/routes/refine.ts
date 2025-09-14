// src/routes/refine.ts
import { Router } from "express";
import RefineController from "../controllers/refineController";
import MongoService from "../services/mongoService";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";
const mongoService = new MongoService(mongoUri, "mydatabase");
const refineController = new RefineController(mongoService);

router.post("/", authMiddleware, (req, res) => refineController.refineEmail(req, res));

export default router;
