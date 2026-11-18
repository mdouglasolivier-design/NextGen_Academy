import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { getCourse } from "@/lib/api/courses";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getCourse(slug);
  return { title: data?.title ?? "Course" };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const { data: course, error } = await getCourse(slug);

  if (error === "not_found") notFound();
  if (!course) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-3xl font-bold">This course isn&rsquo;t loading.</h1>
        <p className="mt-3 text-ink-soft">Refresh the page in a moment, or go back to all courses.</p>
        <Link href="/courses" className="mt-4 inline-block font-semibold text-spine-blue hover:text-blue-deep">
          Back to courses
        </Link>
      </main>
    );
  }

  const modules = [...course.modules].sort((a, b) => a.position - b.position);
  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <Link href="/courses" className="text-[15px] font-medium text-ink-soft hover:text-ink">
        All courses
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">{course.title}</h1>
          <p className="mt-5 max-w-2xl whitespace-pre-line text-lg text-ink-soft">{course.description}</p>

          <h2 className="mt-12 text-2xl font-bold">What&rsquo;s inside</h2>
          {modules.length === 0 ? (
            <p className="mt-3 text-ink-soft">The lesson plan for this course is being finished.</p>
          ) : (
            <ol className="mt-5 space-y-3">
              {modules.map((m) => (
                <li key={m.id}>
                  <details className="group rounded-[14px] border border-rule bg-surface">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                      <span className="font-display text-lg font-semibold">{m.title}</span>
                      <span className="shrink-0 text-sm text-muted">
                        {m.lessons.length} {m.lessons.length === 1 ? "lesson" : "lessons"}
                      </span>
                    </summary>
                    <ul className="border-t border-rule px-5 py-3 text-[15px] text-ink-soft">
                      {[...m.lessons]
                        .sort((a, b) => a.position - b.position)
                        .map((l) => (
                          <li key={l.id} className="py-1.5">
                            {l.title}
                          </li>
                        ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ol>
          )}
        </div>

        <aside className="h-fit rounded-[14px] border border-rule bg-surface p-6 lg:sticky lg:top-6">
          <p className="font-display text-2xl font-bold text-green-deep">{course.is_free ? "Free" : "Paid"}</p>
          <dl className="mt-4 space-y-3 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Level</dt>
              <dd className="font-medium capitalize">{course.level}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Time</dt>
              <dd className="font-medium">{course.estimated_hours} hours</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Lessons</dt>
              <dd className="font-medium">{lessonCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Pass mark</dt>
              <dd className="font-medium">{course.pass_mark}%</dd>
            </div>
          </dl>
          <ButtonLink href={`/register`} className="mt-6 w-full">
            Create account to enroll
          </ButtonLink>
          <p className="mt-3 text-sm text-muted">
            Have an account?{" "}
            <Link href={`/login?next=/courses/${course.slug}`} className="font-medium text-spine-blue hover:text-blue-deep">
              Log in
            </Link>
          </p>
        </aside>
      </div>
    </main>
  );
}