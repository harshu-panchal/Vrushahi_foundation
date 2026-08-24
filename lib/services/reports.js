import Donation from "@/lib/models/Donation";
import VolunteerSignup from "@/lib/models/VolunteerSignup";
import ContactMessage from "@/lib/models/ContactMessage";

export async function getReportSummary({ from, to } = {}) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const trendStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const rangeMatch = {};
  if (from || to) {
    rangeMatch.date = {};
    if (from) rangeMatch.date.$gte = new Date(from);
    if (to) rangeMatch.date.$lte = new Date(to);
  }

  const [facetResult] = await Donation.aggregate([
    {
      $facet: {
        rangeTotals: [
          { $match: rangeMatch },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              donationCount: { $sum: 1 },
              donors: { $addToSet: "$donor" },
            },
          },
        ],
        thisMonth: [
          { $match: { date: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ],
        thisYear: [
          { $match: { date: { $gte: startOfYear } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ],
        monthlyTrend: [
          { $match: from || to ? rangeMatch : { date: { $gte: trendStart } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ],
        byProgram: [
          { $match: rangeMatch },
          {
            $group: {
              _id: "$program",
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
        ],
        byMode: [
          { $match: rangeMatch },
          {
            $group: {
              _id: "$mode",
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
        ],
      },
    },
  ]);

  const [pendingVolunteers, unreadMessages] = await Promise.all([
    VolunteerSignup.countDocuments({ status: "new" }),
    ContactMessage.countDocuments({ status: "new" }),
  ]);

  const rangeTotals = facetResult.rangeTotals[0] || {
    totalAmount: 0,
    donationCount: 0,
    donors: [],
  };

  return {
    totalAmount: rangeTotals.totalAmount,
    donationCount: rangeTotals.donationCount,
    donorCount: rangeTotals.donors.length,
    thisMonthAmount: facetResult.thisMonth[0]?.total ?? 0,
    thisYearAmount: facetResult.thisYear[0]?.total ?? 0,
    monthlyTrend: facetResult.monthlyTrend.map((row) => ({
      month: row._id,
      total: row.total,
    })),
    byProgram: facetResult.byProgram.map((row) => ({
      program: row._id,
      total: row.total,
      count: row.count,
    })),
    byMode: facetResult.byMode.map((row) => ({
      mode: row._id,
      total: row.total,
      count: row.count,
    })),
    pendingVolunteers,
    unreadMessages,
  };
}
