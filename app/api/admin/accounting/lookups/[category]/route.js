import { NextResponse } from "next/server";
import LookupItem, { LOOKUP_CATEGORIES } from "@/lib/models/LookupItem";
import { lookupItemSchema } from "@/lib/validation/schemas";
import { listCreateHandlers } from "@/lib/api/crudRoute";

const { GET: rawGET, POST: rawPOST } = listCreateHandlers({
  Model: LookupItem,
  createSchema: lookupItemSchema,
  sort: { code: 1 },
  buildFilter: async (_searchParams, { params }) => {
    const { category } = await params;
    return { category };
  },
  extendData: async (data, { params }) => {
    const { category } = await params;
    return { ...data, category };
  },
});

function guardCategory(category) {
  if (!LOOKUP_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Unknown lookup category" }, { status: 404 });
  }
  return null;
}

export async function GET(request, ctx) {
  const { category } = await ctx.params;
  const bad = guardCategory(category);
  if (bad) return bad;
  return rawGET(request, ctx);
}

export async function POST(request, ctx) {
  const { category } = await ctx.params;
  const bad = guardCategory(category);
  if (bad) return bad;
  return rawPOST(request, ctx);
}
