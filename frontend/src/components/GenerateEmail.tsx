/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/GenerateEmail.tsx
import React, { useState } from "react";
import axios from "axios";

interface GenerateEmailProps {
  token: string;
  generatedEmail: string;
  setGeneratedEmail: (email: string) => void;
  conversationId: string | null;
  setConversationId: (id: string) => void;
  onEmailGenerated: (email: string) => void;
}

const GenerateEmail: React.FC<GenerateEmailProps> = ({
  token,
  generatedEmail,
  setGeneratedEmail,
  conversationId,
  setConversationId,
  onEmailGenerated
}) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "/generate",
        {
          prompt,
          conversationId, // send conversationId if present
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      setGeneratedEmail(data.email);
      setConversationId(data.conversationId);
      onEmailGenerated(data.email);
    } catch (err: any) {
      console.error("Error generating email:", err);
      setError(err.response?.data?.message || "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-email">
      <h2>Generate Email</h2>
      <textarea
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        style={{ width: "100%", marginBottom: "10px" }}
        disabled={loading} // disable input while loading
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {generatedEmail && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Email</h3>
          <textarea
            value={generatedEmail}
            readOnly
            rows={10}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default GenerateEmail;
