import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/connect";
import Donor from "@/lib/models/Donor";
import Donation from "@/lib/models/Donation";
import StatCard from "@/components/admin/StatCard";
import DonorEditForm from "@/components/admin/DonorEditForm";

export const metadata = { title: "Donor — Admin" };

export default async function DonorDetailPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const donorDoc = await Donor.findById(id).lean();
  if (!donorDoc) notFound();
  const donor = JSON.parse(JSON.stringify(donorDoc));

  const donationsDoc = await Donation.find({ donor: id })
    .sort({ date: -1 })
    .lean();
  const donations = JSON.parse(JSON.stringify(donationsDoc));

  return (
    <div>
      <Link href="/admin/donors" className="text-sm text-ink-faint hover:text-terracotta">
        &larr; All donors
      </Link>
      <h1 className="mt-2 font-display text-2xl font-medium text-ink">
        {donor.name}
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total given" value={`₹${donor.totalDonated.toLocaleString("en-IN")}`} />
        <StatCard label="Donations" value={donor.donationCount} />
        <StatCard
          label="Last gift"
          value={
            donor.lastDonationAt
              ? new Date(donor.lastDonationAt).toLocaleDateString("en-IN")
              : "—"
          }
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg font-medium text-ink">
            Details
          </h2>
          <DonorEditForm donorId={id} initial={donor} />
        </div>

        <div>
          <h2 className="mb-3 font-display text-lg font-medium text-ink">
            Donation history
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Programme</th>
                  <th className="px-3 py-2">Mode</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {donations.map((d) => (
                  <tr key={d._id}>
                    <td className="px-3 py-2 text-ink-soft">
                      <Link
                        href={`/admin/donations/${d._id}`}
                        className="hover:text-terracotta"
                      >
                        {new Date(d.date).toLocaleDateString("en-IN")}
                      </Link>
                    </td>
                    <td className="px-3 py-2 capitalize text-ink-soft">
                      {d.program}
                    </td>
                    <td className="px-3 py-2 capitalize text-ink-soft">
                      {d.mode.replace("_", " ")}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-ink">
                      ₹{d.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-ink-faint">
                      No donations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
