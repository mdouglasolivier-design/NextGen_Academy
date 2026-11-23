import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { useLearner } from '@/context/LearnerContext';
import { PASS_MARK, QUIZ_QUESTIONS, getCourse } from '@/data/courses';
import { btnPrimary } from '@/lib/ui';

export default function Quiz() {
  const { id } = useParams();
  const course = getCourse(id);
  const { recordPass } = useLearner();
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!course) return <NotFound />;

  const total = QUIZ_QUESTIONS.length;
  const score = QUIZ_QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
  const answered = QUIZ_QUESTIONS.filter((_, i) => answers[i] !== undefined).length;
  const passed = score >= PASS_MARK;

  const retry = () => {
    setSubmitted(false);
    setAnswers([]);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (passed && course.certificate) recordPass(course.id);
  };

  const choose = (question: number, option: number) =>
    setAnswers((old) => {
      const next = [...old];
      next[question] = option;
      return next;
    });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mb-3 text-sm font-semibold text-teal-800">{course.title}</p>
      <h1 className="text-3xl font-bold">{submitted ? 'Your assessment results' : 'Final knowledge check'}</h1>

      {submitted ? (
        <div className="mt-8 border border-slate-200 p-8">
          <p className="text-4xl font-bold text-teal-800">{Math.round((score / total) * 100)}%</p>
          <h2 className="my-4 text-xl font-bold">{passed ? 'Well done — you passed!' : 'Keep learning — try again.'}</h2>
          <p className="mb-5 text-sm text-slate-600">
            You need {PASS_MARK} of {total} correct answers to pass. This is a sample assessment, not an accredited qualification.
          </p>
          {passed && course.certificate && <Link to={`/certificates/${course.id}`} className={btnPrimary}>View Demo Certificate</Link>}
          {passed && !course.certificate && <Link to="/dashboard" className={btnPrimary}>Back to dashboard</Link>}
          {!passed && <button type="button" onClick={retry} className={btnPrimary}>Try Again</button>}
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="my-5 text-sm text-slate-600">{answered} of {total} answered · Pass mark: {PASS_MARK} correct answers</p>
          <progress max={total} value={answered} className="mb-6 h-2 w-full accent-teal-800" />
          {QUIZ_QUESTIONS.map((q, i) => (
            <fieldset key={q.prompt} className="mb-6 border border-slate-200 p-5">
              <legend className="px-2 text-base font-bold">{i + 1}. {q.prompt}</legend>
              {q.options.map((option, n) => (
                <label key={option} className="flex min-h-12 items-center gap-3 text-sm">
                  <input type="radio" required name={`question-${i}`} checked={answers[i] === n} onChange={() => choose(i, n)} className="accent-teal-800" />
                  {option}
                </label>
              ))}
            </fieldset>
          ))}
          <button className={btnPrimary}>Submit Assessment</button>
        </form>
      )}
    </main>
  );
}