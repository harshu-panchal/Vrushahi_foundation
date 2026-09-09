"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function YearlyReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  async function fetchReport() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports/financial?type=yearly");
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (!report?.data) return;
    const headers = ["Year", "Total Amount", "Donation Count"];
    const rows = report.data.map((d) => [d._id, d.totalAmount, d.donationCount]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yearly-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  const totalAmount = report?.data?.reduce((sum, d) => sum + d.totalAmount, 0) || 0;
  const totalDonations = report?.data?.reduce((sum, d) => sum + d.donationCount, 0) || 0;

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

      <h1 className="font-display text-3xl font-medium text-ink">Yearly Report</h1>
      <p className="mt-2 text-ink-soft">Annual donation trends and statistics</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Years</p>
          <p className="mt-1 font-display text-2xl font-medium text-ink">{report?.data?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Amount</p>
          <p className="mt-1 font-display text-2xl font-medium text-terracotta">
            ₹{totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Donations</p>
          <p className="mt-1 font-display text-2xl font-medium text-ink">{totalDonations}</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-center text-ink-soft">Loading report...</div>
      ) : report?.data ? (
        <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink">Year-wise Breakdown</h2>
            <button
              onClick={exportToCSV}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-terracotta hover:text-terracotta"
            >
              Export CSV
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  <th className="pb-3 pr-4">Year</th>
                  <th className="pb-3 pr-4 text-right">Total Amount</th>
                  <th className="pb-3 text-right">Donation Count</th>
                </tr>
              </thead>
              <tbody>
                {report.data.map((year, i) => (
                  <tr key={i} className="border-b border-line hover:bg-surface">
                    <td className="py-3 pr-4 font-medium text-ink">{year._id}</td>
                    <td className="py-3 pr-4 text-right font-medium text-terracotta">
                      ₹{year.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right text-ink-soft">{year.donationCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-ink-soft">No data available</div>
      )}
    </div>
  );
}
