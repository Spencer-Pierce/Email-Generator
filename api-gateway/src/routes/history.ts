// src/routes/history.ts
import { Router } from "express";
import HistoryController from "../controllers/historyController";
import MongoService from "../services/mongoService";
import authMiddleware from "../middleware/authMiddleware";

export default function historyRoutes(mongoService: MongoService) {
  const router = Router();
  const historyController = new HistoryController(mongoService);

  router.get("/", authMiddleware, historyController.getHistory.bind(historyController));
  router.post("/", authMiddleware, historyController.addHistory.bind(historyController));
  router.put("/:id", authMiddleware, historyController.updateHistory.bind(historyController));
  router.delete("/:id", authMiddleware, historyController.deleteHistory.bind(historyController));

  return router;
}
