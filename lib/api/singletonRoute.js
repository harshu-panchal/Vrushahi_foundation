import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import { revalidateContent } from "@/lib/content/revalidate";

/**
 * Builds GET + PUT handlers for a one-document collection (site settings,
 * the founder profile, a page's copy). The PUT upserts, so the first save
 * creates the document — no separate "create" step and no empty-state
 * handling needed in the admin UI.
 */
export function singletonHandlers({ Model, filter, schema, cacheTag }) {
  async function GET() {
    const unauth = await requireAdmin();
    if (unauth) return unauth;

    await dbConnect();
    const item = await Model.findOne(filter).lean();
    return NextResponse.json({ item: item || null });
  }

  async function PUT(request) {
    const unauth = await requireAdmin();
    if (unauth) return unauth;

    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();
    const item = await Model.findOneAndUpdate(
      filter,
      { $set: { ...parsed.data, ...filter } },
      { returnDocument: "after", upsert: true, runValidators: true }
    ).lean();

    if (cacheTag) revalidateContent(cacheTag);
    return NextResponse.json({ item });
  }

  return { GET, PUT };
}
