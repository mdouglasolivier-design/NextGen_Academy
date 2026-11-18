import type { Metadata } from "next";
import Link from "next/link";
import CourseCard, { CoursesUnavailable } from "@/components/site/CourseCard";
import { getCourses } from "@/lib/api/courses";

export const metadata: Metadata = { title: "Courses" };

export default async function CoursesPage() {
  const { data: courses, error } = await getCourses();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl font-bold sm:text-5xl">Courses</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Every course is free. Pass the final assessment to earn a certificate.
      </p>

      <div className="mt-10">
        {error ? (
          <CoursesUnavailable />
        ) : courses.length === 0 ? (
          <div className="rounded-[14px] border border-rule bg-surface p-8">
            <p className="font-display text-xl font-semibold">No courses are published yet.</p>
            <p className="mt-2 text-ink-soft">
              Create an account now and you&rsquo;ll be ready to enroll when the first course opens.
            </p>
            <Link href="/register" className="mt-4 inline-block font-semibold text-spine-blue hover:text-blue-deep">
              Create free account
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}