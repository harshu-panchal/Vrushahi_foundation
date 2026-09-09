"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BankEntryReport() {
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
      const params = new URLSearchParams({ type: "bank-entry" });
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
    if (!report?.bankEntries) return;
    const headers = ["Bank Name", "Bank Code", "Total Debit", "Total Credit", "Total Entries"];
    const rows = report.bankEntries.map((b) => [
      b.bankName,
      b._id,
      b.totalDebit,
      b.totalCredit,
      b.entries,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bank-entry-report-${new Date().toISOString().split("T")[0]}.csv`;
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

      <h1 className="font-display text-3xl font-medium text-ink">Bank Entry Report</h1>
      <p className="mt-2 text-ink-soft">All bank transactions and entries</p>

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
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Banks</p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">{report.summary?.totalBanks || 0}</p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Debit</p>
              <p className="mt-1 font-display text-2xl font-medium text-red-600">
                ₹{report.summary?.totalDebit?.toLocaleString("en-IN") || 0}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Credit</p>
              <p className="mt-1 font-display text-2xl font-medium text-green-600">
                ₹{report.summary?.totalCredit?.toLocaleString("en-IN") || 0}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Entries</p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">{report.summary?.totalEntries || 0}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
            <h2 className="font-display text-lg font-medium text-ink">Bank-wise Entries</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    <th className="pb-3 pr-4">Bank Name</th>
                    <th className="pb-3 pr-4 text-right">Total Debit</th>
                    <th className="pb-3 pr-4 text-right">Total Credit</th>
                    <th className="pb-3 text-right">Total Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {report.bankEntries?.map((bank, i) => (
                    <tr key={i} className="border-b border-line hover:bg-surface">
                      <td className="py-3 pr-4 font-medium text-ink">{bank.bankName}</td>
                      <td className="py-3 pr-4 text-right text-red-600">
                        ₹{bank.totalDebit.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-4 text-right text-green-600">
                        ₹{bank.totalCredit.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-right text-ink-soft">{bank.entries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-ink-soft">No data available</div>
      )}
    </div>
  );
}
