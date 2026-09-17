import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import Trustee from "@/lib/models/Trustee";
import { trusteeUpdateSchema } from "@/lib/validation/schemas";
import { itemHandlers } from "@/lib/api/crudRoute";
import { slugify } from "@/lib/utils/slugify";

export const { DELETE } = itemHandlers({
  Model: Trustee,
  updateSchema: trusteeUpdateSchema,
});

export async function PATCH(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = trusteeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = { ...parsed.data };
  if (data.slug !== undefined) data.slug = slugify(data.slug) || undefined;
  if (data.photoUrl !== undefined) data.photoUrl = data.photoUrl || undefined;
  if (data.bio !== undefined) data.bio = data.bio || undefined;
  if (data.email !== undefined) data.email = data.email || undefined;
  if (data.phone !== undefined) data.phone = data.phone || undefined;

  await dbConnect();
  try {
    const item = await Trustee.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A trustee with this slug already exists" },
        { status: 409 }
      );
    }
    throw err;
  }
}
