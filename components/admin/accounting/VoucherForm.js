"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const emptyLine = { ledgerCode: "", partyCode: "", debit: "", credit: "", remark: "" };
const emptyCheque = { typeCode: "", number: "", date: "", draweeBankCode: "", amount: "" };

function fieldClass() {
  return "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none";
}

function labelClass() {
  return "mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint";
}

export default function VoucherForm({ voucherId, initial }) {
  const router = useRouter();
  const [header, setHeader] = useState(() => ({
    yearCode: initial?.yearCode ?? "",
    voucherNumber: initial?.voucherNumber ?? "",
    voucherTypeCode: initial?.voucherTypeCode ?? "",
    date: initial?.date ? initial.date.slice(0, 10) : "",
    narration: initial?.narration ?? "",
    fromTo: initial?.fromTo ?? "",
    bankCode: initial?.bankCode ?? "",
    preparedBy: initial?.preparedBy ?? "",
    passedBy: initial?.passedBy ?? "",
    cashierUser: initial?.cashierUser ?? "",
  }));
  const [lines, setLines] = useState(
    initial?.lines?.length ? initial.lines.map((l) => ({ ...emptyLine, ...l })) : [{ ...emptyLine }]
  );
  const [cheques, setCheques] = useState(
    initial?.chequeDdDetails?.map((c) => ({
      ...emptyCheque,
      ...c,
      date: c.date ? c.date.slice(0, 10) : "",
    })) ?? []
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const debit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
    const credit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
    return { debit, credit, balanced: Math.abs(debit - credit) < 0.01 };
  }, [lines]);

  function updateLine(index, key, value) {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, [key]: value } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { ...emptyLine }]);
  }

  function removeLine(index) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function updateCheque(index, key, value) {
    setCheques((prev) => prev.map((c, i) => (i === index ? { ...c, [key]: value } : c)));
  }

  function addCheque() {
    setCheques((prev) => [...prev, { ...emptyCheque }]);
  }

  function removeCheque(index) {
    setCheques((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!totals.balanced) {
      setError("Total debit must equal total credit before saving.");
      return;
    }

    const payload = {
      ...header,
      voucherNumber: Number(header.voucherNumber),
      voucherTypeCode: Number(header.voucherTypeCode),
      bankCode: header.bankCode === "" ? undefined : Number(header.bankCode),
      lines: lines
        .filter((l) => l.ledgerCode !== "")
        .map((l) => ({
          ledgerCode: Number(l.ledgerCode),
          partyCode: l.partyCode === "" ? undefined : Number(l.partyCode),
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
          remark: l.remark || undefined,
        })),
      chequeDdDetails: cheques
        .filter((c) => c.number !== "" || c.amount !== "")
        .map((c) => ({
          typeCode: c.typeCode === "" ? undefined : Number(c.typeCode),
          number: c.number || undefined,
          date: c.date || undefined,
          draweeBankCode: c.draweeBankCode === "" ? undefined : Number(c.draweeBankCode),
          amount: c.amount === "" ? undefined : Number(c.amount),
        })),
    };

    setSaving(true);
    const endpoint = voucherId
      ? `/api/admin/accounting/vouchers/${voucherId}`
      : "/api/admin/accounting/vouchers";
    const res = await fetch(endpoint, {
      method: voucherId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(json.error || "Failed to save voucher");
      return;
    }

    const savedId = voucherId || json.item?._id;
    router.push(`/admin/accounting/vouchers/${savedId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <p className="rounded-lg bg-terracotta-light px-3 py-2 text-sm text-terracotta-dark">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass()}>Financial year</label>
          <input
            required
            className={fieldClass()}
            value={header.yearCode}
            onChange={(e) => setHeader((h) => ({ ...h, yearCode: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>Voucher number</label>
          <input
            required
            type="number"
            className={fieldClass()}
            value={header.voucherNumber}
            onChange={(e) => setHeader((h) => ({ ...h, voucherNumber: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>Voucher type code</label>
          <input
            required
            type="number"
            className={fieldClass()}
            value={header.voucherTypeCode}
            onChange={(e) => setHeader((h) => ({ ...h, voucherTypeCode: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>Date</label>
          <input
            required
            type="date"
            className={fieldClass()}
            value={header.date}
            onChange={(e) => setHeader((h) => ({ ...h, date: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>Bank code</label>
          <input
            type="number"
            className={fieldClass()}
            value={header.bankCode}
            onChange={(e) => setHeader((h) => ({ ...h, bankCode: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>From / To</label>
          <input
            className={fieldClass()}
            value={header.fromTo}
            onChange={(e) => setHeader((h) => ({ ...h, fromTo: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-3">
          <label className={labelClass()}>Narration</label>
          <input
            className={fieldClass()}
            value={header.narration}
            onChange={(e) => setHeader((h) => ({ ...h, narration: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>Prepared by</label>
          <input
            className={fieldClass()}
            value={header.preparedBy}
            onChange={(e) => setHeader((h) => ({ ...h, preparedBy: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>Passed by</label>
          <input
            className={fieldClass()}
            value={header.passedBy}
            onChange={(e) => setHeader((h) => ({ ...h, passedBy: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>Cashier</label>
          <input
            className={fieldClass()}
            value={header.cashierUser}
            onChange={(e) => setHeader((h) => ({ ...h, cashierUser: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-ink">Voucher lines</h2>
          <button
            type="button"
            onClick={addLine}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink"
          >
            + Add line
          </button>
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-3 py-2">Ledger code</th>
                <th className="px-3 py-2">Party code</th>
                <th className="px-3 py-2">Debit</th>
                <th className="px-3 py-2">Credit</th>
                <th className="px-3 py-2">Remark</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {lines.map((line, i) => (
                <tr key={i}>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className={fieldClass()}
                      value={line.ledgerCode}
                      onChange={(e) => updateLine(i, "ledgerCode", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className={fieldClass()}
                      value={line.partyCode}
                      onChange={(e) => updateLine(i, "partyCode", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className={fieldClass()}
                      value={line.debit}
                      onChange={(e) => updateLine(i, "debit", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className={fieldClass()}
                      value={line.credit}
                      onChange={(e) => updateLine(i, "credit", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className={fieldClass()}
                      value={line.remark}
                      onChange={(e) => updateLine(i, "remark", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeLine(i)}
                      className="text-xs font-semibold text-terracotta-dark"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          className={`mt-2 text-sm font-medium ${
            totals.balanced ? "text-forest" : "text-terracotta-dark"
          }`}
        >
          Debit ₹{totals.debit.toLocaleString("en-IN")} · Credit ₹
          {totals.credit.toLocaleString("en-IN")}{" "}
          {totals.balanced ? "— balanced" : "— must balance before saving"}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-ink">
            Cheque / DD details (optional)
          </h2>
          <button
            type="button"
            onClick={addCheque}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink"
          >
            + Add cheque/DD
          </button>
        </div>

        {cheques.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-3 py-2">Type code</th>
                  <th className="px-3 py-2">Number</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Drawee bank code</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {cheques.map((c, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        className={fieldClass()}
                        value={c.typeCode}
                        onChange={(e) => updateCheque(i, "typeCode", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        className={fieldClass()}
                        value={c.number}
                        onChange={(e) => updateCheque(i, "number", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        className={fieldClass()}
                        value={c.date}
                        onChange={(e) => updateCheque(i, "date", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        className={fieldClass()}
                        value={c.draweeBankCode}
                        onChange={(e) => updateCheque(i, "draweeBankCode", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        className={fieldClass()}
                        value={c.amount}
                        onChange={(e) => updateCheque(i, "amount", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeCheque(i)}
                        className="text-xs font-semibold text-terracotta-dark"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-paper hover:bg-terracotta-dark disabled:opacity-60"
      >
        {saving ? "Saving…" : voucherId ? "Save changes" : "Create voucher"}
      </button>
    </form>
  );
}
