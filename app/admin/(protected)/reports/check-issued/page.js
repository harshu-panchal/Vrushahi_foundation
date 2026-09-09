"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckIssuedReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  async function fetchReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: "check-issued" });
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/admin/reports/financial?${params}`);
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  }

  function getInitialDates() {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    setStartDate(lastYear.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }

  function exportToCSV() {
    if (!report?.checks) return;
    const headers = ["Voucher No", "Amount", "Date", "Party Name", "Reference No", "Status"];
    const rows = report.checks.map((c) => [
      c.voucherNo,
      c.amount,
      new Date(c.date).toLocaleDateString(),
      c.partyName,
      c.referenceNo,
      c.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `check-issued-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  return (
    <div>
      <Link
        href="/admin/reports"
        className="group/back mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
      >
        <span className="inline-block transition-transform duration-300 group-hover/back:-translate-x-1">
          ← Back to Reports
        </span>
      </Link>

      <h1 className="font-display text-3xl font-medium text-ink">Check Issued Report</h1>
      <p className="mt-2 text-ink-soft">All cheques issued with details</p>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
            />
          </div>
          <button
            onClick={getInitialDates}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta"
          >
            Last 12 Months
          </button>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-sm text-ink-faint underline"
            >
              Clear
            </button>
          )}
          <button
            onClick={exportToCSV}
            disabled={!report || loading}
            className="ml-auto rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-terracotta hover:text-terracotta disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-center text-ink-soft">Loading report...</div>
      ) : report ? (
        <div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Cheques</p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">{report.totalChecks || 0}</p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Amount</p>
              <p className="mt-1 font-display text-2xl font-medium text-terracotta">
                ₹{report.totalAmount?.toLocaleString("en-IN") || 0}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Avg Cheque Amount</p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">
                ₹{(report.totalAmount / Math.max(report.totalChecks, 1)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
            <h2 className="font-display text-lg font-medium text-ink">Cheques Issued</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    <th className="pb-3 pr-4">Voucher No</th>
                    <th className="pb-3 pr-4">Party Name</th>
                    <th className="pb-3 pr-4 text-right">Amount</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Reference No</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.checks?.map((check, i) => (
                    <tr key={i} className="border-b border-line hover:bg-surface">
                      <td className="py-3 pr-4 font-medium text-ink">{check.voucherNo}</td>
                      <td className="py-3 pr-4 text-ink-soft">{check.partyName}</td>
                      <td className="py-3 pr-4 text-right font-medium text-terracotta">
                        ₹{check.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-4 text-ink-soft">
                        {new Date(check.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4 text-ink-soft">{check.referenceNo || "—"}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                            check.status === "cleared"
                              ? "bg-green-100 text-green-700"
                              : check.status === "bounced"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {check.status || "pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {report.checks?.length === 0 && (
              <div className="mt-6 text-center text-ink-soft">No cheques issued in this period</div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-ink-soft">No data available</div>
      )}
    </div>
  );
}
