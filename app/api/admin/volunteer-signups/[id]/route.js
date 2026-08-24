import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import VolunteerSignup from "@/lib/models/VolunteerSignup";
import { statusUpdateSchema } from "@/lib/validation/schemas";

const VALID_STATUSES = ["new", "contacted", "onboarded", "archived"];

export async function GET(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();

  const signup = await VolunteerSignup.findById(id).lean();
  if (!signup) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ signup });
}

export async function PATCH(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = statusUpdateSchema.safeParse(body);
  if (!parsed.success || !VALID_STATUSES.includes(parsed.data.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await dbConnect();

  const signup = await VolunteerSignup.findByIdAndUpdate(
    id,
    { status: parsed.data.status },
    { new: true }
  );
  if (!signup) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ signup });
}

export async function DELETE(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();

  const signup = await VolunteerSignup.findByIdAndDelete(id);
  if (!signup) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
