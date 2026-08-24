import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import "@/lib/models/Donor";
import { donationUpdateSchema } from "@/lib/validation/schemas";
import { resolveDonor, recomputeDonorStats } from "@/lib/services/donorStats";

export async function GET(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();

  const donation = await Donation.findById(id).populate(
    "donor",
    "name email phone city"
  );
  if (!donation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ donation });
}

export async function PATCH(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = donationUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await dbConnect();

  const donation = await Donation.findById(id);
  if (!donation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = parsed.data;
  const previousDonorId = donation.donor;

  if (data.donorId || data.donorName) {
    const donor = await resolveDonor({
      donorId: data.donorId,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      donorCity: data.donorCity,
    });
    donation.donor = donor._id;
  }

  if (data.amount !== undefined) donation.amount = data.amount;
  if (data.currency !== undefined) donation.currency = data.currency;
  if (data.mode !== undefined) donation.mode = data.mode;
  if (data.program !== undefined) donation.program = data.program || "general";
  if (data.date !== undefined) donation.date = data.date;
  if (data.referenceNote !== undefined)
    donation.referenceNote = data.referenceNote || undefined;

  await donation.save();

  const donorChanged = String(previousDonorId) !== String(donation.donor);
  await recomputeDonorStats(donation.donor);
  if (donorChanged) {
    await recomputeDonorStats(previousDonorId);
  }

  return NextResponse.json({ donation });
}

export async function DELETE(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();

  const donation = await Donation.findByIdAndDelete(id);
  if (!donation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await recomputeDonorStats(donation.donor);

  return NextResponse.json({ ok: true });
}
