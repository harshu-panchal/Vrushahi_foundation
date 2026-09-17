"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint";

export default function TrusteeForm({ trusteeId, initial }) {
  const router = useRouter();
  const isEdit = Boolean(trusteeId);

  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [designation, setDesignation] = useState(initial?.designation || "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl || "");
  const [bio, setBio] = useState(initial?.bio || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(value) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      name,
      slug,
      designation,
      photoUrl,
      bio,
      email,
      phone,
      order,
      isActive,
    };

    const res = await fetch(
      isEdit ? `/api/admin/trustees/${trusteeId}` : "/api/admin/trustees",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save this trustee.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/trustees");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            required
            className={fieldClass}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Designation</label>
          <input
            type="text"
            required
            placeholder="Chairperson, Secretary, Trustee…"
            className={fieldClass}
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
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
          Public page: /about/trustees/{slug || "…"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Photo URL</label>
          <input
            type="text"
            placeholder="/images/trustee-name.jpg"
            className={fieldClass}
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
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
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea
          rows={8}
          placeholder="Shown on the trustee's detail page. Separate paragraphs with a blank line."
          className={fieldClass}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="size-4 rounded border-line"
        />
        Visible on the public Trustees page
      </label>

      {error && (
        <p className="text-sm font-medium text-terracotta-dark">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Trustee"}
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
