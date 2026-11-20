"use client";

import Icon from "@/components/Icon";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

/**
 * Add/remove/reorder editor for the heading + body sections that make up a
 * programme page or a legal page. `bodyKey` differs between the two models
 * ("body" vs "text"), so it is passed in rather than hardcoded.
 */
export default function SectionsEditor({
  sections,
  onChange,
  bodyKey = "body",
  bodyLabel = "Body",
  addLabel = "Add section",
}) {
  function update(index, key, value) {
    onChange(
      sections.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    );
  }

  function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index) {
    onChange(sections.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div
          key={index}
          className="rounded-xl border border-line bg-surface p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Section {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move section up"
                className="rounded-lg border border-line px-2 py-1 text-xs text-ink-soft disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
                aria-label="Move section down"
                className="rounded-lg border border-line px-2 py-1 text-xs text-ink-soft disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-lg border border-line px-2 py-1 text-xs font-semibold text-terracotta-dark hover:bg-terracotta-light"
              >
                Remove
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Heading"
            className={fieldClass}
            value={section.heading || ""}
            onChange={(e) => update(index, "heading", e.target.value)}
          />
          <textarea
            rows={6}
            placeholder={bodyLabel}
            className={`${fieldClass} mt-3`}
            value={section[bodyKey] || ""}
            onChange={(e) => update(index, bodyKey, e.target.value)}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...sections, { heading: "", [bodyKey]: "" }])}
        className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-ink"
      >
        <Icon name="Plus" className="size-4" />
        {addLabel}
      </button>
    </div>
  );
}
