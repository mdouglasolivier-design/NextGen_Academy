"use client";
import { useParams } from "next/navigation";
import StaffCourses from "@/components/staff/StaffCourses";
import { useStaff } from "@/components/staff/StaffShell";

// Sections that already show real data. Every other section lists what is planned.
const COURSE_VIEWS: Record<string, { intro: string; status?: "draft" | "published"; empty: string }> = {
  courses: {
    intro: "Every course on the platform, drafts included.",
    empty: "No courses yet. Run the demo seed or add a course in the admin.",
  },
  "my-courses": {
    intro: "The courses you created.",
    empty: "You haven't created a course yet.",
  },
  queue: {
    intro: "Draft courses waiting for a review.",
    status: "draft",
    empty: "No courses are waiting for review.",
  },
};

export default function SectionPage() {
  const { section } = useParams<{ section: string }>();
  const d = useStaff();
  const current = d.sections.find((s) => s.key === section);

  if (!current) {
    return (
      <div>
        <h1 className="text-3xl font-bold">That page isn&rsquo;t part of your role.</h1>
        <p className="mt-2 text-ink-soft">Use the menu to open one of your sections.</p>
      </div>
    );
  }

  const view = COURSE_VIEWS[current.key];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{current.label}</h1>
        {view && <p className="mt-2 text-ink-soft">{view.intro}</p>}
      </div>

      {view && <StaffCourses status={view.status} showInstructor={d.role !== "instructor"} empty={view.empty} />}

      <section>
        <h2 className="text-2xl font-bold">{view ? "Planned for this section" : "Planned features"}</h2>
        <p className="mt-1 text-[15px] text-ink-soft">These are not built yet. They will appear here as they are added.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {current.items.map((item) => (
            <li key={item} className="flex items-start justify-between gap-3 rounded-[14px] border border-rule bg-surface p-4">
              <span className="text-[15px]">{item}</span>
              <span className="shrink-0 rounded-full bg-ink/[0.07] px-2.5 py-0.5 text-sm text-ink-soft">Planned</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
