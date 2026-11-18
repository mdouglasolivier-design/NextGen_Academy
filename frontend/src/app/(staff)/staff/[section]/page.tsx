"use client";
import { useParams } from "next/navigation";
import { useStaff } from "@/components/staff/StaffShell";

export default function SectionPage() {
  const { section } = useParams<{ section: string }>();
  const d = useStaff();
  const current = d.sections.find((s) => s.key === section);
  if (!current) return <p>Section not found for your role.</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{current.label}</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {current.items.map((item) => (
          <div key={item} className="rounded-lg border bg-white p-4">
            <p className="text-sm font-medium">{item}</p>
            <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Coming soon</span>
          </div>
        ))}
      </div>
    </div>
  );
}
