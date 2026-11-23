import { useState, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { useLearner } from '@/context/LearnerContext';
import { COURSES, getCourse } from '@/data/courses';
import { certificateId } from '@/lib/courses';
import { btnPrimary, field } from '@/lib/ui';

export function CertificateList() {
  const { hasPassed } = useLearner();
  const earned = COURSES.filter((c) => c.certificate && hasPassed(c.id));

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-6 text-3xl font-bold">Your certificates</h1>
      {earned.map((c) => (
        <Link key={c.id} to={`/certificates/${c.id}`} className="mb-3 flex min-h-20 w-full items-center justify-between border border-slate-200 p-5 text-left hover:bg-slate-50">
          <span className="flex items-center gap-3"><Icon name="award" />{c.title}</span>
          <Icon name="arrow" />
        </Link>
      ))}
      {earned.length === 0 && (
        <div className="bg-slate-50 p-8">
          <p className="mb-5 text-sm leading-7">Your achievements will appear here after you pass a certificate course assessment.</p>
          <Link to="/courses" className={btnPrimary}>Find Your First Course</Link>
        </div>
      )}
    </main>
  );
}

export function CertificateView() {
  const { id } = useParams();
  const course = getCourse(id);
  const { student, hasPassed } = useLearner();

  if (!course || !course.certificate || !hasPassed(course.id)) return <Navigate to="/certificates" replace />;

  const name = student || 'Demo Student';
  const download = encodeURIComponent(
    `NEXTGEN ACADEMY — DEMO CERTIFICATE\n${name}\n${course.title}\n${certificateId(course.id)}\nNot an accredited award. Local prototype only.`,
  );

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-6 text-3xl font-bold">Celebrate your achievement</h1>
      <div className="border-8 border-double border-[#b59a62] bg-[#fffef9] px-5 py-12 text-center md:px-12">
        <p className="text-xl font-bold tracking-tight text-teal-900">NextGen Academy</p>
        <p className="mb-8 mt-2 text-xs tracking-[0.2em] text-slate-600">DEMO · NOT AN ACCREDITED AWARD</p>
        <Icon name="award" className="mx-auto mb-5 h-12 w-12 text-[#8a7039]" />
        <h2 className="font-serif text-3xl md:text-5xl">Certificate of Completion</h2>
        <p className="mt-7 text-sm text-slate-600">This is to recognize</p>
        <p className="my-5 font-serif text-4xl text-teal-900">{name}</p>
        <p className="text-sm text-slate-600">for successfully passing the sample assessment in</p>
        <p className="my-5 text-xl font-bold">{course.title}</p>
        <p className="mt-8 text-sm text-slate-600">
          Preview date: {new Date().toLocaleDateString()}
          <br />
          Certificate ID: {certificateId(course.id)}
          <br />
          Verification available for local demo records only.
        </p>
      </div>
      <a download="nextgen-demo-certificate.txt" className={`${btnPrimary} mt-6`} href={`data:text/plain;charset=utf-8,${download}`}>
        Download Demo Certificate (TXT)
      </a>
    </main>
  );
}

export function VerifyCertificate() {
  const { hasPassed } = useLearner();
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get('id')).trim();
    const found = COURSES.find((c) => certificateId(c.id) === code && hasPassed(c.id));
    setMessage(
      found
        ? `Local demo record found: ${found.title}. This is not official verification.`
        : 'No matching certificate in this browser. Live verification is not connected.',
    );
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-6 text-3xl font-bold">Certificate verification</h1>
      <form className="max-w-lg" onSubmit={onSubmit}>
        <label className="text-sm">
          Certificate identification number
          <input name="id" required className={`${field} my-3`} placeholder="NGA-DEMO-1-2026" />
        </label>
        <button className={btnPrimary}>Check Local Record</button>
        <StatusMessage>{message}</StatusMessage>
      </form>
    </main>
  );
}