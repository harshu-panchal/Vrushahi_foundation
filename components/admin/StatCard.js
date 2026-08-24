export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-medium text-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
