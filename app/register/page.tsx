"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useNotification } from "../components/Notification";

export default function RegisterPage() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    setPasswordConfirmError(null);
    setGeneralError(null);

    // Client-side validations
    if (username.length < 4) {
      setUsernameError("Username must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordConfirmError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/testing/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error?.includes("already exists")) {
          setUsernameError("Username is already taken");
        } else {
          setGeneralError(errorData.error || "Registration failed");
        }
        setLoading(false);
        return;
      }

      showNotification("Registration successful! Please log in.", "success");
      router.push("/login");
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-xl shadow-md border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">
        Register
      </h1>

      {generalError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (usernameError) setUsernameError(null);
            }}
            required
            className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {usernameError && (
            <p
              data-testid="username-error"
              className="mt-1 text-xs text-red-600 font-medium"
            >
              {usernameError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordConfirmError) setPasswordConfirmError(null);
            }}
            required
            className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (passwordConfirmError) setPasswordConfirmError(null);
            }}
            required
            className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordConfirmError && (
            <p
              data-testid="passwordConfirm-error"
              className="mt-1 text-xs text-red-600 font-medium"
            >
              {passwordConfirmError}
            </p>
          )}
        </div>

        <button
          type="submit"
          data-testid="register-button"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          login
        </Link>
      </p>
    </div>
  );
}
