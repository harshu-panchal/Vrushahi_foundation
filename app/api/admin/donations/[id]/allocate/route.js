import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import { donationAllocationSchema } from "@/lib/validation/schemas";

export async function PATCH(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = donationAllocationSchema.safeParse(body);
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

  const { program, date, note } = parsed.data;
  donation.allocation = {
    program,
    date,
    note: note || undefined,
    allocatedAt: new Date(),
  };
  await donation.save();

  return NextResponse.json({ donation });
}
