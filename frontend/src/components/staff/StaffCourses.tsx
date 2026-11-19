"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { staffApi } from "@/lib/staff/api";
import type { StaffCourse } from "@/types/staff";

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function StatusChip({ status }: { status: StaffCourse["status"] }) {
  return status === "published" ? (
    <span className="rounded-full bg-spine-green/10 px-2.5 py-0.5 text-sm font-medium text-green-deep">Published</span>
  ) : (
    <span className="rounded-full bg-ink/[0.07] px-2.5 py-0.5 text-sm font-medium text-ink-soft">Draft</span>
  );
}

/** Course list for staff, fetched from the backend. `status` filters; `limit` shortens it for overview panels. */
export default function StaffCourses({
  status,
  limit,
  showInstructor = true,
  empty = "There are no courses here yet.",
}: {
  status?: "draft" | "published";
  limit?: number;
  showInstructor?: boolean;
  empty?: string;
}) {
  const [rows, setRows] = useState<StaffCourse[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    staffApi<StaffCourse[]>(`/staff/courses/${status ? `?status=${status}` : ""}`)
      .then(setRows)
      .catch(() => setFailed(true));
  }, [status]);

  if (failed) {
    return (
      <div role="alert" className="rounded-[14px] border border-rule bg-surface p-5 text-ink-soft">
        <p className="font-semibold text-ink">Courses aren&rsquo;t loading right now.</p>
        <p className="mt-1">Refresh the page. If it keeps happening, check that the backend is running.</p>
      </div>
    );
  }
  if (!rows) return <p className="text-muted" role="status">Loading courses&hellip;</p>;
  if (rows.length === 0) {
    return <p className="rounded-[14px] border border-rule bg-surface p-5 text-ink-soft">{empty}</p>;
  }

  const shown = limit ? rows.slice(0, limit) : rows;
  return (
    <div className="overflow-x-auto rounded-[14px] border border-rule bg-surface">
      <table className="w-full min-w-[640px] text-left text-[15px]">
        <thead className="border-b border-rule text-sm text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Course</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {showInstructor && <th className="px-4 py-3 font-medium">Instructor</th>}
            <th className="px-4 py-3 font-medium">Content</th>
            <th className="px-4 py-3 font-medium">Learners</th>
            <th className="px-4 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {shown.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3">
                <p className="font-medium">{c.title}</p>
                <p className="text-sm capitalize text-muted">
                  {c.level}, {c.estimated_hours} hours
                  {c.status === "published" && (
                    <>
                      {" "}
                      <Link href={`/courses/${c.slug}`} className="font-medium normal-case text-spine-blue hover:text-blue-deep">
                        View page
                      </Link>
                    </>
                  )}
                </p>
              </td>
              <td className="px-4 py-3"><StatusChip status={c.status} /></td>
              {showInstructor && <td className="px-4 py-3 text-ink-soft">{c.instructor ?? "Not assigned"}</td>}
              <td className="px-4 py-3 text-ink-soft">
                {c.modules} {c.modules === 1 ? "module" : "modules"}, {c.lessons} {c.lessons === 1 ? "lesson" : "lessons"}
              </td>
              <td className="px-4 py-3 text-ink-soft">
                {c.learners} enrolled{c.learners > 0 && `, ${c.completed} finished`}
              </td>
              <td className="px-4 py-3 text-ink-soft">{date(c.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
