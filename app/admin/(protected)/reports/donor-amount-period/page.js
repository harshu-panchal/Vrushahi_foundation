"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DonorAmountPeriodReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, period]);

  async function fetchReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: "donor-amount-period",
        period,
      });
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
    if (!report?.data) return;
    const headers = ["Period", "Total Amount", "Donation Count", "Unique Donors"];
    const rows = report.data.map((d) => [d._id, d.totalAmount, d.donationCount, d.uniqueDonorCount]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donor-amount-period-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  const periodLabel = {
    month: "Month",
    quarter: "Quarter",
    year: "Year",
  };

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

      <h1 className="font-display text-3xl font-medium text-ink">Donor Amount by Period</h1>
      <p className="mt-2 text-ink-soft">Donation amounts by month, quarter, or year</p>

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
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
            >
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
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
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Periods</p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">{report.data?.length || 0}</p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Amount</p>
              <p className="mt-1 font-display text-2xl font-medium text-terracotta">
                ₹{report.totalAmount?.toLocaleString("en-IN") || 0}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Avg per Period</p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">
                ₹{(report.totalAmount / Math.max(report.data?.length, 1)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium text-ink">{periodLabel[period]}-wise Breakdown</h2>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    <th className="pb-3 pr-4">{periodLabel[period]}</th>
                    <th className="pb-3 pr-4 text-right">Total Amount</th>
                    <th className="pb-3 pr-4 text-right">Donation Count</th>
                    <th className="pb-3 text-right">Unique Donors</th>
                  </tr>
                </thead>
                <tbody>
                  {report.data?.map((row, i) => (
                    <tr key={i} className="border-b border-line hover:bg-surface">
                      <td className="py-3 pr-4 font-medium text-ink">{row._id}</td>
                      <td className="py-3 pr-4 text-right font-medium text-terracotta">
                        ₹{row.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-4 text-right text-ink-soft">{row.donationCount}</td>
                      <td className="py-3 text-right text-ink-soft">{row.uniqueDonorCount}</td>
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
