import clsx from "clsx";

const styles = {
  new: "bg-terracotta-light text-terracotta-dark",
  unread: "bg-terracotta-light text-terracotta-dark",
  contacted: "bg-marigold-light text-terracotta-dark",
  read: "bg-marigold-light text-terracotta-dark",
  onboarded: "bg-forest-light text-forest",
  replied: "bg-forest-light text-forest",
  archived: "bg-surface-2 text-ink-faint",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        styles[status] || "bg-surface-2 text-ink-faint"
      )}
    >
      {status}
    </span>
  );
}
