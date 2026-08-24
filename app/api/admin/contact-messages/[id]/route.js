import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import ContactMessage from "@/lib/models/ContactMessage";
import { statusUpdateSchema } from "@/lib/validation/schemas";

const VALID_STATUSES = ["new", "read", "replied", "archived"];

export async function GET(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();

  const message = await ContactMessage.findById(id).lean();
  if (!message) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message });
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

  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { status: parsed.data.status },
    { new: true }
  );
  if (!message) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message });
}

export async function DELETE(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();

  const message = await ContactMessage.findByIdAndDelete(id);
  if (!message) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
