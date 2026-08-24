import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import { programs } from "@/data/programs";
import Icon from "@/components/Icon";

export const metadata = { title: "Donations — Admin" };

const MODES = ["cash", "bank_transfer", "upi", "cheque", "other"];
const PAGE_SIZE = 25;

function fieldClass() {
  return "rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none";
}

export default async function DonationsPage({ searchParams }) {
  const params = await searchParams;
  const { from, to, program, mode } = params;
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();

  const filter = {};
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  if (program) filter.program = program;
  if (mode) filter.mode = mode;

  const [donations, total] = await Promise.all([
    Donation.find(filter)
      .populate("donor", "name email phone")
      .sort({ date: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Donation.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportQuery = new URLSearchParams();
  if (from) exportQuery.set("from", from);
  if (to) exportQuery.set("to", to);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">
            Donations
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{total} total records</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/api/admin/reports/export?${exportQuery.toString()}`}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-ink"
          >
            Export CSV
          </a>
          <Link
            href="/admin/donations/new"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-paper hover:bg-terracotta-dark"
          >
            <Icon name="ArrowRight" className="size-4 rotate-[-45deg]" />
            Add Donation
          </Link>
        </div>
      </div>

      <form
        method="get"
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-4"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            From
          </label>
          <input type="date" name="from" defaultValue={from || ""} className={fieldClass()} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            To
          </label>
          <input type="date" name="to" defaultValue={to || ""} className={fieldClass()} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Programme
          </label>
          <select name="program" defaultValue={program || ""} className={fieldClass()}>
            <option value="">All programmes</option>
            <option value="general">General</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Mode
          </label>
          <select name="mode" defaultValue={mode || ""} className={fieldClass()}>
            <option value="">All modes</option>
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-paper"
        >
          Filter
        </button>
        {(from || to || program || mode) && (
          <Link href="/admin/donations" className="text-sm text-ink-faint underline">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Programme</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {donations.map((d) => (
              <tr key={d._id} className="hover:bg-surface/60">
                <td className="px-4 py-3 text-ink-soft">
                  {new Date(d.date).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 font-medium text-ink">
                  {d.donor?.name || "—"}
                </td>
                <td className="px-4 py-3 capitalize text-ink-soft">
                  {d.program}
                </td>
                <td className="px-4 py-3 capitalize text-ink-soft">
                  {d.mode.replace("_", " ")}
                </td>
                <td className="px-4 py-3 text-right font-medium text-ink">
                  ₹{d.amount.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/donations/${d._id}`}
                    className="text-xs font-semibold text-terracotta"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">
                  No donations match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const q = new URLSearchParams({ ...params, page: String(p) });
            return (
              <Link
                key={p}
                href={`/admin/donations?${q.toString()}`}
                className={
                  p === page
                    ? "rounded-lg bg-terracotta px-3 py-1.5 font-semibold text-paper"
                    : "rounded-lg px-3 py-1.5 text-ink-soft hover:bg-surface"
                }
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
