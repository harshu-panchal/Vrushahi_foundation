"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { TrendChart, ProgramBreakdownChart } from "./DashboardCharts";

function formatMode(value) {
  return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export default function ReportsClient({ initialSummary }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!from && !to) {
      return;
    }
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    fetch(`/api/admin/reports/summary?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .finally(() => setLoading(false));
  }, [from, to]);

  function handleFromChange(value) {
    setFrom(value);
    if (!value && !to) {
      setSummary(initialSummary);
    } else {
      setLoading(true);
    }
  }

  function handleToChange(value) {
    setTo(value);
    if (!from && !value) {
      setSummary(initialSummary);
    } else {
      setLoading(true);
    }
  }

  const exportParams = new URLSearchParams();
  if (from) exportParams.set("from", from);
  if (to) exportParams.set("to", to);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            From
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => handleFromChange(e.target.value)}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            To
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => handleToChange(e.target.value)}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
          />
        </div>
        {(from || to) && (
          <button
            type="button"
            onClick={() => {
              setFrom("");
              setTo("");
              setSummary(initialSummary);
            }}
            className="text-sm text-ink-faint underline"
          >
            Clear range
          </button>
        )}
        <a
          href={`/api/admin/reports/export?${exportParams.toString()}`}
          className="ml-auto rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-ink"
        >
          Export CSV
        </a>
      </div>

      <div
        className={`mt-6 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label={from || to ? "Total in range" : "Total, last 12 months"}
            value={`₹${summary.totalAmount.toLocaleString("en-IN")}`}
          />
          <StatCard label="Donations" value={summary.donationCount} />
          <StatCard label="Unique donors" value={summary.donorCount} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-lg font-medium text-ink">Trend</h2>
            <div className="mt-4">
              <TrendChart data={summary.monthlyTrend} />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-lg font-medium text-ink">
              By programme
            </h2>
            <div className="mt-4">
              <ProgramBreakdownChart data={summary.byProgram} />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-display text-lg font-medium text-ink">
            By payment mode
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {summary.byMode.map((row) => (
              <div key={row.mode} className="rounded-xl border border-line p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {formatMode(row.mode)}
                </p>
                <p className="mt-1 font-display text-lg font-medium text-ink">
                  ₹{row.total.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-ink-faint">{row.count} donations</p>
              </div>
            ))}
            {summary.byMode.length === 0 && (
              <p className="text-sm text-ink-faint">No data for this range.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
