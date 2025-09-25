// src/controllers/refineController.ts
import { Response } from "express";
import axios from "axios";
import MongoService from "../services/mongoService";
import { AuthenticatedRequest } from "../types";
import { v4 as uuidv4 } from "uuid";
import { HistoryEntry } from "../types";

class RefineController {
  private mongoService: MongoService;
  private llmServiceUrl: string;

  constructor(mongoService: MongoService, llmServiceUrl = "http://llm-service:8000") {
    this.mongoService = mongoService;
    this.llmServiceUrl = llmServiceUrl || process.env.LLM_SERVICE_URL || "http://llm-service:8000";
  }

  public async refineEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { originalEmail, instructions, conversationId } = req.body;

      if (!originalEmail || !instructions) {
        res.status(400).json({ message: "Both originalEmail and instructions are required." });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Step 1: Determine conversationId
      let convId = conversationId;
      if (!convId) {
        convId = uuidv4();
      }

      // Step 2: Retrieve last N messages for this user and conversation
      const historyEntries = await this.mongoService.findDocuments<HistoryEntry>(
        "history",
        { userId, conversationId: convId }
      );

      const recentHistory = historyEntries
        .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
        .slice(-5);

      // Step 3: Build a chained prompt
      let fullPrompt = "";
      for (const entry of recentHistory) {
        fullPrompt += `User: ${entry?.input?.prompt || entry?.input?.originalEmail}\nAI: ${entry.response}\n`;
      }
      fullPrompt += `User wants to refine an email with instructions: "${instructions}"\nOriginal Email:\n${originalEmail}\nAI:`;

      // Step 4: Call Python LLM microservice
      const response = await axios.post(`${this.llmServiceUrl}/generate`, { prompt: fullPrompt });
      const refinedEmail = response.data.email;

      // Step 5: Save new entry to MongoDB
      await this.mongoService.insertDocument("history", {
        userId,
        conversationId: convId,
        type: "refine",
        input: { originalEmail, instructions },
        prompt: fullPrompt,
        response: refinedEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Step 6: Return refined email + conversationId
      res.status(200).json({ refinedEmail, conversationId: convId });
    } catch (error) {
      console.error("Error refining email:", error);
      res.status(500).json({ message: "Failed to refine email", error });
    }
  }
}

export default RefineController;
