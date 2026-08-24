"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DonorPicker from "./DonorPicker";
import { programs } from "@/data/programs";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

const MODES = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function DonationForm({ donationId, initial }) {
  const router = useRouter();
  const isEdit = Boolean(donationId);

  const [donor, setDonor] = useState({
    donorId: initial?.donor?._id,
    donorName: initial?.donor?.name || "",
    donorEmail: initial?.donor?.email || "",
    donorPhone: initial?.donor?.phone || "",
    donorCity: initial?.donor?.city || "",
  });
  const [amount, setAmount] = useState(initial?.amount || "");
  const [mode, setMode] = useState(initial?.mode || "cash");
  const [program, setProgram] = useState(initial?.program || "general");
  const [date, setDate] = useState(
    initial?.date ? initial.date.slice(0, 10) : todayISO()
  );
  const [referenceNote, setReferenceNote] = useState(
    initial?.referenceNote || ""
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...donor,
      amount,
      mode,
      program,
      date,
      referenceNote,
    };

    const res = await fetch(
      isEdit ? `/api/admin/donations/${donationId}` : "/api/admin/donations",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save this donation.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/donations");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Donor
        </label>
        <DonorPicker value={donor} onChange={setDonor} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Amount (₹)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            required
            className={fieldClass}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Mode
          </label>
          <select
            className={fieldClass}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Date
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Programme
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
            Reference / note
          </label>
          <input
            type="text"
            placeholder="Cheque no., transaction ID, etc."
            className={fieldClass}
            value={referenceNote}
            onChange={(e) => setReferenceNote(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-terracotta-dark">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Record Donation"}
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
