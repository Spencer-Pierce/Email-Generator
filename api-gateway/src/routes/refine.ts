// src/routes/refine.ts
import { Router } from "express";
import RefineController from "../controllers/refineController";
import MongoService from "../services/mongoService";
import authMiddleware from "../middleware/authMiddleware";

// ✅ export a function that takes mongoService
export default function refineRoutes(mongoService: MongoService) {
  const router = Router();
  const refineController = new RefineController(mongoService);

  router.post("/", authMiddleware, refineController.refineEmail.bind(refineController));

  return router;
}
