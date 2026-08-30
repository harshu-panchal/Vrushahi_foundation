import Link from "next/link";

/** Numbered pagination links, preserving the current page's other query params. */
export default function Pagination({ basePath, params, page, totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        const query = new URLSearchParams({ ...params, page: String(p) });
        return (
          <Link
            key={p}
            href={`${basePath}?${query.toString()}`}
            className={
              p === page
                ? "rounded-lg bg-terracotta px-3 py-1.5 font-semibold text-paper"
                : "rounded-lg px-3 py-1.5 text-ink-soft hover:bg-surface"
            }
          >
            {p}
          </Link>
        );
      })}
    </div>
  );
}
