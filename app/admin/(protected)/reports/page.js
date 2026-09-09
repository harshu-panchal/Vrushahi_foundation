import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import { getReportSummary } from "@/lib/services/reports";
import ReportsClient from "@/components/admin/ReportsClient";
import Icon from "@/components/Icon";

export const metadata = { title: "Reports — Admin" };

const reportTypes = [
  {
    id: "financial-donor-name",
    title: "Financial Report - Donor Name",
    description: "View donation details grouped by donor name with totals",
    icon: "Users",
  },
  {
    id: "bank-balance",
    title: "Bank Deposit Current Balance",
    description: "Check current balance in all registered bank accounts",
    icon: "Wallet",
  },
  {
    id: "yearly",
    title: "Yearly Report",
    description: "Annual donation trends and statistics",
    icon: "BarChart3",
  },
  {
    id: "donation-count",
    title: "Donation Count Report",
    description: "Total number of donations received by mode and program",
    icon: "Receipt",
  },
  {
    id: "donor-amount-period",
    title: "Donor Amount by Period",
    description: "Donation amounts by month, quarter, or year",
    icon: "CalendarDays",
  },
  {
    id: "bank-entry",
    title: "Bank Entry Report",
    description: "All bank transactions and entries",
    icon: "Building2",
  },
  {
    id: "check-issued",
    title: "Check Issued Report",
    description: "All cheques issued with details",
    icon: "CheckCircle2",
  },
];

export default async function ReportsPage() {
  await dbConnect();
  const summary = await getReportSummary();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Reports</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Generate and view various financial and donor reports
      </p>

      <div className="mt-8">
        <h2 className="font-display text-lg font-medium text-ink">Summary</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Filter by date range and export a CSV for your records.
        </p>
        <div className="mt-6">
          <ReportsClient initialSummary={summary} />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg font-medium text-ink">Detailed Reports</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Access specific reports for detailed financial information
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => (
            <Link
              key={report.id}
              href={`/admin/reports/${report.id}`}
              className="group rounded-xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-soft"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-terracotta-light text-terracotta-dark transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Icon name={report.icon} className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-ink">{report.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{report.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
