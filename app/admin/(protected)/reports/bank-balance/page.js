"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function BankBalanceReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  async function fetchReport() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports/financial?type=bank-balance");
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (!report?.banks) return;
    const headers = ["Bank Name", "Bank Code", "Current Balance", "Total Debit", "Total Credit"];
    const rows = report.banks.map((b) => [
      b.bankName,
      b.bankCode,
      b.currentBalance,
      b.totalDebit,
      b.totalCredit,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bank-balance-report-${new Date().toISOString().split("T")[0]}.csv`;
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

      <h1 className="font-display text-3xl font-medium text-ink">Bank Deposit Current Balance</h1>
      <p className="mt-2 text-ink-soft">Check current balance in all registered bank accounts</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Banks</p>
          <p className="mt-1 font-display text-2xl font-medium text-ink">{report?.banks?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Balance</p>
          <p className="mt-1 font-display text-2xl font-medium text-terracotta">
            ₹{report?.totalBalance?.toLocaleString("en-IN") || 0}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Generated</p>
          <p className="mt-1 text-sm text-ink">
            {report?.generatedDate ? new Date(report.generatedDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-center text-ink-soft">Loading report...</div>
      ) : report?.banks ? (
        <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink">Bank Accounts</h2>
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
                  <th className="pb-3 pr-4">Bank Name</th>
                  <th className="pb-3 pr-4 text-right">Code</th>
                  <th className="pb-3 pr-4 text-right">Current Balance</th>
                  <th className="pb-3 pr-4 text-right">Total Credit</th>
                  <th className="pb-3 text-right">Total Debit</th>
                </tr>
              </thead>
              <tbody>
                {report.banks.map((bank, i) => (
                  <tr key={i} className="border-b border-line hover:bg-surface">
                    <td className="py-3 pr-4 font-medium text-ink">{bank.bankName}</td>
                    <td className="py-3 pr-4 text-right text-ink-soft">{bank.bankCode}</td>
                    <td className="py-3 pr-4 text-right font-medium text-terracotta">
                      ₹{bank.currentBalance.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 pr-4 text-right text-green-600">
                      ₹{bank.totalCredit.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right text-red-600">
                      ₹{bank.totalDebit.toLocaleString("en-IN")}
                    </td>
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
