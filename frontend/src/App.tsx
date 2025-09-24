// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import GenerateEmail from "./components/GenerateEmail";
import RefineEmail from "./components/RefineEmail";
import ConversationHistory from "./components/ConversationHistory";
import type { HistoryEntry } from "./types";

function App() {
  const [token, setToken] = useState<string | null>(() => {
    // 🔑 Load token from localStorage on initial load
    return localStorage.getItem("token");
  });

  const [generatedEmail, setGeneratedEmail] = useState("");
  const [refinedEmail, setRefinedEmail] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastEmail, setLastEmail] = useState("");

  const fetchHistory = async (convId: string) => {
    if (!token || !convId) return;

    try {
      const res = await fetch(
        convId ? `/history?conversationId=${convId}` : "/history",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        // 🔑 Token invalid/expired → clear + go back to login
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

  // 🔑 Fetch history whenever a new conversation starts
  useEffect(() => {
    if (conversationId) {
      fetchHistory(conversationId);
    }
  }, [conversationId, token]);

  // 🔑 Fetch all history at login (before any conversationId exists)
  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  // If no token → always render Login
  if (!token) {
    console.log("No token, rendering Login");
    return <Login setToken={setToken} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />}></Route>
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
    </Router>
  );
}

export default App;
