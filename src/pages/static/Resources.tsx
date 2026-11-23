import { Link, useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

const FAQ = [
  ['How do I enroll?', 'Open any course and choose Enroll in Course. Your demo enrollment is stored in this browser.'],
  ['Can I learn at my own pace?', 'Yes. Course modules and reading materials are available at your convenience.'],
  ['How do certificates work?', 'Pass a sample course assessment to unlock a demo certificate. These are not accredited awards.'],
  ['Is this a live service?', 'No. This frontend preview uses local browser state, with no backend API or payment service connected.'],
];

const TIPS = [
  ['Set a rhythm', 'Short, regular study sessions beat occasional long ones.'],
  ['Practice early', 'Apply each idea to a small example before moving to the next lesson.'],
  ['Reflect', 'After each lesson, write down one thing you learned and one question you still have.'],
];

const LEGAL =
  'This is a frontend demonstration, not a live education service. Profile names, enrollment selections, progress, assessment results, and contact drafts are stored only in this browser. Do not enter sensitive information. No payment processing or real authentication is provided. Official legal terms must be supplied before launch.';

const TITLES: Record<string, string> = {
  'learning-guides': 'Learning guides',
  'help-center': 'Help center',
  faq: 'Frequently asked questions',
  privacy: 'Privacy policy',
  terms: 'Terms and conditions',
};

export default function Resources() {
  const { slug = '' } = useParams();
  const title = TITLES[slug];
  if (!title) return <NotFound />;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p className="mb-3 text-xs font-bold tracking-widest text-teal-800">KNOWLEDGE WITHOUT BOUNDARIES</p>
      <h1 className="mb-6 text-4xl font-bold">{title}</h1>
      <div className="max-w-3xl">
        {(slug === 'privacy' || slug === 'terms') && <p className="text-base leading-8 text-slate-600">{LEGAL}</p>}

        {slug === 'learning-guides' &&
          TIPS.map(([h, p]) => (
            <div key={h} className="border-b border-slate-200 py-4">
              <h2 className="font-semibold">{h}</h2>
              <p className="mt-1 text-sm leading-7 text-slate-600">{p}</p>
            </div>
          ))}

        {(slug === 'faq' || slug === 'help-center') && (
          <>
            {FAQ.map(([q, a]) => (
              <details key={q} className="border-b border-slate-200 py-3">
                <summary className="min-h-11 cursor-pointer py-3 font-semibold">{q}</summary>
                <p className="pb-5 text-sm leading-7 text-slate-600">{a}</p>
              </details>
            ))}
            {slug === 'help-center' && (
              <p className="mt-8 text-sm text-slate-600">
                Still need help? <Link to="/contact" className="font-semibold text-teal-800 underline">Contact us</Link>.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}