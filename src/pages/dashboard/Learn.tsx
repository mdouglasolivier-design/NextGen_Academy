import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import NotFound from '@/pages/NotFound';
import { useLearner } from '@/context/LearnerContext';
import { MODULES, getCourse } from '@/data/courses';
import { btnOutline, btnPrimary, btnText } from '@/lib/ui';

export default function Learn() {
  const { id } = useParams();
  const course = getCourse(id);
  const navigate = useNavigate();
  const { progress, isLessonComplete, completeLesson } = useLearner();
  const [lesson, setLesson] = useState(0);

  if (!course) return <NotFound />;
  const last = MODULES.length - 1;
  const done = isLessonComplete(course.id, lesson);

  const studyGuide = encodeURIComponent(
    `${course.title}\n${MODULES[lesson]}\n\nPractice: Describe your problem, inputs, process, and output.\nReflection: What did you learn? What would you test next?`,
  );

  return (
    <main className="mx-auto max-w-[1360px] px-5 py-8 lg:px-10">
      <Link to="/dashboard" className={`${btnText} mb-3`}>← My Dashboard</Link>
      <h1 className="mb-7 text-2xl font-bold">{course.title}</h1>

      <div className="grid gap-7 lg:grid-cols-[270px_1fr]">
        <aside className="self-start border border-slate-200" aria-label="Course content">
          <div className="border-b border-slate-200 p-5">
            <h2 className="mb-3 font-bold">Course content</h2>
            <progress max={100} value={progress(course.id)} className="h-2 w-full accent-teal-800" />
            <p className="mt-2 text-xs text-slate-600">{progress(course.id)}% completed</p>
          </div>
          {MODULES.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => setLesson(i)}
              aria-current={lesson === i}
              className={`flex min-h-16 w-full items-center gap-3 border-b border-slate-100 p-4 text-left text-sm ${lesson === i ? 'bg-teal-50 font-semibold text-teal-900' : ''}`}
            >
              <Icon name={isLessonComplete(course.id, i) ? 'check' : 'play'} className="h-4 w-4" />
              {m}
            </button>
          ))}
        </aside>

        <section className="min-w-0">
          <div className="flex aspect-video max-h-[420px] items-center justify-center bg-[#142c36] text-white">
            <div className="p-6 text-center">
              <Icon name="play" className="mx-auto mb-4 h-12 w-12" />
              <p className="font-semibold">{MODULES[lesson]}</p>
              <p className="mt-2 text-sm text-slate-300">Video lesson placeholder · Reading lesson available below</p>
            </div>
          </div>

          <p className="mb-2 mt-6 text-xs font-semibold text-teal-800">LESSON {lesson + 1} OF {MODULES.length}</p>
          <h2 className="text-2xl font-bold">{MODULES[lesson]}</h2>
          <p className="my-5 text-base leading-8 text-slate-600">
            Welcome to this lesson in {course.title}. Start by identifying the problem you want to solve, then break it into smaller, manageable steps. A clear understanding of the fundamentals helps you choose the right tools and evaluate your results.
          </p>

          <div className="bg-slate-50 p-5">
            <h3 className="mb-2 font-bold">Practice and reflect</h3>
            <p className="text-sm leading-7 text-slate-600">
              Choose a real-world example related to {course.category.toLowerCase()}. Describe its inputs, the process involved, and the expected output. Write down one assumption and explain how you would test it.
            </p>
            <a className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-teal-800 underline" download="nextgen-study-guide.txt" href={`data:text/plain;charset=utf-8,${studyGuide}`}>
              Download study guide ↓
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button type="button" disabled={lesson === 0} className={btnOutline} onClick={() => setLesson(lesson - 1)}>Previous Lesson</button>
            <button type="button" onClick={() => completeLesson(course.id, lesson)} className={btnPrimary}>
              {done ? 'Completed' : 'Mark as Completed'}
              <Icon name="check" />
            </button>
            <button type="button" className={btnOutline} onClick={() => (lesson < last ? setLesson(lesson + 1) : navigate(`/quiz/${course.id}`))}>
              {lesson < last ? 'Next Lesson' : 'Take Assessment'}
              <Icon name="arrow" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}