import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import { programs } from "@/data/programs";
import { programLabel } from "@/lib/utils/programLabel";
import { site } from "@/data/site";

export const metadata = {
  title: "Our Donors",
  description:
    "Every donor who has supported Vrushahi Foundation, and the programme their contribution was put toward.",
};

const PAGE_SIZE = 25;

function purposeOf(d) {
  return d.allocation?.program || d.program || "general";
}

export default async function DonorsPage({ searchParams }) {
  const params = await searchParams;
  const program = params.program || "";
  const page = Math.max(1, Number(params.page) || 1);

  await dbConnect();

  const filter = { status: "paid" };

  // Program filter has to match either the admin-assigned allocation or,
  // for donations not yet allocated, the programme recorded at entry.
  if (program) {
    filter.$or = [{ "allocation.program": program }, { program, allocation: { $exists: false } }];
  }

  const [donations, total, summary, byProgram] = await Promise.all([
    Donation.find(filter)
      .populate("donor", "name")
      .select("amount date program category allocation donor")
      .sort({ date: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Donation.countDocuments(filter),
    Donation.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          donors: { $addToSet: "$donor" },
        },
      },
    ]),
    Donation.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { $ifNull: ["$allocation.program", "$program"] },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { amount: -1 } },
    ]),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const totalRaised = summary[0]?.totalAmount || 0;
  const totalDonors = summary[0]?.donors?.length || 0;

  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="Our Donors"
        description="Every gift, acknowledged — and the programme it was put toward once we allocated it."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-3">
            <Reveal className="rounded-2xl border border-line bg-surface p-6 text-center">
              <p className="font-display text-3xl font-medium text-terracotta">
                ₹{totalRaised.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-ink-soft">Total raised</p>
            </Reveal>
            <Reveal delay={0.06} className="rounded-2xl border border-line bg-surface p-6 text-center">
              <p className="font-display text-3xl font-medium text-terracotta">{totalDonors}</p>
              <p className="mt-1 text-sm text-ink-soft">Donors</p>
            </Reveal>
            <Reveal delay={0.12} className="rounded-2xl border border-line bg-surface p-6 text-center">
              <p className="font-display text-3xl font-medium text-terracotta">{total}</p>
              <p className="mt-1 text-sm text-ink-soft">Donations recorded</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {byProgram.length > 0 && (
        <section className="border-y border-line bg-surface py-16 sm:py-20">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow="Where it went"
              title="Contributions by programme."
            />
            <div className="mt-8 space-y-3">
              {byProgram.map((p) => {
                const pct = totalRaised ? Math.round((p.amount / totalRaised) * 100) : 0;
                return (
                  <div key={p._id || "general"}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink">{programLabel(p._id)}</span>
                      <span className="text-ink-soft">
                        ₹{p.amount.toLocaleString("en-IN")} &middot; {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line/60">
                      <div
                        className="h-full rounded-full bg-terracotta"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Donor list" title="Thank you, all of you." />
            <form method="get" className="flex items-end gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Programme
                </label>
                <select
                  name="program"
                  defaultValue={program}
                  className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                >
                  <option value="">All programmes</option>
                  <option value="general">General / unallocated</option>
                  {programs.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
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
              {program && (
                <Link href="/donors" className="text-sm text-ink-faint underline">
                  Clear
                </Link>
              )}
            </form>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Contributed to</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-surface/60">
                    <td className="px-4 py-3 text-ink-soft">
                      {new Date(d.allocation?.date || d.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {d.donor?.name || "Anonymous"}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {programLabel(purposeOf(d))}
                      {!d.allocation?.program && (
                        <span className="ml-1.5 rounded-full bg-marigold-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
                          Pending allocation
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-ink">
                      ₹{d.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-ink-faint">
                      No donations to show yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const q = new URLSearchParams({ ...(program ? { program } : {}), page: String(p) });
                return (
                  <Link
                    key={p}
                    href={`/donors?${q.toString()}`}
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

          <p className="mt-8 flex items-start gap-2 text-xs text-ink-faint">
            <Icon name="ShieldCheck" className="mt-0.5 size-4 shrink-0" />
            We list donor names and amounts as a record of transparency. If
            you&apos;d rather your name not appear here, email us at{" "}
            <a href={`mailto:${site.contact.email}`} className="underline">
              {site.contact.email}
            </a>{" "}
            and we&apos;ll remove it.
          </p>
        </Container>
      </section>
    </>
  );
}
