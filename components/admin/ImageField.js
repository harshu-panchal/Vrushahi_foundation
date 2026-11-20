"use client";

import { useEffect, useRef, useState } from "react";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

/**
 * Image input with an optional Cloudinary upload.
 *
 * The stored value is always a plain URL string, so the existing
 * `/images/...` paths committed to the repo keep working untouched and an
 * upload simply replaces the value with a Cloudinary URL. If Cloudinary
 * credentials are missing the upload button is hidden and the field stays a
 * usable URL box rather than showing a broken control.
 */
export default function ImageField({ value, onChange, label = "Image" }) {
  const [uploadable, setUploadable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/uploads")
      .then((res) => (res.ok ? res.json() : { configured: false }))
      .then((data) => {
        if (active) setUploadable(Boolean(data.configured));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  async function handleFile(file) {
    if (!file) return;
    setBusy(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/uploads", { method: "POST", body });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Upload failed.");
      return;
    }
    onChange(json.url);
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </label>
      <div className="flex items-start gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered URL, not a build-time known host
          <img
            src={value}
            alt=""
            className="size-16 shrink-0 rounded-lg border border-line object-cover"
          />
        ) : (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-line text-[10px] text-ink-faint">
            No image
          </span>
        )}
        <div className="min-w-0 flex-1">
          <input
            type="text"
            className={fieldClass}
            placeholder="/images/example.jpg or https://…"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {uploadable && (
            <div className="mt-2 flex items-center gap-3">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink disabled:opacity-60"
              >
                {busy ? "Uploading…" : "Upload image"}
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="text-xs font-semibold text-ink-faint hover:text-terracotta"
                >
                  Clear
                </button>
              )}
            </div>
          )}
          {error && (
            <p className="mt-2 text-xs font-medium text-terracotta-dark">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
