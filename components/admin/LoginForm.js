"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
        setSubmitting(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          type="email"
          required
          autoFocus
          className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Password
        </label>
        <input
          type="password"
          required
          className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          value={values.password}
          onChange={(e) =>
            setValues((v) => ({ ...v, password: e.target.value }))
          }
        />
      </div>
      {error && (
        <p className="text-sm font-medium text-terracotta-dark">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-dark disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
