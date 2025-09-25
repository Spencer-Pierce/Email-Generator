// src/app.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors"; // ✅ import cors
import MongoService from "./services/mongoService";
import historyRoutes from "./routes/history";
import generateRoutes from "./routes/generate";
import refineRoutes from "./routes/refine";
import loginRoutes from "./routes/login";

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

// ✅ Single MongoService instance for the whole app
const DB_NAME = process.env.DB_NAME || "emailgen";
const mongoService = new MongoService(MONGO_URI, DB_NAME);

// ✅ Enable CORS for frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000", // nginx frontend in Docker
      "http://localhost:5173", // vite dev server (optional)
    ],
    credentials: true,
  })
);

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
