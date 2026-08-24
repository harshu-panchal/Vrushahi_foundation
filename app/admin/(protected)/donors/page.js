import Link from "next/link";
import { dbConnect } from "@/lib/db/connect";
import Donor from "@/lib/models/Donor";

export const metadata = { title: "Donors — Admin" };

const PAGE_SIZE = 25;

export default async function DonorsPage({ searchParams }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();

  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const [donors, total] = await Promise.all([
    Donor.find(filter)
      .sort({ lastDonationAt: -1, createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Donor.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Donors</h1>
      <p className="mt-1 text-sm text-ink-soft">{total} donors on record</p>

      <form method="get" className="mt-6 flex gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Search by name, email, or phone"
          className="w-full max-w-sm rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-paper"
        >
          Search
        </button>
        {q && (
          <Link href="/admin/donors" className="self-center text-sm text-ink-faint underline">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Total Given</th>
              <th className="px-4 py-3 text-right">Donations</th>
              <th className="px-4 py-3">Last Gift</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {donors.map((donor) => (
              <tr key={donor._id} className="hover:bg-surface/60">
                <td className="px-4 py-3 font-medium text-ink">{donor.name}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {[donor.email, donor.phone].filter(Boolean).join(" · ") || "—"}
                </td>
                <td className="px-4 py-3 text-right font-medium text-ink">
                  ₹{donor.totalDonated.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right text-ink-soft">
                  {donor.donationCount}
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {donor.lastDonationAt
                    ? new Date(donor.lastDonationAt).toLocaleDateString("en-IN")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/donors/${donor._id}`}
                    className="text-xs font-semibold text-terracotta"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {donors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">
                  No donors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const query = new URLSearchParams({ ...params, page: String(p) });
            return (
              <Link
                key={p}
                href={`/admin/donors?${query.toString()}`}
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
