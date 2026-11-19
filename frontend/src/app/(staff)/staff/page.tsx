"use client";
import Link from "next/link";
import KpiCard from "@/components/staff/KpiCard";
import StaffCourses from "@/components/staff/StaffCourses";
import TodayPanel from "@/components/staff/TodayPanel";
import { useStaff } from "@/components/staff/StaffShell";

// Roles whose dashboard shows courses, and the section that lists them all.
const COURSE_SECTION: Record<string, string> = {
  super_admin: "courses",
  instructor: "my-courses",
  reviewer: "queue",
};

export default function StaffOverview() {
  const d = useStaff();
  const firstName = (d.user.name || d.user.email).split(" ")[0];
  const courseSection = COURSE_SECTION[d.role];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome, {firstName}</h1>
        <p className="mt-2 text-ink-soft">{d.role_title}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {d.kpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TodayPanel items={d.today} />
        <section className="rounded-[14px] border border-rule bg-surface p-5">
          <h2 className="text-xl font-bold">Your session</h2>
          <p className="mt-3 text-[15px] text-ink-soft">
            Last login: {d.session.last_login ? new Date(d.session.last_login).toLocaleString() : "not recorded"}
          </p>
          <Link href="/staff/activity" className="mt-3 inline-block text-[15px] font-semibold text-spine-blue hover:text-blue-deep">
            See your activity log
          </Link>
        </section>
      </div>

      {courseSection && (
        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold">Recent courses</h2>
            <Link href={`/staff/${courseSection}`} className="text-[15px] font-semibold text-spine-blue hover:text-blue-deep">
              See all
            </Link>
          </div>
          <StaffCourses limit={5} showInstructor={d.role !== "instructor"} />
        </section>
      )}
    </div>
  );
}
