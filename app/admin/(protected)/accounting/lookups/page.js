import Link from "next/link";
import clsx from "clsx";
import { dbConnect } from "@/lib/db/connect";
import LookupItem, { LOOKUP_CATEGORIES } from "@/lib/models/LookupItem";
import EditableTable from "@/components/admin/accounting/EditableTable";
import ExportLink from "@/components/admin/ExportLink";
import Pagination from "@/components/admin/Pagination";

export const metadata = { title: "Chart-of-Accounts Lookups — Admin" };

const PAGE_SIZE = 50;

const CATEGORY_LABELS = {
  accountGroupType: "Group type (Balance Sheet / P&L)",
  accountALIE: "Assets / Liabilities / Income / Expenditure",
  accountGroup: "Account group",
  accountSubGroup: "Account sub-group",
  accountSubSubGroup: "Account sub-sub-group",
  scheduleGroupType: "Schedule group type",
  division: "Division",
  costCenter: "Cost center",
  course: "Course",
  farmType: "Farm type",
  fixedAssetType: "Fixed asset type",
  voucherType: "Voucher type",
  subVoucherType: "Sub voucher type",
  chequeDdType: "Cheque / DD type",
  draweeBank: "Drawee bank",
  partyType: "Party type",
  partyTypeResource: "Party type resource",
};

const columns = [
  { key: "code", label: "Code", type: "number" },
  { key: "name", label: "Name", type: "text" },
  { key: "parentCode", label: "Parent code", type: "number" },
];

export default async function LookupsPage({ searchParams }) {
  const params = await searchParams;
  const category = LOOKUP_CATEGORIES.includes(params.category)
    ? params.category
    : LOOKUP_CATEGORIES[0];
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();
  const [docs, total] = await Promise.all([
    LookupItem.find({ category })
      .sort({ code: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    LookupItem.countDocuments({ category }),
  ]);
  const items = JSON.parse(JSON.stringify(docs));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">
            Chart-of-Accounts Lookups
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Small reference tables (voucher types, cheque/DD types, divisions,
            party types, and the account group hierarchy) used across the
            accounting module.
          </p>
        </div>
        <ExportLink resource="lookups" query={{ category }} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {LOOKUP_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/admin/accounting/lookups?category=${cat}`}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              cat === category
                ? "border-terracotta bg-terracotta text-paper"
                : "border-line text-ink-soft hover:border-ink"
            )}
          >
            {CATEGORY_LABELS[cat] || cat}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <EditableTable
          key={`${category}-${page}`}
          apiBase={`/api/admin/accounting/lookups/${category}`}
          columns={columns}
          initialItems={items}
          emptyLabel="No entries in this lookup yet."
        />
      </div>

      <Pagination
        basePath="/admin/accounting/lookups"
        params={params}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
