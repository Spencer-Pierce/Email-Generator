/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "./GenerateEmail.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Props {
  token: string;
  generatedEmail: string;
  setGeneratedEmail: (email: string) => void;
  conversationId: string | null;
  setConversationId: (id: string) => void;
  onEmailGenerated: (email: string) => void;
}

function GenerateEmail({
  token,
  generatedEmail,
  setGeneratedEmail,
  conversationId,
  setConversationId,
  onEmailGenerated,
}: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setCopied(false);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, conversationId }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to generate email");
      }

      const data = await res.json();
      setGeneratedEmail(data.email);
      onEmailGenerated(data.email);
      if (data.conversationId) setConversationId(data.conversationId);
    } catch (err: any) {
      console.error("Error generating email:", err);
      setErrorMsg(err?.message || "Something went wrong while generating.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setGeneratedEmail("");
    setCopied(false);
    setErrorMsg(null);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  return (
    <div className="ge-wrap">
      <div className="ge-card">
        <div className="ge-card-header">
          <div>
            <h2 className="ge-title">Generate Email</h2>
            <p className="ge-subtitle">
              Craft a professional email from a natural-language prompt. Your last 5
              conversation entries are used for context.
            </p>
          </div>
          {conversationId && (
            <div className="ge-badge" title="Current Conversation ID">
              {conversationId}
            </div>
          )}
        </div>

        <div className="ge-field">
          <label htmlFor="prompt" className="ge-label">
            Prompt
          </label>
          <textarea
            id="prompt"
            className="ge-textarea"
            placeholder="e.g., Write a follow-up email thanking the client for yesterday’s meeting and propose two time slots next week."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
          />
        </div>

        {errorMsg && <div className="ge-alert ge-alert-error">{errorMsg}</div>}

        <div className="ge-actions">
          <button
            className="ge-btn ge-btn-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="ge-spinner" /> Generating…
              </>
            ) : (
              "Generate"
            )}
          </button>

          <button
            className="ge-btn ge-btn-ghost"
            onClick={handleClear}
            disabled={loading || (!prompt && !generatedEmail)}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="ge-card">
        <div className="ge-card-header">
          <h3 className="ge-title-sm">Generated Email</h3>
          <div className="ge-actions">
            <button
              className="ge-btn ge-btn-outline"
              onClick={copyToClipboard}
              disabled={!generatedEmail}
              title="Copy to clipboard"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className={`ge-output ${generatedEmail ? "" : "ge-output-empty"}`}>
          {generatedEmail ? (
            <pre className="ge-pre">{generatedEmail}</pre>
          ) : (
            <p className="ge-placeholder">
              Your generated email will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateEmail;
