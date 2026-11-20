import { NextResponse } from "next/server";
import ContentItem, { CONTENT_CATEGORIES } from "@/lib/models/ContentItem";
import { contentItemSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";
import { CONTENT_TAGS } from "@/lib/content/tags";

// The `[category]` segment selects which list is being edited, mirroring how
// the accounting lookups routes are organised.
function readCategory(ctx) {
  return Promise.resolve(ctx.params).then(({ category }) => {
    if (!CONTENT_CATEGORIES.includes(category)) return null;
    return category;
  });
}

const handlers = listCreateHandlers({
  Model: ContentItem,
  createSchema: contentItemSchema,
  sort: { order: 1, _id: 1 },
  cacheTag: CONTENT_TAGS.items,
  async buildFilter(_searchParams, ctx) {
    return { category: await readCategory(ctx) };
  },
  async extendData(data, ctx) {
    return { ...data, category: await readCategory(ctx) };
  },
});

async function guardCategory(ctx) {
  const category = await readCategory(ctx);
  if (!category) {
    return NextResponse.json({ error: "Unknown content list" }, { status: 404 });
  }
  return null;
}

export async function GET(request, ctx) {
  return (await guardCategory(ctx)) || handlers.GET(request, ctx);
}

export async function POST(request, ctx) {
  return (await guardCategory(ctx)) || handlers.POST(request, ctx);
}
