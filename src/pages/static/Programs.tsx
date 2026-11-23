import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { btnText } from '@/lib/ui';

const programs = [
  { title: 'Undergraduate Preparation', to: '/courses' },
  { title: 'Professional Development', to: `/courses?category=${encodeURIComponent('Software Engineering')}` },
  { title: 'Short Courses', to: '/courses' },
  { title: 'Self-Paced Learning', to: '/courses' },
];

export default function Programs() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p className="mb-3 text-xs font-bold tracking-widest text-teal-800">KNOWLEDGE WITHOUT BOUNDARIES</p>
      <h1 className="mb-6 text-4xl font-bold">Find your learning path.</h1>
      <p className="mb-8 max-w-2xl text-base leading-7 text-slate-600">
        Explore proposed learning formats, from your first introduction to focused professional development. Program offerings below are illustrative, not accredited degree claims.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {programs.map((p) => (
          <div key={p.title} className="border border-slate-200 p-7">
            <Icon name="book" className="mb-4 text-teal-800" />
            <h2 className="text-xl font-bold">{p.title}</h2>
            <p className="my-4 text-sm leading-7 text-slate-600">
              Build your knowledge with a structured selection of practical online courses, designed around your learning goals.
            </p>
            <Link to={p.to} className={btnText}>Explore related courses <Icon name="arrow" /></Link>
          </div>
        ))}
      </div>
    </main>
  );
}