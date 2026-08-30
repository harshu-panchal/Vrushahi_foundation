import { dbConnect } from "@/lib/db/connect";
import OpeningBalance from "@/lib/models/OpeningBalance";
import EditableTable from "@/components/admin/accounting/EditableTable";
import ExportLink from "@/components/admin/ExportLink";
import Pagination from "@/components/admin/Pagination";

export const metadata = { title: "Opening Balances — Admin" };

const PAGE_SIZE = 25;

const columns = [
  { key: "yearCode", label: "Year", type: "text" },
  {
    key: "scope",
    label: "Scope",
    type: "select",
    options: [
      { value: "ledger", label: "Ledger" },
      { value: "party", label: "Party" },
    ],
  },
  { key: "ledgerCode", label: "Ledger code", type: "number" },
  { key: "partyCode", label: "Party code", type: "number" },
  { key: "amount", label: "Amount", type: "number" },
];

export default async function OpeningBalancesPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();
  const [docs, total] = await Promise.all([
    OpeningBalance.find({})
      .sort({ yearCode: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    OpeningBalance.countDocuments(),
  ]);
  const items = JSON.parse(JSON.stringify(docs));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Opening Balances</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {total} balance{total === 1 ? "" : "s"} carried over from the legacy
            system, seeding ledgers/parties before new vouchers post.
          </p>
        </div>
        <ExportLink resource="opening-balances" />
      </div>
      <div className="mt-6">
        <EditableTable
          key={page}
          apiBase="/api/admin/accounting/opening-balances"
          columns={columns}
          initialItems={items}
          emptyLabel="No opening balances yet."
        />
      </div>
      <Pagination
        basePath="/admin/accounting/opening-balances"
        params={params}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
