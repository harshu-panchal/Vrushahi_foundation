"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { programs } from "@/data/programs";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AllocateDonationForm({ donationId, initial }) {
  const router = useRouter();

  const [program, setProgram] = useState(initial?.program || "general");
  const [date, setDate] = useState(
    initial?.date ? initial.date.slice(0, 10) : todayISO()
  );
  const [note, setNote] = useState(initial?.note || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/admin/donations/${donationId}/allocate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program, date, note }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save this allocation.");
      setSubmitting(false);
      return;
    }

    router.push(`/admin/donations/${donationId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Purpose / programme
          </label>
          <select
            className={fieldClass}
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          >
            <option value="general">General / unrestricted</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Allocation date
          </label>
          <input
            type="date"
            required
            className={fieldClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Note
        </label>
        <textarea
          rows={3}
          className={fieldClass}
          placeholder="Where and how this amount was used"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-terracotta-dark">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save Allocation"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink-soft"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
