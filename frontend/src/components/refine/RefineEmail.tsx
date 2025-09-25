/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RefineEmail.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface RefineEmailProps {
  token: string;
  conversationId: string | null;
  setConversationId: (id: string) => void;
  refinedEmail: string;
  setRefinedEmail: (email: string) => void;
  lastGeneratedEmail: string;
  fetchHistory: (convId: string) => void;
  originalEmail?: string;
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEmail(lastGeneratedEmail);
    setRefinedEmail(""); // clear previous refined email
  }, [lastGeneratedEmail, setRefinedEmail]);

  const handleRefine = async () => {
    if (!email.trim() || !instructions.trim()) {
      setErrorMsg("Please provide both the email and refinement instructions.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.post(
        `${API_BASE}/refine`,
        { originalEmail: email, instructions, conversationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      setRefinedEmail(data.refinedEmail);
      setConversationId(data.conversationId);
      fetchHistory(data.conversationId);
    } catch (err: any) {
      console.error("Error refining email:", err);
      setErrorMsg(err.response?.data?.message || "Failed to refine email");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(refinedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    setInstructions("");
    setRefinedEmail("");
    setCopied(false);
    setErrorMsg(null);
  };

  return (
    <div className="re-wrap">
      <div className="re-card">
        <div className="re-card-header">
          <h2 className="re-title">Refine Email</h2>
          {conversationId && (
            <div className="re-badge">{conversationId}</div>
          )}
        </div>

        <div className="re-field">
          <label className="re-label">Original Email</label>
          <textarea
            className="re-textarea"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rows={6}
            disabled={loading}
          />
        </div>

        <div className="re-field">
          <label className="re-label">Refinement Instructions</label>
          <input
            className="re-input"
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g., Make the tone more formal"
            disabled={loading}
          />
        </div>

        {errorMsg && <div className="re-alert re-alert-error">{errorMsg}</div>}

        <div className="re-actions">
          <button
            className="re-btn re-btn-primary"
            onClick={handleRefine}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="re-spinner" /> Refining…
              </>
            ) : (
              "Refine"
            )}
          </button>

          <button
            className="re-btn re-btn-ghost"
            onClick={handleClear}
            disabled={loading || (!instructions && !refinedEmail)}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="re-card">
        <div className="re-card-header">
          <h3 className="re-title-sm">Refined Email</h3>
          <div className="re-actions">
            <button
              className="re-btn re-btn-outline"
              onClick={copyToClipboard}
              disabled={!refinedEmail}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className={`re-output ${refinedEmail ? "" : "re-output-empty"}`}>
          {refinedEmail ? (
            <pre className="re-pre">{refinedEmail}</pre>
          ) : (
            <p className="re-placeholder">
              Your refined email will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefineEmail;
