import { ButtonLink } from "@/components/ui/Button";
import CourseCard, { CoursesUnavailable } from "@/components/site/CourseCard";
import VerifyForm from "@/components/site/VerifyForm";
import { getCourses } from "@/lib/api/courses";
import Link from "next/link";

// The hero's memorable element: the logo's three books, each one a step of the journey.
const spines = [
  { label: "Learn", note: "Self-paced lessons, free.", bg: "bg-spine-green", w: "w-[88%]", shift: "ml-0" },
  { label: "Pass", note: "Take the assessment when you're ready.", bg: "bg-spine-red", w: "w-full", shift: "sm:-ml-3" },
  { label: "Share", note: "Send a certificate anyone can verify.", bg: "bg-spine-blue", w: "w-[82%]", shift: "sm:ml-2" },
];

export default async function Home() {
  const { data: courses, error } = await getCourses();
  const featured = courses?.slice(0, 3) ?? [];

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <h1 className="text-5xl font-extrabold sm:text-6xl">
            Learn for free. Earn a certificate anyone can check.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            Finish a course, pass the assessment, and get a certificate with a code. Employers and universities
            confirm it in seconds, no email chains needed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/register">Create free account</ButtonLink>
            <ButtonLink href="/courses" variant="secondary">
              Browse courses
            </ButtonLink>
          </div>
        </div>

        <div className="space-y-3" aria-label="How it works: learn, pass, share">
          {spines.map((s, i) => (
            <div
              key={s.label}
              className={`spine-in ${s.bg} ${s.w} ${s.shift} rounded-xl px-6 py-5 text-white shadow-[0_2px_0_rgba(0,0,0,0.18)]`}
              style={{ animationDelay: `${0.1 + i * 0.14}s` }}
            >
              <p className="font-display text-3xl font-bold">{s.label}</p>
              <p className="mt-0.5 text-[15px] text-white/90">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">Start with a course</h2>
          <Link href="/courses" className="text-[15px] font-semibold text-spine-blue hover:text-blue-deep">
            See all courses
          </Link>
        </div>
        <div className="mt-6">
          {error ? (
            <CoursesUnavailable />
          ) : featured.length === 0 ? (
            <p className="rounded-[14px] border border-rule bg-surface p-6 text-ink-soft">
              The first courses are on their way. Create an account and we&rsquo;ll show them here as soon as they open.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {featured.map((c, i) => (
                <CourseCard key={c.id} course={c} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-[18px] bg-ink px-6 py-10 text-white sm:px-12">
          <h2 className="max-w-xl text-3xl font-bold">Checking someone&rsquo;s certificate?</h2>
          <p className="mt-3 max-w-xl text-white/70">
            Enter the code on the certificate. You&rsquo;ll see the holder&rsquo;s name, the course, and whether it&rsquo;s still valid.
          </p>
          <div className="mt-6 max-w-2xl">
            <VerifyForm onDark />
          </div>
        </div>
      </section>
    </main>
  );
}