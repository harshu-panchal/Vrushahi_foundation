import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import Donor from "@/lib/models/Donor";
import Donation from "@/lib/models/Donation";
import { donorUpdateSchema } from "@/lib/validation/schemas";

export async function GET(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();

  const donor = await Donor.findById(id).lean();
  if (!donor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const donations = await Donation.find({ donor: id })
    .sort({ date: -1 })
    .lean();

  return NextResponse.json({ donor, donations });
}

export async function PATCH(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = donorUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await dbConnect();

  const data = { ...parsed.data };
  if (data.email !== undefined) data.email = data.email || undefined;
  if (data.phone !== undefined) data.phone = data.phone || undefined;
  if (data.city !== undefined) data.city = data.city || undefined;
  if (data.notes !== undefined) data.notes = data.notes || undefined;

  const donor = await Donor.findByIdAndUpdate(id, data, { new: true });
  if (!donor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ donor });
}
