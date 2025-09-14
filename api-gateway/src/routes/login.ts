import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Mock login route (for testing only)
router.post("/", (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // Normally you'd verify user credentials from DB here
  const token = jwt.sign({ id: username }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

export default router;
