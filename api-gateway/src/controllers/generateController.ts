// src/controllers/generateController.ts
import { Response } from "express";
import axios from "axios";
import MongoService from "../services/mongoService";
import { AuthenticatedRequest, HistoryEntry } from "../types";
import { v4 as uuidv4 } from "uuid";

class GenerateController {
  private mongoService: MongoService;
  private llmServiceUrl: string;

  constructor(mongoService: MongoService, llmServiceUrl?: string) {
    this.mongoService = mongoService;
    this.llmServiceUrl = llmServiceUrl || process.env.LLM_SERVICE_URL || "http://llm-service:8000";
  }

  public async generateEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { prompt, conversationId } = req.body;

      if (!prompt) {
        res.status(400).json({ message: "Prompt is required" });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      let convId = conversationId || uuidv4();

      const historyEntries = await this.mongoService.findDocuments<HistoryEntry>(
        "history",
        { userId, conversationId: convId }
      );

      const recentHistory = historyEntries
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(-5);

      let fullPrompt = "";
      for (const entry of recentHistory) {
        fullPrompt += `User: ${entry?.input?.prompt || entry?.input?.originalEmail}\nAI: ${entry.response}\n`;
      }
      fullPrompt += `User: ${prompt}\nAI:`;

      // ✅ Append /generate here
      const response = await axios.post(`${this.llmServiceUrl}/generate`, { prompt: fullPrompt });
      const generatedEmail = response.data.email;

      await this.mongoService.insertDocument("history", {
        userId,
        conversationId: convId,
        type: "generate",
        input: { prompt },
        prompt: fullPrompt,
        response: generatedEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(200).json({ email: generatedEmail, conversationId: convId });
    } catch (error) {
      console.error("Error generating email:", error);
      res.status(500).json({ message: "Failed to generate email", error });
    }
  }
}


export default GenerateController;
