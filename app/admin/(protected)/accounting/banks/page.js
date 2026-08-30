import { dbConnect } from "@/lib/db/connect";
import Bank from "@/lib/models/Bank";
import EditableTable from "@/components/admin/accounting/EditableTable";
import ExportLink from "@/components/admin/ExportLink";
import Pagination from "@/components/admin/Pagination";

export const metadata = { title: "Banks — Admin" };

const PAGE_SIZE = 25;

const columns = [
  { key: "code", label: "Code", type: "number" },
  { key: "name", label: "Bank name", type: "text" },
  { key: "shortName", label: "Short name", type: "text" },
  { key: "address", label: "Address", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "email", label: "Email", type: "text" },
];

export default async function BanksPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();
  const [docs, total] = await Promise.all([
    Bank.find({})
      .sort({ code: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Bank.countDocuments(),
  ]);
  const items = JSON.parse(JSON.stringify(docs));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Banks</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {total} bank{total === 1 ? "" : "s"} used for voucher and cheque/DD
            entries.
          </p>
        </div>
        <ExportLink resource="banks" />
      </div>
      <div className="mt-6">
        <EditableTable
          key={page}
          apiBase="/api/admin/accounting/banks"
          columns={columns}
          initialItems={items}
          emptyLabel="No banks yet."
        />
      </div>
      <Pagination
        basePath="/admin/accounting/banks"
        params={params}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
