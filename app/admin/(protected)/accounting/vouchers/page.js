import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import Voucher from "@/lib/models/Voucher";
import Icon from "@/components/Icon";
import ExportLink from "@/components/admin/ExportLink";
import Pagination from "@/components/admin/Pagination";

export const metadata = { title: "Vouchers — Admin" };

const PAGE_SIZE = 25;

export default async function VouchersPage({ searchParams }) {
  const params = await searchParams;
  const { yearCode, from, to } = params;
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();

  const filter = {};
  if (yearCode) filter.yearCode = yearCode;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const [vouchers, total] = await Promise.all([
    Voucher.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Voucher.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Vouchers</h1>
          <p className="mt-1 text-sm text-ink-soft">{total} total records</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportLink resource="vouchers" query={{ ...(yearCode && { yearCode }), ...(from && { from }), ...(to && { to }) }} />
          <Link
            href="/admin/accounting/vouchers/new"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-paper hover:bg-terracotta-dark"
          >
            <Icon name="ArrowRight" className="size-4 rotate-[-45deg]" />
            New Voucher
          </Link>
        </div>
      </div>

      <form
        method="get"
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-4"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Year
          </label>
          <input
            name="yearCode"
            defaultValue={yearCode || ""}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            From
          </label>
          <input
            type="date"
            name="from"
            defaultValue={from || ""}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            To
          </label>
          <input
            type="date"
            name="to"
            defaultValue={to || ""}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-paper"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Voucher #</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Narration</th>
              <th className="px-4 py-3 text-right">Debit / Credit</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {vouchers.map((v) => {
              const debit = v.lines?.reduce((s, l) => s + (l.debit || 0), 0) || 0;
              const credit = v.lines?.reduce((s, l) => s + (l.credit || 0), 0) || 0;
              return (
                <tr key={v._id} className="hover:bg-surface/60">
                  <td className="px-4 py-3 text-ink-soft">
                    {new Date(v.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{v.yearCode}</td>
                  <td className="px-4 py-3 font-medium text-ink">{v.voucherNumber}</td>
                  <td className="px-4 py-3 text-ink-soft">{v.voucherTypeCode}</td>
                  <td className="px-4 py-3 text-ink-soft">{v.narration || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium text-ink">
                    ₹{debit.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/accounting/vouchers/${v._id}`}
                      className="text-xs font-semibold text-terracotta"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
            {vouchers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-faint">
                  No vouchers match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        basePath="/admin/accounting/vouchers"
        params={params}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
