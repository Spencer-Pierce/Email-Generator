import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import GenerateEmail from "./components/generate/GenerateEmail";
import RefineEmail from "./components/refine/RefineEmail";
import ConversationHistory from "./components/ConversationHistory/ConversationHistory";
import type { HistoryEntry } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [generatedEmail, setGeneratedEmail] = useState("");
  const [refinedEmail, setRefinedEmail] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastEmail, setLastEmail] = useState("");

  const fetchHistory = async (convId: string | null) => {
    if (!token) return;

    try {
      const url = convId
        ? `${API_BASE}/history?conversationId=${convId}`
        : `${API_BASE}/history`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        return;
      }

      const data: HistoryEntry[] = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchHistory(conversationId);
    }
  }, [conversationId, token]);

  useEffect(() => {
    if (token) {
      fetchHistory(conversationId);
    }
  }, [token]);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login setToken={setToken} />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route
          path="generate"
          element={
            <GenerateEmail
              token={token}
              generatedEmail={generatedEmail}
              setGeneratedEmail={setGeneratedEmail}
              conversationId={conversationId}
              setConversationId={setConversationId}
              onEmailGenerated={(email) => setLastEmail(email)}
            />
          }
        />
        <Route
          path="refine"
          element={
            <RefineEmail
              token={token}
              conversationId={conversationId}
              refinedEmail={refinedEmail}
              setRefinedEmail={setRefinedEmail}
              fetchHistory={fetchHistory}
              lastGeneratedEmail={generatedEmail}
              originalEmail={lastEmail}
              setConversationId={setConversationId}
            />
          }
        />
        <Route
          path="history"
          element={
            <ConversationHistory
              history={history}
              conversationId={conversationId ?? undefined}
            />
          }
        />
        <Route path="*" element={<Navigate to="generate" />} />
      </Route>
    </Routes>
  );
}

export default App;
