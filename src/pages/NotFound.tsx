import { Link } from 'react-router-dom';
import { btnPrimary } from '@/lib/ui';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="mb-3 text-xs font-bold tracking-widest text-teal-800">PAGE NOT FOUND</p>
      <h1 className="mb-4 text-4xl font-bold">We couldn’t find that page.</h1>
      <p className="mb-8 text-slate-600">The link may be out of date, or the course may no longer exist.</p>
      <Link to="/courses" className={btnPrimary}>Browse courses</Link>
    </main>
  );
}