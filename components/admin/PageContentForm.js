"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FIELD_LABELS, LONG_FIELDS } from "@/lib/content/pageBlockMeta";
import ImageField from "./ImageField";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint";

/**
 * Edits one page's copy blocks. Saving writes the whole blocks array; a
 * field left blank falls back to the project's seed wording at render time
 * rather than rendering empty, so clearing a heading is a reset, not a hole.
 */
export default function PageContentForm({ page, meta, initial }) {
  const router = useRouter();

  const [blocks, setBlocks] = useState(() => {
    const stored = initial?.blocks || [];
    const state = {};
    for (const block of meta) {
      const match = stored.find((b) => b.key === block.key) || {};
      state[block.key] = Object.fromEntries(
        block.fields.map((f) => [f, match[f] ?? ""])
      );
    }
    return state;
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function set(blockKey, field, value) {
    setBlocks((b) => ({
      ...b,
      [blockKey]: { ...b[blockKey], [field]: value },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const payload = {
      blocks: Object.entries(blocks).map(([key, fields]) => ({ key, ...fields })),
    };

    const res = await fetch(`/api/admin/page-content/${page}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save this page's copy.");
      setStatus("idle");
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {meta.map((block) => (
        <section
          key={block.key}
          className="rounded-2xl border border-line bg-surface p-6"
        >
          <h2 className="font-display text-lg font-medium text-ink">
            {block.label}
          </h2>
          {block.hint && (
            <p className="mt-1 text-sm text-ink-soft">{block.hint}</p>
          )}
          <div className="mt-5 space-y-4">
            {block.fields.map((field) => {
              const value = blocks[block.key]?.[field] ?? "";
              if (field === "image") {
                return (
                  <ImageField
                    key={field}
                    value={value}
                    onChange={(v) => set(block.key, field, v)}
                    label={FIELD_LABELS[field]}
                  />
                );
              }
              return (
                <div key={field}>
                  <label className={labelClass}>{FIELD_LABELS[field]}</label>
                  {LONG_FIELDS.has(field) ? (
                    <textarea
                      rows={field === "body" ? 8 : 3}
                      className={fieldClass}
                      value={value}
                      onChange={(e) => set(block.key, field, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className={fieldClass}
                      value={value}
                      onChange={(e) => set(block.key, field, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {error && <p className="text-sm font-medium text-terracotta-dark">{error}</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-full border border-line bg-paper/95 px-4 py-3 shadow-lift backdrop-blur">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save Page Copy"}
        </button>
        {status === "saved" && (
          <span className="text-sm font-medium text-forest">
            Saved — the public page is updated.
          </span>
        )}
      </div>
    </form>
  );
}
