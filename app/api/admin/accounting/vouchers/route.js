import Voucher from "@/lib/models/Voucher";
import { voucherSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";
import { dbConnect } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { NextResponse } from "next/server";

const { POST } = listCreateHandlers({
  Model: Voucher,
  createSchema: voucherSchema,
  sort: { date: -1 },
});

export { POST };

export async function GET(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const yearCode = searchParams.get("yearCode");
  const voucherTypeCode = searchParams.get("voucherTypeCode");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(searchParams.get("limit")) || 25);

  const filter = {};
  if (yearCode) filter.yearCode = yearCode;
  if (voucherTypeCode) filter.voucherTypeCode = Number(voucherTypeCode);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const [items, total] = await Promise.all([
    Voucher.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Voucher.countDocuments(filter),
  ]);

  return NextResponse.json({ items, total, page, limit });
}
