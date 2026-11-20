"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import SectionsEditor from "./SectionsEditor";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint";

export default function LegalPageForm({ pageId, initial }) {
  const router = useRouter();
  const isEdit = Boolean(pageId);

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [updated, setUpdated] = useState(initial?.updated || "");
  const [sections, setSections] = useState(initial?.sections || []);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(value) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(
      isEdit ? `/api/admin/legal-pages/${pageId}` : "/api/admin/legal-pages",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          updated,
          sections: sections.filter((s) => s.heading?.trim() && s.text?.trim()),
          order,
          isActive,
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save this page.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/legal");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            required
            className={fieldClass}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>“Updated” label</label>
          <input
            type="text"
            className={fieldClass}
            placeholder="2026"
            value={updated}
            onChange={(e) => setUpdated(e.target.value)}
          />
          <p className="mt-1 text-xs text-ink-faint">
            Shown above the title as “Updated …”.
          </p>
        </div>
      </div>

      <div>
        <label className={labelClass}>URL slug</label>
        <input
          type="text"
          required
          className={fieldClass}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
        />
        <p className="mt-1 text-xs text-ink-faint">
          Public page: /legal/{slug || "…"} — this is linked from the footer of
          every page, so changing it breaks those links.
        </p>
      </div>

      <div>
        <p className={labelClass}>Sections</p>
        <SectionsEditor
          sections={sections}
          onChange={setSections}
          bodyKey="text"
          bodyLabel="Text"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Display order</label>
          <input
            type="number"
            className={fieldClass}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
          <p className="mt-1 text-xs text-ink-faint">
            Controls the order of the footer links.
          </p>
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="size-4 rounded border-line"
          />
          Published
        </label>
      </div>

      {error && <p className="text-sm font-medium text-terracotta-dark">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Page"}
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
