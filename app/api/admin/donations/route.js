import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import { donationInputSchema } from "@/lib/validation/schemas";
import { resolveDonor, recomputeDonorStats } from "@/lib/services/donorStats";

export async function GET(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const program = searchParams.get("program");
  const mode = searchParams.get("mode");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(searchParams.get("limit")) || 25);

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
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Donation.countDocuments(filter),
  ]);

  return NextResponse.json({ donations, total, page, limit });
}

export async function POST(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await request.json().catch(() => null);
  const parsed = donationInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await dbConnect();

  const data = parsed.data;
  const donor = await resolveDonor({
    donorId: data.donorId,
    donorName: data.donorName,
    donorEmail: data.donorEmail,
    donorPhone: data.donorPhone,
    donorCity: data.donorCity,
  });

  const donation = await Donation.create({
    donor: donor._id,
    amount: data.amount,
    currency: data.currency || "INR",
    mode: data.mode,
    program: data.program || "general",
    date: data.date,
    referenceNote: data.referenceNote || undefined,
  });

  await recomputeDonorStats(donor._id);

  return NextResponse.json({ donation }, { status: 201 });
}
