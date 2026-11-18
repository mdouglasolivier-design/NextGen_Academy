"use client";
import KpiCard from "@/components/staff/KpiCard";
import TodayPanel from "@/components/staff/TodayPanel";
import { useStaff } from "@/components/staff/StaffShell";

export default function StaffOverview() {
  const d = useStaff();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {d.user.name || d.user.email}</h1>
        <p className="text-sm text-gray-500">{d.role_title} · Overview</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {d.kpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <TodayPanel items={d.today} />
        <section className="rounded-lg border bg-white p-4">
          <h2 className="font-semibold">Session security</h2>
          <p className="mt-2 text-sm text-gray-600">
            Last login: {d.session.last_login ? new Date(d.session.last_login).toLocaleString() : "—"}
          </p>
          <p className="mt-1 text-xs text-gray-400">Active sessions and device list: coming soon.</p>
        </section>
      </div>
    </div>
  );
}
