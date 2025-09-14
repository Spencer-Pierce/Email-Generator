// src/app.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import MongoService from "./services/mongoService";
import historyRoutes from "./routes/history";
import generateRoutes from "./routes/generate";
import refineRoutes from "./routes/refine";
import loginRoutes from "./routes/login";
import authMiddleware from "./middleware/authMiddleware";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

// ✅ Single MongoService instance for the whole app
const mongoService = new MongoService(MONGO_URI, "mydatabase");

// Connect at startup
mongoService.connect().catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

app.use(express.json());

// Public route
app.use("/login", loginRoutes);

// Protected routes (inject mongoService into route initializers)
app.use("/generate", generateRoutes(mongoService));
app.use("/refine", refineRoutes(mongoService));
app.use("/history", historyRoutes(mongoService));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
