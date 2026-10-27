"use client";

import { useState } from "react";
import { generateApiTokenAction } from "@/app/actions/users";

export function ApiTokenManager({
  initialToken,
}: {
  initialToken: string | null;
}) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateToken = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/token", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
      } else {
        const actionRes = await generateApiTokenAction();
        if (actionRes.success && actionRes.token) {
          setToken(actionRes.token);
        }
      }
    } catch {
      const actionRes = await generateApiTokenAction();
      if (actionRes.success && actionRes.token) {
        setToken(actionRes.token);
      }
    } finally {
      setLoading(false);
      setCopied(false);
    }
  };

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      data-testid="api-token-section"
      className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Personal API Token</h2>
          <p className="text-sm text-slate-500 mt-1">
            Use this token to authenticate REST API requests via the{" "}
            <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">
              Authorization: Bearer &lt;token&gt;
            </code>{" "}
            header.
          </p>
        </div>
        <button
          type="button"
          data-testid="generate-token-button"
          onClick={handleGenerateToken}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md transition disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : token
            ? "Regenerate Token"
            : "Generate API Token"}
        </button>
      </div>

      {!token ? (
        <div
          data-testid="no-token-message"
          className="p-4 bg-slate-50 rounded-md border border-dashed border-slate-300 text-slate-600 text-sm"
        >
          No API token generated yet. Click the button above to create one.
        </div>
      ) : (
        <div data-testid="token-display" className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-md text-emerald-400 font-mono text-xs overflow-x-auto">
            <code data-testid="api-token" className="break-all">
              {token}
            </code>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Keep this token private. Anyone with this token can manage your blogs.</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-indigo-600 hover:underline font-medium"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
