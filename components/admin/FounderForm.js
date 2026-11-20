"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "./ImageField";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint";

export default function FounderForm({ initial }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name || "",
    role: initial?.role || "",
    initials: initial?.initials || "",
    photoUrl: initial?.photoUrl || "",
    bio: initial?.bio || "",
    note: initial?.note || "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const res = await fetch("/api/admin/founder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save the founder profile.");
      setStatus("idle");
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            className={fieldClass}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input
            type="text"
            className={fieldClass}
            placeholder="Founder & Managing Trustee"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
          />
        </div>
      </div>

      <ImageField
        value={form.photoUrl}
        onChange={(v) => set("photoUrl", v)}
        label="Photograph"
      />

      <div>
        <label className={labelClass}>Initials</label>
        <input
          type="text"
          maxLength={4}
          className={`${fieldClass} max-w-24`}
          value={form.initials}
          onChange={(e) => set("initials", e.target.value)}
        />
        <p className="mt-1 text-xs text-ink-faint">
          Shown in the avatar circle when there is no photograph.
        </p>
      </div>

      <div>
        <label className={labelClass}>Biography</label>
        <textarea
          rows={10}
          className={fieldClass}
          placeholder="Separate paragraphs with a blank line."
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Placeholder note</label>
        <textarea
          rows={3}
          className={fieldClass}
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
        />
        <p className="mt-1 text-xs text-ink-faint">
          The dashed box at the bottom of the page. Clear this field to remove
          the box entirely.
        </p>
      </div>

      {error && <p className="text-sm font-medium text-terracotta-dark">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save Profile"}
        </button>
        {status === "saved" && (
          <span className="text-sm font-medium text-forest">Saved.</span>
        )}
      </div>
    </form>
  );
}
