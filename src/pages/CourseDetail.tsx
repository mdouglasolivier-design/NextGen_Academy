import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Picture } from '@/components/ui/Picture';
import NotFound from '@/pages/NotFound';
import { useLearner } from '@/context/LearnerContext';
import { MODULES, getCourse } from '@/data/courses';
import { btnPrimary, btnText } from '@/lib/ui';

const outcomes = [
  'Understand foundational principles and essential terminology.',
  'Apply your knowledge through guided practical exercises.',
  'Solve real-world problems with a structured approach.',
  'Build the confidence to take the next step in your career.',
];

export default function CourseDetail() {
  const { id } = useParams();
  const course = getCourse(id);
  const navigate = useNavigate();
  const { isEnrolled, enroll } = useLearner();
  const [expanded, setExpanded] = useState(0);

  if (!course) return <NotFound />;
  const enrolled = isEnrolled(course.id);

  const handleEnroll = () => {
    if (enrolled) return navigate(`/learn/${course.id}`);
    if (course.price) return navigate(`/checkout/${course.id}`);
    enroll(course.id);
    navigate(`/learn/${course.id}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Link to="/courses" className={`${btnText} mb-5`}>← Back to course catalog</Link>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="mb-3 text-sm font-semibold text-teal-800">{course.category}</p>
          <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
          <p className="my-5 text-lg leading-8 text-slate-600">{course.description}</p>
          <div className="mb-9 flex flex-wrap gap-5 text-sm">
            <span>{course.level}</span>
            <span>{course.hours} study hours</span>
            <span>Self-paced online learning</span>
          </div>

          <h2 className="mb-4 text-2xl font-bold">What you will learn</h2>
          {outcomes.map((x) => (
            <p key={x} className="mb-4 flex gap-3 text-sm leading-6"><Icon name="check" className="text-teal-800" />{x}</p>
          ))}

          <h2 className="mb-5 mt-10 text-2xl font-bold">Course curriculum</h2>
          {MODULES.map((m, i) => (
            <div key={m} className="border border-b-0 border-slate-200 last:border-b">
              <button
                type="button"
                onClick={() => setExpanded(expanded === i ? -1 : i)}
                aria-expanded={expanded === i}
                className="flex min-h-16 w-full items-center justify-between bg-slate-50 px-5 text-left text-sm font-semibold"
              >
                <span>0{i + 1} · {m}</span>
                <Icon name="chevron" />
              </button>
              {expanded === i && (
                <div className="p-5 text-sm leading-7 text-slate-600">
                  Video introduction · Guided reading · Practical exercise
                  <br />
                  Learn essential ideas, work through an example, and check your understanding.
                </div>
              )}
            </div>
          ))}

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-xl font-bold">Requirements</h2>
              <p className="text-sm leading-7 text-slate-600">
                A computer, internet connection, and a willingness to learn.{' '}
                {course.level !== 'Beginner' ? 'Prior foundational knowledge is recommended.' : 'No prior experience is required.'}
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-bold">Your learning team</h2>
              <p className="text-sm leading-7 text-slate-600">
                NextGen Academy Academic Team
                <br />
                Sample instructor profile for this frontend preview.
              </p>
            </div>
          </div>
        </div>

        <aside className="self-start overflow-hidden rounded border border-slate-200">
          <Picture photo={course.image} alt={course.title} className="h-52 w-full" />
          <div className="p-6">
            <p className="text-3xl font-bold">{course.price ? `$${course.price} USD` : 'Free'}</p>
            <p className="my-3 text-sm leading-6 text-slate-600">
              {course.price ? 'Preview enrollment only. No payment will be collected.' : 'Start learning at no cost, on your own schedule.'}
            </p>
            <button type="button" className={`${btnPrimary} my-3 w-full`} onClick={handleEnroll}>
              {enrolled ? 'Continue Learning' : 'Enroll in Course'}
              <Icon name="arrow" />
            </button>
            <p className="text-xs leading-6 text-slate-600">
              Includes {MODULES.length} modules, learning resources, and a final assessment.
              {course.certificate && ' Earn a demo certificate after passing.'}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}