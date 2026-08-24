"use client";

import { useState } from "react";
import { site } from "@/data/site";
import Icon from "./Icon";

const fieldClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

export default function ContactForm({
  subjectPrefix = "Message from vrushahifoundation.org",
  fields = ["name", "email", "phone", "message"],
  submitLabel = "Send Message",
  endpoint,
}) {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!endpoint) {
      const subject = `${subjectPrefix}${values.name ? " — " + values.name : ""}`;
      const bodyLines = fields
        .filter((f) => f !== "message")
        .map((f) => `${f[0].toUpperCase() + f.slice(1)}: ${values[f] || "-"}`);
      if (values.message) bodyLines.push("", values.message);
      const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailto;
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setValues({});
      e.target.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again in a moment.");
    }
  }

  if (endpoint && status === "success") {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 text-center">
        <p className="font-medium text-ink">Thank you — we&apos;ve received it.</p>
        <p className="mt-1 text-sm text-ink-soft">
          We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.includes("name") && (
        <input
          type="text"
          required
          placeholder="Your name"
          className={fieldClass}
          onChange={(e) => update("name", e.target.value)}
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.includes("email") && (
          <input
            type="email"
            required={!endpoint}
            placeholder="Email address"
            className={fieldClass}
            onChange={(e) => update("email", e.target.value)}
          />
        )}
        {fields.includes("phone") && (
          <input
            type="tel"
            placeholder="Phone number"
            className={fieldClass}
            onChange={(e) => update("phone", e.target.value)}
          />
        )}
      </div>
      {fields.includes("location") && (
        <input
          type="text"
          placeholder="City / location"
          className={fieldClass}
          onChange={(e) => update("location", e.target.value)}
        />
      )}
      {fields.includes("interest") && (
        <input
          type="text"
          placeholder="Which programme interests you?"
          className={fieldClass}
          onChange={(e) => update("interest", e.target.value)}
        />
      )}
      {fields.includes("message") && (
        <textarea
          required
          rows={5}
          placeholder="Your message"
          className={fieldClass}
          onChange={(e) => update("message", e.target.value)}
        />
      )}
      {endpoint && (
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          onChange={(e) => update("company", e.target.value)}
        />
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
        <Icon name="ArrowRight" className="size-4" />
      </button>
      {endpoint ? (
        status === "error" && (
          <p className="text-xs font-medium text-terracotta-dark">
            {errorMessage}
          </p>
        )
      ) : (
        <p className="text-xs text-ink-faint">
          This opens your email app with the details filled in, addressed to{" "}
          {site.contact.email}.
        </p>
      )}
    </form>
  );
}
