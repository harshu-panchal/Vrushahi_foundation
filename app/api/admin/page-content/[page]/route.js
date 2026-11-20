import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import PageContent, { CONTENT_PAGES } from "@/lib/models/PageContent";
import { pageContentSchema } from "@/lib/validation/schemas";
import { revalidateContent } from "@/lib/content/revalidate";
import { CONTENT_TAGS } from "@/lib/content/tags";

// One document per public page, keyed by the `[page]` segment. Written as a
// whole blocks array rather than per-block, which keeps the admin form a
// simple save-everything submit.
async function resolvePage(params) {
  const { page } = await params;
  return CONTENT_PAGES.includes(page) ? page : null;
}

export async function GET(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const page = await resolvePage(params);
  if (!page) return NextResponse.json({ error: "Unknown page" }, { status: 404 });

  await dbConnect();
  const item = await PageContent.findOne({ page }).lean();
  return NextResponse.json({ item: item || null });
}

export async function PUT(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const page = await resolvePage(params);
  if (!page) return NextResponse.json({ error: "Unknown page" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = pageContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await dbConnect();
  const item = await PageContent.findOneAndUpdate(
    { page },
    { $set: { page, blocks: parsed.data.blocks } },
    { returnDocument: "after", upsert: true, runValidators: true }
  ).lean();

  revalidateContent(CONTENT_TAGS.pages);
  return NextResponse.json({ item });
}
