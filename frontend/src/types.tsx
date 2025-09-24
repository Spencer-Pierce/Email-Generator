// Types shared across frontend
export interface HistoryEntry {
  _id?: string;
  userId: string;
  conversationId: string;
  type: "generate" | "refine";
  input: Record<string, unknown>;
  prompt: string;
  response: string;
  createdAt: string;
  updatedAt: string;
}

export interface LLMResponse {
  email: string;
  conversationId: string;
}
