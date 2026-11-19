export default function KpiCard({ label, value }: { label: string; value: number | null }) {
  const tracked = value !== null && value !== undefined;
  return (
    <div className="rounded-[14px] border border-rule bg-surface p-5">
      <p className="text-[15px] text-ink-soft">{label}</p>
      <p className={`mt-2 font-display text-4xl font-bold ${tracked ? "" : "text-muted"}`}>{tracked ? value : "–"}</p>
      {!tracked && <p className="mt-1 text-sm text-muted">Not tracked yet</p>}
    </div>
  );
}
