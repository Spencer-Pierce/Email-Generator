/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/RefineEmail.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface RefineEmailProps {
  token: string;
  conversationId: string | null;
  setConversationId: (id: string) => void;
  refinedEmail: string;
  setRefinedEmail: (email: string) => void;
  lastGeneratedEmail: string;
  fetchHistory: (convId: string) => void; // push history update to App
}

const RefineEmail: React.FC<RefineEmailProps> = ({
  token,
  conversationId,
  setConversationId,
  refinedEmail,
  setRefinedEmail,
  lastGeneratedEmail,
  fetchHistory,
}) => {
  const [email, setEmail] = useState(lastGeneratedEmail);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(lastGeneratedEmail);
    setRefinedEmail(""); // clear previous refined email when switching base email
  }, [lastGeneratedEmail, setRefinedEmail]);

  const handleRefine = async () => {
    if (!email || !instructions) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "/refine",
        { originalEmail: email, instructions, conversationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      setRefinedEmail(data.refinedEmail);
      setConversationId(data.conversationId);

      // refresh history in App
      fetchHistory(data.conversationId);
    } catch (err: any) {
      console.error("Error refining email:", err);
      setError(err.response?.data?.message || "Failed to refine email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="refine-email">
      <h2>Refine Email</h2>

      <label>Original Email:</label>
      <textarea
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        rows={8}
        style={{ width: "100%", marginBottom: "10px" }}
        disabled={loading}
      />

      <label>Refinement Instructions:</label>
      <input
        type="text"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Enter instructions"
        style={{ width: "100%", marginBottom: "10px" }}
        disabled={loading}
      />

      <button onClick={handleRefine} disabled={loading}>
        {loading ? "Refining..." : "Refine"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {refinedEmail && (
        <div style={{ marginTop: "20px" }}>
          <h3>Refined Email</h3>
          <textarea
            value={refinedEmail}
            readOnly
            rows={10}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default RefineEmail;
