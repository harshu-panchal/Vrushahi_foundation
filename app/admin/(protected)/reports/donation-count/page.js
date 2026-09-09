"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DonationCountReport() {
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
      const params = new URLSearchParams({ type: "donation-count" });
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
    if (!report) return;
    const headers = ["Category", "Count", "Total Amount"];
    let csv = headers.join(",") + "\n";

    csv += "By Mode:\n";
    report.byMode.forEach((row) => {
      csv += `${row._id},${row.count},${row.totalAmount}\n`;
    });

    csv += "\nBy Program:\n";
    report.byProgram.forEach((row) => {
      csv += `${row._id},${row.count},${row.totalAmount}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donation-count-report-${new Date().toISOString().split("T")[0]}.csv`;
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

      <h1 className="font-display text-3xl font-medium text-ink">Donation Count Report</h1>
      <p className="mt-2 text-ink-soft">Total number of donations received by mode and program</p>

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
          <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
            <h2 className="font-display text-lg font-medium text-ink">Total Donations</h2>
            <p className="mt-1 font-display text-3xl font-medium text-terracotta">
              {report.totalDonations}
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-paper p-6">
              <h2 className="font-display text-lg font-medium text-ink">By Payment Mode</h2>
              <div className="mt-6 space-y-3">
                {report.byMode.map((mode, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-line p-3">
                    <div>
                      <p className="text-sm font-medium text-ink capitalize">{mode._id}</p>
                      <p className="text-xs text-ink-soft">{mode.count} donations</p>
                    </div>
                    <p className="font-medium text-terracotta">₹{mode.totalAmount.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-6">
              <h2 className="font-display text-lg font-medium text-ink">By Program</h2>
              <div className="mt-6 space-y-3">
                {report.byProgram.map((prog, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-line p-3">
                    <div>
                      <p className="text-sm font-medium text-ink capitalize">{prog._id}</p>
                      <p className="text-xs text-ink-soft">{prog.count} donations</p>
                    </div>
                    <p className="font-medium text-terracotta">₹{prog.totalAmount.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-ink-soft">No data available</div>
      )}
    </div>
  );
}
