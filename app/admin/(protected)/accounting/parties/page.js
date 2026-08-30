import { dbConnect } from "@/lib/db/connect";
import Party from "@/lib/models/Party";
import EditableTable from "@/components/admin/accounting/EditableTable";
import ExportLink from "@/components/admin/ExportLink";
import Pagination from "@/components/admin/Pagination";

export const metadata = { title: "Parties — Admin" };

const PAGE_SIZE = 25;

const columns = [
  { key: "code", label: "Code", type: "number" },
  { key: "name", label: "Name", type: "text" },
  { key: "typeCode", label: "Type code", type: "number" },
  { key: "address", label: "Address", type: "text" },
  { key: "hasMultipleActivity", label: "Multiple activity", type: "checkbox" },
];

export default async function PartiesPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();
  const [docs, total] = await Promise.all([
    Party.find({})
      .sort({ code: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Party.countDocuments(),
  ]);
  const items = JSON.parse(JSON.stringify(docs));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Parties</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {total} part{total === 1 ? "y" : "ies"} — farmers, traders, suppliers
            and transporters that vouchers can post to. Type codes reference the{" "}
            <span className="font-medium">Party type</span> lookup.
          </p>
        </div>
        <ExportLink resource="parties" />
      </div>
      <div className="mt-6">
        <EditableTable
          key={page}
          apiBase="/api/admin/accounting/parties"
          columns={columns}
          initialItems={items}
          emptyLabel="No parties yet."
        />
      </div>
      <Pagination
        basePath="/admin/accounting/parties"
        params={params}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
