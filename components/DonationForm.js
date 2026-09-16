"use client";

import { useState } from "react";
import { programs } from "@/data/programs";
import { site } from "@/data/site";
import Icon from "@/components/Icon";
import DonationReceipt from "@/components/DonationReceipt";
import PrintReceiptPortal from "@/components/PrintReceiptPortal";
import { amountInWords } from "@/lib/utils/numberToWords";

const fieldClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";
const fieldErrorClass =
  "w-full rounded-lg border border-terracotta-dark bg-paper px-3 py-2.5 text-sm text-ink focus:border-terracotta-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint";
const errorTextClass = "mt-1 text-xs font-medium text-terracotta-dark";

const DONATION_TYPES = [
  { value: "one_time", label: "One-time gift" },
  { value: "monthly", label: "Monthly giving" },
];

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];
const MAX_AMOUNT = 10000000;

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(value, maxLength) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

function validate(form) {
  const errors = {};

  if (!form.donorName.trim()) {
    errors.donorName = "Please enter your name.";
  } else if (form.donorName.trim().length > 200) {
    errors.donorName = "Name is too long.";
  }

  if (!form.donorPhone) {
    errors.donorPhone = "Please enter your mobile number.";
  } else if (!PHONE_RE.test(form.donorPhone)) {
    errors.donorPhone = "Enter a valid 10-digit mobile number.";
  }

  if (form.donorMobile2 && !PHONE_RE.test(form.donorMobile2)) {
    errors.donorMobile2 = "Enter a valid 10-digit mobile number.";
  }

  if (form.donorEmail && !EMAIL_RE.test(form.donorEmail.trim())) {
    errors.donorEmail = "Enter a valid email address.";
  }

  if (form.donorAddress.trim().length > 300) {
    errors.donorAddress = "Address is too long (max 300 characters).";
  }

  const amount = Number(form.amount);
  if (!form.amount) {
    errors.amount = "Please enter an amount.";
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = "Enter a valid amount.";
  } else if (amount < 10) {
    errors.amount = "Minimum donation amount is ₹10.";
  } else if (amount > MAX_AMOUNT) {
    errors.amount = `For amounts above ₹${MAX_AMOUNT.toLocaleString("en-IN")}, please contact us directly.`;
  }

  if (form.suggestion.trim().length > 1000) {
    errors.suggestion = "Message is too long (max 1000 characters).";
  }

  return errors;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DonationForm() {
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    donorMobile2: "",
    donorAddress: "",
    donationType: "one_time",
    category: "general",
    amount: "",
    suggestion: "",
    company: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [touched, setTouched] = useState({});

  const fieldErrors = validate(form);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function blur(key) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function errorFor(key) {
    return touched[key] ? fieldErrors[key] : undefined;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (Object.keys(fieldErrors).length > 0) {
      setTouched({
        donorName: true,
        donorPhone: true,
        donorMobile2: true,
        donorEmail: true,
        donorAddress: true,
        amount: true,
        suggestion: true,
      });
      setError("Please fix the highlighted fields before continuing.");
      return;
    }

    setSubmitting(true);
    try {
      const orderRes = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const orderData = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) {
        setError(orderData.error || "Could not start the payment. Please try again.");
        setSubmitting(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setError("Could not load the payment gateway. Check your connection and try again.");
        setSubmitting(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: site.name || "Vrushahi Foundation",
        description: "Donation to Vrushahi Foundation",
        prefill: {
          name: orderData.donor?.name,
          email: orderData.donor?.email,
          contact: orderData.donor?.phone,
        },
        theme: { color: "#c15a3c" },
        handler: async function (response) {
          const verifyRes = await fetch("/api/donations/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              donationId: orderData.donationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json().catch(() => ({}));
          if (verifyRes.ok && verifyData.receipt) {
            setSuccess(verifyData.receipt);
          } else {
            setError(
              "We received your payment but could not confirm it automatically. Please contact us with your payment ID."
            );
          }
          setSubmitting(false);
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      });

      razorpay.on("payment.failed", function () {
        setError("The payment could not be completed. Please try again.");
        setSubmitting(false);
      });

      razorpay.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div>
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-forest/10 text-forest">
            <Icon name="ShieldCheck" className="size-6" />
          </span>
          <h3 className="font-display text-xl font-medium text-ink">
            Thank you, {success.donor?.name || "friend"}!
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            Your donation was received successfully.
            {success.donor?.email &&
              " A copy of this receipt has been emailed to you."}
          </p>
        </div>

        <DonationReceipt
          receipt={success}
          amountWords={amountInWords(success.amount)}
        />
        <PrintReceiptPortal
          receipt={success}
          amountWords={amountInWords(success.amount)}
        />

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft hover:border-ink"
          >
            <Icon name="Receipt" className="size-4" />
            Print receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Mobile No.</label>
          <input
            type="tel"
            inputMode="numeric"
            required
            maxLength={10}
            className={errorFor("donorPhone") ? fieldErrorClass : fieldClass}
            value={form.donorPhone}
            onChange={(e) => update("donorPhone", digitsOnly(e.target.value, 10))}
            onBlur={() => blur("donorPhone")}
            aria-invalid={Boolean(errorFor("donorPhone"))}
            placeholder="10-digit mobile number"
          />
          {errorFor("donorPhone") && (
            <p className={errorTextClass}>{fieldErrors.donorPhone}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            required
            maxLength={200}
            className={errorFor("donorName") ? fieldErrorClass : fieldClass}
            value={form.donorName}
            onChange={(e) => update("donorName", e.target.value)}
            onBlur={() => blur("donorName")}
            aria-invalid={Boolean(errorFor("donorName"))}
            placeholder="Enter your name"
          />
          {errorFor("donorName") && (
            <p className={errorTextClass}>{fieldErrors.donorName}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input
            type="text"
            maxLength={300}
            className={errorFor("donorAddress") ? fieldErrorClass : fieldClass}
            value={form.donorAddress}
            onChange={(e) => update("donorAddress", e.target.value)}
            onBlur={() => blur("donorAddress")}
            aria-invalid={Boolean(errorFor("donorAddress"))}
            placeholder="Enter your address"
          />
          {errorFor("donorAddress") && (
            <p className={errorTextClass}>{fieldErrors.donorAddress}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            className={errorFor("donorEmail") ? fieldErrorClass : fieldClass}
            value={form.donorEmail}
            onChange={(e) => update("donorEmail", e.target.value)}
            onBlur={() => blur("donorEmail")}
            aria-invalid={Boolean(errorFor("donorEmail"))}
            placeholder="Enter your email address"
          />
          {errorFor("donorEmail") && (
            <p className={errorTextClass}>{fieldErrors.donorEmail}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Alternate Mobile No.</label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className={errorFor("donorMobile2") ? fieldErrorClass : fieldClass}
            value={form.donorMobile2}
            onChange={(e) => update("donorMobile2", digitsOnly(e.target.value, 10))}
            onBlur={() => blur("donorMobile2")}
            aria-invalid={Boolean(errorFor("donorMobile2"))}
            placeholder="Optional"
          />
          {errorFor("donorMobile2") && (
            <p className={errorTextClass}>{fieldErrors.donorMobile2}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Donation Type</label>
          <select
            className={fieldClass}
            value={form.donationType}
            onChange={(e) => update("donationType", e.target.value)}
          >
            {DONATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select
            className={fieldClass}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="general">General / wherever needed most</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Amount (₹)</label>
          <input
            type="number"
            min="10"
            max={MAX_AMOUNT}
            step="1"
            required
            className={errorFor("amount") ? fieldErrorClass : fieldClass}
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            onBlur={() => blur("amount")}
            aria-invalid={Boolean(errorFor("amount"))}
            placeholder="Enter your amount"
          />
          {errorFor("amount") && <p className={errorTextClass}>{fieldErrors.amount}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => update("amount", String(a))}
                className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft hover:border-terracotta hover:text-terracotta"
              >
                ₹{a.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Suggestion / message (optional)</label>
        <textarea
          rows={3}
          maxLength={1000}
          className={errorFor("suggestion") ? fieldErrorClass : fieldClass}
          value={form.suggestion}
          onChange={(e) => update("suggestion", e.target.value)}
          onBlur={() => blur("suggestion")}
          aria-invalid={Boolean(errorFor("suggestion"))}
          placeholder="Enter your suggestion"
        />
        {errorFor("suggestion") && (
          <p className={errorTextClass}>{fieldErrors.suggestion}</p>
        )}
      </div>

      {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={(e) => update("company", e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {error && <p className="text-sm font-medium text-terracotta-dark">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark disabled:opacity-60 sm:w-auto"
      >
        <Icon name="Heart" className="size-4" />
        {submitting ? "Processing…" : "Donate Now"}
      </button>
    </form>
  );
}
