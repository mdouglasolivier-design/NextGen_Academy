export default function KpiCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value === null || value === undefined ? "—" : value}</p>
    </div>
  );
}
