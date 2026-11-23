import { Link } from 'react-router-dom';
import { CourseCard } from '@/components/course/CourseCard';
import { Icon } from '@/components/ui/Icon';
import { Picture } from '@/components/ui/Picture';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { CATEGORIES, COURSES } from '@/data/courses';
import { btnBrandOutline, btnPrimary } from '@/lib/ui';

const stats: [string | number, string][] = [
  [COURSES.length, 'Available Courses'],
  [4, 'Learning Programs'],
  ['Worldwide', 'Learning Community'],
  [COURSES.filter((c) => c.certificate).length, 'Certificate Courses'],
];

const benefits = [
  'Flexible self-paced learning',
  'Accessible online education',
  'Practical knowledge',
  'Structured learning paths',
  'Professional certificates',
  'Student learning support',
];

const journey = ['Create an account', 'Explore and enroll', 'Study at your own pace', 'Complete assessments'];

export default function Home() {
  return (
    <main>
      <section className="bg-[#edf4f2]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-bold tracking-widest text-teal-800">YOUR FUTURE. YOUR POSSIBILITIES.</p>
            <h1 className="text-4xl font-bold leading-tight text-[#143841] lg:text-6xl">Build Your Future Through Knowledge.</h1>
            <p className="my-6 text-lg leading-8 text-slate-600">
              Discover quality online education, develop practical skills, and earn certificates through flexible learning opportunities with NextGen Academy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses" className={btnPrimary}>Explore Courses <Icon name="arrow" /></Link>
              <Link to="/register" className={btnBrandOutline}>Get Started</Link>
            </div>
          </div>
          <Picture photo="photo-1434030216411-0b793f4b4173" alt="A student learning with a laptop" className="h-[380px] w-full rounded-sm" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-14 grid grid-cols-2 gap-6 border-b border-slate-200 pb-10 text-center md:grid-cols-4">
          {stats.map(([n, t]) => (
            <div key={t}>
              <p className="text-3xl font-bold text-teal-800">{n}</p>
              <p className="mt-2 text-sm text-slate-600">{t}</p>
            </div>
          ))}
        </div>

        <SectionTitle eyebrow="TAKE THE NEXT STEP" title="Featured courses" />
        <div className="mt-7 grid gap-6 md:grid-cols-3">
          {COURSES.slice(0, 3).map((c) => <CourseCard key={c.id} course={c} />)}
        </div>

        <SectionTitle eyebrow="FIND YOUR DIRECTION" title="Explore learning categories" />
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {CATEGORIES.slice(1).map((c) => (
            <Link key={c} to={`/courses?category=${encodeURIComponent(c)}`} className="flex min-h-24 items-center justify-between gap-3 border border-slate-200 p-5 text-left text-sm font-semibold hover:bg-teal-50">
              {c}
              <Icon name="arrow" />
            </Link>
          ))}
        </div>

        <SectionTitle eyebrow="EDUCATION THAT FITS YOUR LIFE" title="Why choose NextGen Academy?" />
        <div className="mt-7 grid gap-8 md:grid-cols-3">
          {benefits.map((x) => (
            <div key={x}>
              <Icon name="check" className="mb-3 text-teal-800" />
              <h3 className="font-bold">{x}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Purposeful learning designed to help you take your next step with confidence.</p>
            </div>
          ))}
        </div>

        <SectionTitle eyebrow="YOUR LEARNING JOURNEY" title="Start small. Go further." />
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          {journey.map((x, i) => (
            <div key={x} className="border-t-2 border-teal-700 pt-5">
              <span className="text-sm font-bold text-teal-800">0{i + 1}</span>
              <h3 className="mt-3 font-bold">{x}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}