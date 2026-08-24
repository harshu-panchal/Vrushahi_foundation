import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import { getReportSummary } from "@/lib/services/reports";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import StatCard from "@/components/admin/StatCard";
import { TrendChart, ProgramBreakdownChart } from "@/components/admin/DashboardCharts";

export const metadata = { title: "Dashboard — Admin" };

export default async function AdminDashboardPage() {
  await dbConnect();

  const [summary, recentDonationsDoc] = await Promise.all([
    getReportSummary(),
    Donation.find().populate("donor", "name").sort({ date: -1 }).limit(6).lean(),
  ]);
  const recentDonations = JSON.parse(JSON.stringify(recentDonationsDoc));

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">
        An overview of donations, donors, and pending activity.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="This month" value={`₹${summary.thisMonthAmount.toLocaleString("en-IN")}`} />
        <StatCard label="This year" value={`₹${summary.thisYearAmount.toLocaleString("en-IN")}`} />
        <StatCard label="Total donors" value={summary.donorCount} />
        <StatCard
          label="Volunteers to review"
          value={summary.pendingVolunteers}
          hint={summary.pendingVolunteers > 0 ? "New sign-ups waiting" : "All caught up"}
        />
        <StatCard
          label="Unread messages"
          value={summary.unreadMessages}
          hint={summary.unreadMessages > 0 ? "Needs a reply" : "Inbox clear"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-display text-lg font-medium text-ink">
            Donations, last 12 months
          </h2>
          <div className="mt-4">
            <TrendChart data={summary.monthlyTrend} />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-display text-lg font-medium text-ink">
            By programme (all time)
          </h2>
          <div className="mt-4">
            <ProgramBreakdownChart data={summary.byProgram} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-ink">
            Recent donations
          </h2>
          <Link href="/admin/donations" className="text-sm font-semibold text-terracotta">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Programme</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recentDonations.map((d) => (
                <tr key={d._id}>
                  <td className="px-4 py-3 text-ink-soft">
                    {new Date(d.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {d.donor?.name || "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-soft">{d.program}</td>
                  <td className="px-4 py-3 text-right font-medium text-ink">
                    ₹{d.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
              {recentDonations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-faint">
                    No donations recorded yet.{" "}
                    <Link href="/admin/donations/new" className="font-semibold text-terracotta">
                      Add the first one
                    </Link>
                    .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
