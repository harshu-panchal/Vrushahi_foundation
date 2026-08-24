"use client";

import { useEffect, useRef, useState } from "react";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

export default function DonorPicker({ value, onChange }) {
  const [query, setQuery] = useState(value?.donorName || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const selected = value?.donorId;
  const debounceRef = useRef(null);

  useEffect(() => {
    if (selected || query.trim().length < 2) {
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(
        `/api/admin/donors?q=${encodeURIComponent(query)}&limit=6`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.donors);
        setOpen(true);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query, selected]);

  function pickDonor(donor) {
    setQuery(donor.name);
    setOpen(false);
    onChange({
      donorId: donor._id,
      donorName: donor.name,
      donorEmail: donor.email || "",
      donorPhone: donor.phone || "",
      donorCity: donor.city || "",
    });
  }

  function clearSelection() {
    setQuery("");
    onChange({
      donorId: undefined,
      donorName: "",
      donorEmail: "",
      donorPhone: "",
      donorCity: "",
    });
  }

  if (selected) {
    return (
      <div className="rounded-lg border border-line bg-surface p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">{value.donorName}</p>
            <p className="text-xs text-ink-faint">
              {[value.donorEmail, value.donorPhone].filter(Boolean).join(" · ") ||
                "No contact details"}
            </p>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs font-semibold text-terracotta-dark"
          >
            Change donor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Donor name
        </label>
        <input
          type="text"
          required
          className={fieldClass}
          placeholder="Search existing donors or type a new name"
          value={query}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            onChange({ ...value, donorId: undefined, donorName: next });
            if (next.trim().length < 2) {
              setResults([]);
              setOpen(false);
            }
          }}
          onFocus={() => results.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {open && results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-line bg-paper shadow-lift">
            {results.map((donor) => (
              <button
                type="button"
                key={donor._id}
                onMouseDown={() => pickDonor(donor)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-surface"
              >
                <span className="font-medium text-ink">{donor.name}</span>{" "}
                <span className="text-xs text-ink-faint">
                  {[donor.email, donor.phone].filter(Boolean).join(" · ")}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="email"
          placeholder="Email (optional)"
          className={fieldClass}
          value={value?.donorEmail || ""}
          onChange={(e) => onChange({ ...value, donorEmail: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          className={fieldClass}
          value={value?.donorPhone || ""}
          onChange={(e) => onChange({ ...value, donorPhone: e.target.value })}
        />
        <input
          type="text"
          placeholder="City (optional)"
          className={fieldClass}
          value={value?.donorCity || ""}
          onChange={(e) => onChange({ ...value, donorCity: e.target.value })}
        />
      </div>
    </div>
  );
}
