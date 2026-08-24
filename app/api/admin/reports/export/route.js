import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import { toCsv } from "@/lib/utils/csv";

const COLUMNS = [
  { key: "date", label: "Date" },
  { key: "donorName", label: "Donor Name" },
  { key: "donorEmail", label: "Donor Email" },
  { key: "donorPhone", label: "Donor Phone" },
  { key: "amount", label: "Amount" },
  { key: "currency", label: "Currency" },
  { key: "mode", label: "Mode" },
  { key: "program", label: "Program" },
  { key: "referenceNote", label: "Note" },
];

export async function GET(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const filter = {};
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const donations = await Donation.find(filter)
    .populate("donor", "name email phone")
    .sort({ date: -1 })
    .lean();

  const rows = donations.map((d) => ({
    date: new Date(d.date).toISOString().slice(0, 10),
    donorName: d.donor?.name ?? "",
    donorEmail: d.donor?.email ?? "",
    donorPhone: d.donor?.phone ?? "",
    amount: d.amount,
    currency: d.currency,
    mode: d.mode,
    program: d.program,
    referenceNote: d.referenceNote ?? "",
  }));

  const csv = toCsv(COLUMNS, rows);
  const filename = `donations-${from || "all"}-to-${to || "now"}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
