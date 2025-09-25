// src/controllers/historyController.ts
import { Response } from "express";
import MongoService from "../services/mongoService";
import { AuthenticatedRequest } from "../types";
import { ObjectId } from "mongodb";

class HistoryController {
  private mongoService: MongoService;

  constructor(mongoService: MongoService) {
    this.mongoService = mongoService;
  }

  public async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const history = await this.mongoService.findDocuments("history", { userId } as any);
      res.status(200).json(history);
    } catch (error) {
      console.error("Error retrieving history:", error);
      res.status(500).json({ message: "Error retrieving history", error });
    }
  }

  public async addHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const newEntry = {
        userId,
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await this.mongoService.insertDocument("history", newEntry as any);
      res.status(201).json({ message: "History added", result });
    } catch (error) {
      console.error("Error adding history:", error);
      res.status(500).json({ message: "Error adding history", error });
    }
  }

  public async updateHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      const result = await this.mongoService.updateDocument(
        "history",
        { _id: new ObjectId(id), userId } as any,
        updateData as any
      );
      res.status(200).json({ message: "History updated", result });
    } catch (error) {
      console.error("Error updating history:", error);
      res.status(500).json({ message: "Error updating history", error });
    }
  }

  public async deleteHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const result = await this.mongoService.deleteDocument(
        "history",
        { _id: new ObjectId(id), userId } as any
      );
      res.status(200).json({ message: "History deleted", result });
    } catch (error) {
      console.error("Error deleting history:", error);
      res.status(500).json({ message: "Error deleting history", error });
    }
  }

  public async createHistory(userId: string, data: any) {
    return this.mongoService.insertDocument("history", {
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
  }
}

export default HistoryController;
