import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { dbConnect } from "@/lib/db/connect";
import { revalidateContent } from "@/lib/content/revalidate";

/**
 * Builds GET (list) + POST (create) handlers for a simple admin-managed
 * collection. `buildFilter` and `extendData` let a route inject extra
 * fields (e.g. the `category` segment for lookups) without duplicating
 * the auth/db/validation boilerplate six times over.
 *
 * `cacheTag` is for resources that feed the public site: passing one makes
 * a successful write invalidate the matching cached reads in
 * lib/content/read.js. Accounting resources omit it — nothing public reads
 * them, so there is nothing to invalidate.
 */
export function listCreateHandlers({
  Model,
  createSchema,
  sort = { _id: -1 },
  buildFilter,
  extendData,
  cacheTag,
}) {
  async function GET(request, ctx) {
    const unauth = await requireAdmin();
    if (unauth) return unauth;

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const filter = buildFilter ? await buildFilter(searchParams, ctx) : {};
    const items = await Model.find(filter).sort(sort).lean();
    return NextResponse.json({ items });
  }

  async function POST(request, ctx) {
    const unauth = await requireAdmin();
    if (unauth) return unauth;

    const body = await request.json().catch(() => null);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();
    const data = extendData ? await extendData(parsed.data, ctx) : parsed.data;

    try {
      const item = await Model.create(data);
      if (cacheTag) revalidateContent(cacheTag);
      return NextResponse.json({ item }, { status: 201 });
    } catch (err) {
      if (err.code === 11000) {
        return NextResponse.json(
          { error: "A record with these values already exists" },
          { status: 409 }
        );
      }
      throw err;
    }
  }

  return { GET, POST };
}

/** Builds PATCH (update) + DELETE handlers for a single record by id. */
export function itemHandlers({ Model, updateSchema, cacheTag }) {
  async function PATCH(request, { params }) {
    const unauth = await requireAdmin();
    if (unauth) return unauth;

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();
    try {
      const item = await Model.findByIdAndUpdate(id, parsed.data, {
        returnDocument: "after",
        runValidators: true,
      });
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (cacheTag) revalidateContent(cacheTag);
      return NextResponse.json({ item });
    } catch (err) {
      if (err.code === 11000) {
        return NextResponse.json(
          { error: "A record with these values already exists" },
          { status: 409 }
        );
      }
      throw err;
    }
  }

  async function DELETE(request, { params }) {
    const unauth = await requireAdmin();
    if (unauth) return unauth;

    const { id } = await params;
    await dbConnect();
    const item = await Model.findByIdAndDelete(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (cacheTag) revalidateContent(cacheTag);
    return NextResponse.json({ ok: true });
  }

  return { PATCH, DELETE };
}
