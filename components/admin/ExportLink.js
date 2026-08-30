import Icon from "@/components/Icon";

/** Link to the generic /api/admin/export/[resource] route; pass any current filters as `query`. */
export default function ExportLink({ resource, query }) {
  const qs = query && Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return (
    <a
      href={`/api/admin/export/${resource}${qs}`}
      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-ink"
    >
      <Icon name="ArrowUpRight" className="size-4" />
      Export Excel
    </a>
  );
}
