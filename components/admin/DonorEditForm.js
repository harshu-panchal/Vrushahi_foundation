"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none";

export default function DonorEditForm({ donorId, initial }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: initial.name || "",
    email: initial.email || "",
    phone: initial.phone || "",
    city: initial.city || "",
    notes: initial.notes || "",
  });
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/admin/donors/${donorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSubmitting(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        className={fieldClass}
        placeholder="Name"
        value={values.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="email"
          className={fieldClass}
          placeholder="Email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <input
          type="tel"
          className={fieldClass}
          placeholder="Phone"
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>
      <input
        type="text"
        className={fieldClass}
        placeholder="City"
        value={values.city}
        onChange={(e) => update("city", e.target.value)}
      />
      <textarea
        rows={3}
        className={fieldClass}
        placeholder="Notes"
        value={values.notes}
        onChange={(e) => update("notes", e.target.value)}
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-paper disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-xs text-forest">Saved.</span>}
      </div>
    </form>
  );
}
