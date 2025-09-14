// src/controllers/generateController.ts
import { Response } from "express";
import axios from "axios";
import MongoService from "../services/mongoService";
import { AuthenticatedRequest, HistoryEntry } from "../types";
import { v4 as uuidv4 } from "uuid";

class GenerateController {
  private mongoService: MongoService;
  private llmServiceUrl: string;

  constructor(mongoService: MongoService, llmServiceUrl = "http://localhost:5000/generate") {
    this.mongoService = mongoService;
    this.llmServiceUrl = llmServiceUrl;
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

      // Step 1: Determine conversationId
      let convId = conversationId;
      if (!convId) {
        convId = uuidv4(); // start a new conversation if not provided
      }

      // Step 2: Retrieve last N messages for this user and conversation
      const historyEntries = await this.mongoService.findDocuments<HistoryEntry>(
        "history",
        { userId, conversationId: convId }
      );

      const recentHistory = historyEntries
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(-5); // last 5 messages

      // Step 3: Build a chained prompt
      let fullPrompt = "";
      for (const entry of recentHistory) {
        fullPrompt += `User: ${entry.input.prompt || entry.input.originalEmail}\nAI: ${entry.response}\n`;
      }
      fullPrompt += `User: ${prompt}\nAI:`;

      // Step 4: Call Python LLM microservice
      const response = await axios.post(this.llmServiceUrl, { prompt: fullPrompt });
      const generatedEmail = response.data.email;

      // Step 5: Save new entry to MongoDB
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

      // Step 6: Return generated email + conversationId to frontend
      res.status(200).json({ email: generatedEmail, conversationId: convId });
    } catch (error) {
      console.error("Error generating email:", error);
      res.status(500).json({ message: "Failed to generate email", error });
    }
  }
}

export default GenerateController;
