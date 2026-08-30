import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/apiGuard";
import { buildXlsxResponse } from "@/lib/utils/excel";
import { EXPORT_RESOURCES } from "@/lib/export/resources";

export async function GET(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { resource } = await params;
  const config = EXPORT_RESOURCES[resource];
  if (!config) {
    return NextResponse.json({ error: "Unknown export resource" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const rows = await config.fetch(searchParams);
  return buildXlsxResponse(config.columns, rows, config.filename(searchParams));
}
