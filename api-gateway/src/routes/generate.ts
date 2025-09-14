// src/routes/generate.ts
import { Router } from "express";
import GenerateController from "../controllers/generateController";
import MongoService from "../services/mongoService";
import authMiddleware from "../middleware/authMiddleware";

// ✅ export a function that takes mongoService
export default function generateRoutes(mongoService: MongoService) {
  const router = Router();
  const generateController = new GenerateController(mongoService);

  router.post("/", authMiddleware, generateController.generateEmail.bind(generateController));

  return router;
}
