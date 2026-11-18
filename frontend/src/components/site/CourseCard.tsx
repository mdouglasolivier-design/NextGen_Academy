import Link from "next/link";
import type { Course } from "@/types";

// Each card carries a "spine" in one of the three logo colors.
const spines = ["bg-spine-green", "bg-spine-red", "bg-spine-blue"];

export default function CourseCard({ course, index }: { course: Course; index: number }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex overflow-hidden rounded-[14px] border border-rule bg-surface transition-colors hover:border-ink"
    >
      <span className={`w-3 shrink-0 ${spines[index % spines.length]}`} aria-hidden="true" />
      <span className="flex flex-1 flex-col p-5">
        <span className="font-display text-xl font-semibold leading-tight">{course.title}</span>
        <span className="mt-2 line-clamp-3 text-[15px] text-ink-soft">{course.description}</span>
        <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-sm text-muted">
          <span className="capitalize">{course.level}</span>
          <span>{course.estimated_hours} hours</span>
          <span className="font-medium text-green-deep">{course.is_free ? "Free" : "Paid"}</span>
        </span>
      </span>
    </Link>
  );
}

export function CoursesUnavailable() {
  return (
    <div role="alert" className="rounded-[14px] border border-rule bg-surface p-6 text-ink-soft">
      <p className="font-semibold text-ink">Courses aren&rsquo;t loading right now.</p>
      <p className="mt-1">Refresh the page in a moment. If it keeps happening, the course service may be down.</p>
    </div>
  );
}