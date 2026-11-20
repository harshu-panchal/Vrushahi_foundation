"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "./ImageField";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint";

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display text-lg font-medium text-ink">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      )}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Text({ label, value, onChange, hint, ...rest }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        className={fieldClass}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

export default function SettingsForm({ initial }) {
  const router = useRouter();

  const [form, setForm] = useState(() => ({
    name: initial?.name || "",
    shortName: initial?.shortName || "",
    tagline: initial?.tagline || "",
    founded: initial?.founded ?? "",
    url: initial?.url || "",
    registration: { ...initial?.registration },
    location: { ...initial?.location },
    contact: { email: initial?.contact?.email || "" },
    bankDetails: { ...initial?.bankDetails },
    seo: { ...initial?.seo },
    logoHeaderUrl: initial?.logoHeaderUrl || "",
    logoFooterUrl: initial?.logoFooterUrl || "",
    minAmount: initial?.donation?.minAmount ?? "",
    maxAmount: initial?.donation?.maxAmount ?? "",
    presets: (initial?.donation?.presetAmounts || []).join(", "),
  }));

  // The model keeps display numbers and tel: targets as two parallel arrays;
  // editing them as pairs is the only way to keep them aligned by hand.
  const [phones, setPhones] = useState(() => {
    const display = initial?.contact?.phones || [];
    const raw = initial?.contact?.phonesRaw || [];
    const rows = Math.max(display.length, raw.length, 1);
    return Array.from({ length: rows }, (_, i) => ({
      display: display[i] || "",
      raw: raw[i] || "",
    }));
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setNested(group, key, value) {
    setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const filled = phones.filter((p) => p.display.trim() || p.raw.trim());
    const payload = {
      name: form.name,
      shortName: form.shortName,
      tagline: form.tagline,
      url: form.url,
      registration: form.registration,
      location: form.location,
      bankDetails: form.bankDetails,
      seo: form.seo,
      logoHeaderUrl: form.logoHeaderUrl,
      logoFooterUrl: form.logoFooterUrl,
      contact: {
        email: form.contact.email,
        phones: filled.map((p) => p.display.trim()),
        phonesRaw: filled.map((p) => p.raw.trim()),
      },
      donation: {
        presetAmounts: form.presets
          .split(",")
          .map((v) => Number(v.trim()))
          .filter((v) => Number.isFinite(v) && v > 0),
      },
    };
    if (form.founded !== "") payload.founded = form.founded;
    if (form.minAmount !== "") payload.donation.minAmount = form.minAmount;
    if (form.maxAmount !== "") payload.donation.maxAmount = form.maxAmount;

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save these settings.");
      setStatus("idle");
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <Card
        title="Identity"
        description="Used in the page titles, the header wordmark and the footer."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Text
            label="Organisation name"
            value={form.name}
            onChange={(v) => setField("name", v)}
          />
          <Text
            label="Short name"
            value={form.shortName}
            onChange={(v) => setField("shortName", v)}
          />
        </div>
        <Text
          label="Tagline"
          value={form.tagline}
          onChange={(v) => setField("tagline", v)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Founded year</label>
            <input
              type="number"
              className={fieldClass}
              value={form.founded}
              onChange={(e) => setField("founded", e.target.value)}
            />
          </div>
          <Text
            label="Website URL"
            value={form.url}
            onChange={(v) => setField("url", v)}
            hint="Used for canonical links, the sitemap and robots.txt."
          />
        </div>
        <ImageField
          value={form.logoHeaderUrl}
          onChange={(v) => setField("logoHeaderUrl", v)}
          label="Header logo"
        />
        <ImageField
          value={form.logoFooterUrl}
          onChange={(v) => setField("logoFooterUrl", v)}
          label="Footer / admin logo"
        />
      </Card>

      <Card
        title="Registration"
        description="Shown in the footer, on the home page and in the donate page's “legal basics”."
      >
        <Text
          label="Registered under"
          value={form.registration.act}
          onChange={(v) => setNested("registration", "act", v)}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Text
            label="Registration no."
            value={form.registration.number}
            onChange={(v) => setNested("registration", "number", v)}
          />
          <Text
            label="PAN"
            value={form.registration.pan}
            onChange={(v) => setNested("registration", "pan", v)}
          />
          <Text
            label="Incorporated"
            value={form.registration.incorporated}
            onChange={(v) => setNested("registration", "incorporated", v)}
          />
        </div>
      </Card>

      <Card title="Contact" description="Shown on /contact, /donate and in the footer.">
        <Text
          label="Email"
          value={form.contact.email}
          onChange={(v) => setNested("contact", "email", v)}
        />
        <div>
          <label className={labelClass}>Phone numbers</label>
          <div className="space-y-2">
            {phones.map((phone, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="+91 70580 30495"
                  className={fieldClass}
                  value={phone.display}
                  onChange={(e) =>
                    setPhones((list) =>
                      list.map((p, j) =>
                        j === i ? { ...p, display: e.target.value } : p
                      )
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="+919970907005"
                  className={fieldClass}
                  value={phone.raw}
                  onChange={(e) =>
                    setPhones((list) =>
                      list.map((p, j) =>
                        j === i ? { ...p, raw: e.target.value } : p
                      )
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setPhones((list) => list.filter((_, j) => j !== i))
                  }
                  className="shrink-0 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-terracotta-dark"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-ink-faint">
            Left: how the number is displayed. Right: the dialling target for
            the tap-to-call link, digits and “+” only.
          </p>
          <button
            type="button"
            onClick={() => setPhones((list) => [...list, { display: "", raw: "" }])}
            className="mt-2 rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink"
          >
            Add number
          </button>
        </div>
        <Text
          label="Address line"
          value={form.location.line}
          onChange={(v) => setNested("location", "line", v)}
        />
        <div className="grid gap-4 sm:grid-cols-4">
          <Text
            label="City"
            value={form.location.city}
            onChange={(v) => setNested("location", "city", v)}
          />
          <Text
            label="Taluka"
            value={form.location.taluka}
            onChange={(v) => setNested("location", "taluka", v)}
          />
          <Text
            label="District"
            value={form.location.district}
            onChange={(v) => setNested("location", "district", v)}
          />
          <Text
            label="State"
            value={form.location.state}
            onChange={(v) => setNested("location", "state", v)}
          />
        </div>
      </Card>

      <Card
        title="Bank details"
        description="The transfer details printed on /donate and on donation receipts."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Text
            label="Account name"
            value={form.bankDetails.name}
            onChange={(v) => setNested("bankDetails", "name", v)}
          />
          <Text
            label="Bank name"
            value={form.bankDetails.bankName}
            onChange={(v) => setNested("bankDetails", "bankName", v)}
          />
          <Text
            label="Branch"
            value={form.bankDetails.branch}
            onChange={(v) => setNested("bankDetails", "branch", v)}
          />
          <Text
            label="Account no."
            value={form.bankDetails.accountNo}
            onChange={(v) => setNested("bankDetails", "accountNo", v)}
          />
          <Text
            label="IFSC"
            value={form.bankDetails.ifsc}
            onChange={(v) => setNested("bankDetails", "ifsc", v)}
          />
          <Text
            label="PAN"
            value={form.bankDetails.pan}
            onChange={(v) => setNested("bankDetails", "pan", v)}
          />
          <Text
            label="City"
            value={form.bankDetails.city}
            onChange={(v) => setNested("bankDetails", "city", v)}
          />
          <Text
            label="State"
            value={form.bankDetails.state}
            onChange={(v) => setNested("bankDetails", "state", v)}
          />
        </div>
      </Card>

      <Card
        title="Donation form"
        description="The suggested amounts and limits on the online donation form."
      >
        <Text
          label="Preset amounts"
          value={form.presets}
          onChange={(v) => setField("presets", v)}
          hint="Comma-separated, e.g. 500, 1000, 2500, 5000."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Minimum amount (₹)</label>
            <input
              type="number"
              className={fieldClass}
              value={form.minAmount}
              onChange={(e) => setField("minAmount", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Maximum amount (₹)</label>
            <input
              type="number"
              className={fieldClass}
              value={form.maxAmount}
              onChange={(e) => setField("maxAmount", e.target.value)}
            />
            <p className="mt-1 text-xs text-ink-faint">
              Above this, donors are asked to contact you directly.
            </p>
          </div>
        </div>
      </Card>

      <Card
        title="Search engines"
        description="The description search engines and link previews show."
      >
        <div>
          <label className={labelClass}>Meta description</label>
          <textarea
            rows={3}
            className={fieldClass}
            value={form.seo.description ?? ""}
            onChange={(e) => setNested("seo", "description", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Link preview description</label>
          <textarea
            rows={2}
            className={fieldClass}
            value={form.seo.ogDescription ?? ""}
            onChange={(e) => setNested("seo", "ogDescription", e.target.value)}
          />
        </div>
      </Card>

      {error && <p className="text-sm font-medium text-terracotta-dark">{error}</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-full border border-line bg-paper/95 px-4 py-3 shadow-lift backdrop-blur">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save Settings"}
        </button>
        {status === "saved" && (
          <span className="text-sm font-medium text-forest">
            Saved — the public site is updated.
          </span>
        )}
      </div>
    </form>
  );
}
