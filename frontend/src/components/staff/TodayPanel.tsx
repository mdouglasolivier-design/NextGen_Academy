import type { TodayItem } from "@/types/staff";

export default function TodayPanel({ items }: { items: TodayItem[] }) {
  return (
    <section className="rounded-[14px] border border-rule bg-surface p-5">
      <h2 className="text-xl font-bold">Needs your attention</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-[15px] text-ink-soft">Nothing needs your attention right now.</p>
      ) : (
        <ul className="mt-3 divide-y divide-rule text-[15px]">
          {items.map((i) => (
            <li key={i.label} className="flex items-center justify-between gap-4 py-2.5">
              <span>{i.label}</span>
              <span className="min-w-8 rounded-full bg-spine-blue/10 px-2.5 py-0.5 text-center font-semibold text-blue-deep">
                {i.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
