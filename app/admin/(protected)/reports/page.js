import { dbConnect } from "@/lib/db/connect";
import { getReportSummary } from "@/lib/services/reports";
import ReportsClient from "@/components/admin/ReportsClient";

export const metadata = { title: "Reports — Admin" };

export default async function ReportsPage() {
  await dbConnect();
  const summary = await getReportSummary();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Reports</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Filter by date range and export a CSV for your records.
      </p>
      <div className="mt-6">
        <ReportsClient initialSummary={summary} />
      </div>
    </div>
  );
}
