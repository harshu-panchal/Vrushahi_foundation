"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function FinancialDonorReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("amount"); // amount, count, date

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  async function fetchReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: "financial-donor-name",
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

  const sortedDonations =
    report?.donations?.sort((a, b) => {
      if (sortBy === "amount") return b.totalAmount - a.totalAmount;
      if (sortBy === "count") return b.donationCount - a.donationCount;
      if (sortBy === "date") return new Date(b.lastDonation) - new Date(a.lastDonation);
      return 0;
    }) || [];

  function exportToCSV() {
    const headers = ["Donor Name", "Email", "Total Amount", "Donation Count", "Last Donation"];
    const rows = sortedDonations.map((d) => [
      d.donorName,
      d.donorEmail,
      d.totalAmount,
      d.donationCount,
      new Date(d.lastDonation).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-donor-report-${new Date().toISOString().split("T")[0]}.csv`;
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

      <h1 className="font-display text-3xl font-medium text-ink">Financial Report - Donor Name</h1>
      <p className="mt-2 text-ink-soft">View donation details grouped by donor</p>

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
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Total Donors
              </p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">
                {report.totalDonors}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Total Amount
              </p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">
                ₹{report.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Average Donation
              </p>
              <p className="mt-1 font-display text-2xl font-medium text-ink">
                ₹{(report.totalAmount / Math.max(report.totalDonors, 1)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium text-ink">Donors</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-line bg-surface px-3 py-1 text-sm text-ink-soft"
              >
                <option value="amount">Sort by Amount</option>
                <option value="count">Sort by Count</option>
                <option value="date">Sort by Last Donation</option>
              </select>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4 text-right">Total Amount</th>
                    <th className="pb-3 pr-4 text-right">Count</th>
                    <th className="pb-3">Last Donation</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDonations.map((donation, i) => (
                    <tr key={i} className="border-b border-line hover:bg-surface">
                      <td className="py-3 pr-4 font-medium text-ink">{donation.donorName}</td>
                      <td className="py-3 pr-4 text-ink-soft">{donation.donorEmail}</td>
                      <td className="py-3 pr-4 text-right font-medium text-terracotta">
                        ₹{donation.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-4 text-right text-ink-soft">{donation.donationCount}</td>
                      <td className="py-3 text-ink-soft">
                        {new Date(donation.lastDonation).toLocaleDateString()}
                      </td>
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
