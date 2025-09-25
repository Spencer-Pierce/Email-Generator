// src/types/index.ts
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthenticatedRequest<
  TBody = any,
  TParams = any,
  TQuery = any
> extends Request<TParams, any, TBody, TQuery> {
  user?: JwtPayload & { id: string };
}

export interface GenerateRequest {
    prompt: string;
    options?: Record<string, any>;
}

export interface GenerateResponse {
    id: string;
    result: string;
}

export interface RefineRequest {
    id: string;
    modifications: Record<string, any>;
}

export interface RefineResponse {
    id: string;
    result: string;
}

export interface HistoryResponse {
    id: string;
    prompt: string;
    result: string;
    timestamp: Date;
}

export interface HistoryRecord {
  _id?: string; // optional because Mongo will generate this
  type: "generate" | "refine";
  userId: string;
  input: Record<string, any>; // flexible to allow different inputs
  prompt: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HistoryEntry {
  _id?: string;
  userId: string;
  conversationId: string;
  type?: "generate" | "refine";
  input?: { prompt?: string; originalEmail?: string; instructions?: string };
  prompt?: string;
  response?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
