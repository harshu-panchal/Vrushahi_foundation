import { dbConnect } from "@/lib/db/connect";
import Ledger from "@/lib/models/Ledger";
import EditableTable from "@/components/admin/accounting/EditableTable";
import ExportLink from "@/components/admin/ExportLink";
import Pagination from "@/components/admin/Pagination";

export const metadata = { title: "Chart of Accounts — Admin" };

const PAGE_SIZE = 25;

const columns = [
  { key: "code", label: "Code", type: "number" },
  { key: "name", label: "Ledger name", type: "text" },
  { key: "groupCode", label: "Group code", type: "number" },
  { key: "subGroupCode", label: "Sub-group code", type: "number" },
  { key: "subSubGroupCode", label: "Sub-sub-group code", type: "number" },
  { key: "divisionCode", label: "Division code", type: "number" },
  { key: "isProfitLoss", label: "P&L account", type: "checkbox" },
];

export default async function LedgersPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();
  const [docs, total] = await Promise.all([
    Ledger.find({})
      .sort({ code: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Ledger.countDocuments(),
  ]);
  const items = JSON.parse(JSON.stringify(docs));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Chart of Accounts</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {total} ledger{total === 1 ? "" : "s"} — the account codes vouchers post
            against. Group/sub-group codes reference{" "}
            <span className="font-medium">Lookups</span>.
          </p>
        </div>
        <ExportLink resource="ledgers" />
      </div>
      <div className="mt-6">
        <EditableTable
          key={page}
          apiBase="/api/admin/accounting/ledgers"
          columns={columns}
          initialItems={items}
          emptyLabel="No ledgers yet."
        />
      </div>
      <Pagination
        basePath="/admin/accounting/ledgers"
        params={params}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
