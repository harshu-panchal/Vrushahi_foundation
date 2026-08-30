import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import Voucher from "@/lib/models/Voucher";
import { voucherUpdateSchema } from "@/lib/validation/schemas";

export async function GET(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();
  const item = await Voucher.findById(id).lean();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = voucherUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.lines) {
    const debit = data.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const credit = data.lines.reduce((sum, l) => sum + (l.credit || 0), 0);
    if (Math.abs(debit - credit) >= 0.01) {
      return NextResponse.json(
        { error: "Total debit must equal total credit" },
        { status: 400 }
      );
    }
  }

  await dbConnect();
  const item = await Voucher.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  await dbConnect();
  const item = await Voucher.findByIdAndDelete(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
