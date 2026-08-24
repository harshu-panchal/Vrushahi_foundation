import Donation from "@/lib/models/Donation";
import Donor from "@/lib/models/Donor";

/**
 * Recomputes a donor's aggregate totals from their actual donation records.
 * Called after any donation create/update/delete affecting this donor.
 * Recomputing from scratch (rather than incrementing/decrementing) keeps
 * this correct even when a donation's amount, date, or donor is edited.
 */
export async function recomputeDonorStats(donorId) {
  const [stats] = await Donation.aggregate([
    { $match: { donor: donorId } },
    {
      $group: {
        _id: "$donor",
        totalDonated: { $sum: "$amount" },
        donationCount: { $sum: 1 },
        firstDonationAt: { $min: "$date" },
        lastDonationAt: { $max: "$date" },
      },
    },
  ]);

  await Donor.findByIdAndUpdate(donorId, {
    totalDonated: stats?.totalDonated ?? 0,
    donationCount: stats?.donationCount ?? 0,
    firstDonationAt: stats?.firstDonationAt ?? null,
    lastDonationAt: stats?.lastDonationAt ?? null,
  });
}

/**
 * Finds an existing donor by id, or by email/phone, or creates a new one.
 */
export async function resolveDonor({
  donorId,
  donorName,
  donorEmail,
  donorPhone,
  donorCity,
}) {
  if (donorId) {
    const donor = await Donor.findById(donorId);
    if (!donor) throw new Error("Donor not found");
    return donor;
  }

  if (!donorName) {
    throw new Error("Either donorId or donorName is required");
  }

  const query = [];
  if (donorEmail) query.push({ email: donorEmail.toLowerCase() });
  if (donorPhone) query.push({ phone: donorPhone });

  let donor = query.length ? await Donor.findOne({ $or: query }) : null;

  if (!donor) {
    donor = await Donor.create({
      name: donorName,
      email: donorEmail || undefined,
      phone: donorPhone || undefined,
      city: donorCity || undefined,
    });
  }

  return donor;
}
