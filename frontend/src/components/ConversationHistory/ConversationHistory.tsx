import React from "react";
import type { HistoryEntry } from "../../types";
import "./ConversationHistory.css";

interface Props {
  history: HistoryEntry[];
  conversationId?: string; // optional prop for conversation ID
}

const ConversationHistory: React.FC<Props> = ({ history }) => {
  if (!history.length) {
    return <div className="history-empty">No conversation history yet.</div>;
  }

  // Sort newest → oldest
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="history-container">
      <h2 className="history-title">Conversation History</h2>
      {sortedHistory.map((entry, i) => (
        <div key={i} className="history-card">
          {/* Badge */}
          <span
            className={`history-badge ${
              entry.type === "generate" ? "badge-generate" : "badge-refine"
            }`}
          >
            {entry.type === "generate" ? "Generated Email" : "Refined Email"}
          </span>

          <p className="history-timestamp">
            {new Date(entry.createdAt).toLocaleString()}
          </p>
          <div className="history-section">
            <strong>Prompt:</strong>
            <p>{entry.prompt}</p>
          </div>
          <div className="history-section">
            <strong>Result:</strong>
            <pre>{entry.response}</pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationHistory;
