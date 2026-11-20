"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICON_NAMES } from "@/components/Icon";
import { slugify } from "@/lib/utils/slugify";
import ImageField from "./ImageField";
import SectionsEditor from "./SectionsEditor";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint";

export default function ProgramForm({ programId, initial }) {
  const router = useRouter();
  const isEdit = Boolean(programId);

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [short, setShort] = useState(initial?.short || "");
  const [icon, setIcon] = useState(initial?.icon || "Heart");
  const [statValue, setStatValue] = useState(initial?.statValue || "");
  const [statLabel, setStatLabel] = useState(initial?.statLabel || "");
  const [image, setImage] = useState(initial?.image || "");
  const [imageAlt, setImageAlt] = useState(initial?.imageAlt || "");
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
      isEdit ? `/api/admin/programs/${programId}` : "/api/admin/programs",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          short,
          icon,
          statValue,
          statLabel,
          image,
          imageAlt,
          // Drop half-filled rows — the API requires both fields on a section.
          sections: sections.filter((s) => s.heading?.trim() && s.body?.trim()),
          order,
          isActive,
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save this programme.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/programs");
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
          <label className={labelClass}>Icon</label>
          <select
            className={fieldClass}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          >
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
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
          Public page: /programs/{slug || "…"} — changing this breaks existing
          links and the programme recorded on past donations.
        </p>
      </div>

      <div>
        <label className={labelClass}>Short description</label>
        <textarea
          rows={3}
          className={fieldClass}
          placeholder="One or two lines, shown on the programme cards."
          value={short}
          onChange={(e) => setShort(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
        <div>
          <label className={labelClass}>Stat number</label>
          <input
            type="text"
            className={fieldClass}
            placeholder="300"
            value={statValue}
            onChange={(e) => setStatValue(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Stat caption</label>
          <input
            type="text"
            className={fieldClass}
            placeholder="children supported at our partner children's home"
            value={statLabel}
            onChange={(e) => setStatLabel(e.target.value)}
          />
        </div>
      </div>

      <ImageField value={image} onChange={setImage} label="Programme image" />

      <div>
        <label className={labelClass}>Image alt text</label>
        <input
          type="text"
          className={fieldClass}
          placeholder="Describe the photo for screen readers"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
        />
      </div>

      <div>
        <p className={labelClass}>Page sections</p>
        <p className="mb-3 text-xs text-ink-faint">
          The headed paragraphs on the programme&apos;s own page.
        </p>
        <SectionsEditor sections={sections} onChange={setSections} />
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
          <p className="mt-1 text-xs text-ink-faint">Lower numbers appear first.</p>
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="size-4 rounded border-line"
          />
          Visible on the public site
        </label>
      </div>

      {error && <p className="text-sm font-medium text-terracotta-dark">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Programme"}
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
