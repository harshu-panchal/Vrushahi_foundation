import { dbConnect } from "@/lib/db/connect";
import FinancialYear from "@/lib/models/FinancialYear";
import EditableTable from "@/components/admin/accounting/EditableTable";
import ExportLink from "@/components/admin/ExportLink";
import Pagination from "@/components/admin/Pagination";

export const metadata = { title: "Financial Years — Admin" };

const PAGE_SIZE = 25;

const columns = [
  { key: "yearCode", label: "Year", type: "text" },
  { key: "startDate", label: "Start date", type: "date" },
  { key: "endDate", label: "End date", type: "date" },
  { key: "isActive", label: "Active", type: "checkbox" },
  { key: "factoryCode", label: "Factory code", type: "text" },
];

export default async function FinancialYearsPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();
  const [docs, total] = await Promise.all([
    FinancialYear.find({})
      .sort({ startDate: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    FinancialYear.countDocuments(),
  ]);
  const items = JSON.parse(JSON.stringify(docs));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Financial Years</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {total} financial year{total === 1 ? "" : "s"}
          </p>
        </div>
        <ExportLink resource="financial-years" />
      </div>
      <div className="mt-6">
        <EditableTable
          key={page}
          apiBase="/api/admin/accounting/financial-years"
          columns={columns}
          initialItems={items}
          emptyLabel="No financial years yet."
        />
      </div>
      <Pagination
        basePath="/admin/accounting/financial-years"
        params={params}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
