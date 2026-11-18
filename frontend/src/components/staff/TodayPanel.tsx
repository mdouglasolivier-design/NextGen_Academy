import type { TodayItem } from "@/types/staff";

export default function TodayPanel({ items }: { items: TodayItem[] }) {
  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="font-semibold">Today</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">Nothing needs your attention right now.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.label} className="flex items-center justify-between">
              <span>{i.label}</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">{i.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
