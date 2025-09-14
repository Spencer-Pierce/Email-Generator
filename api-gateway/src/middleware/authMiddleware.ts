import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { id: string };
    req.user = decoded; // ✅ attach user to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
