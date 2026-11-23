import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { Icon } from '@/components/ui/Icon';
import NotFound from '@/pages/NotFound';
import { useLearner } from '@/context/LearnerContext';
import { getCourse } from '@/data/courses';
import { btnPrimary } from '@/lib/ui';

const formData = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  return new FormData(e.currentTarget);
};

export function Login() {
  const { signIn } = useLearner();
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const email = String(formData(e).get('email'));
    signIn(email.split('@')[0]);
    navigate('/dashboard');
  };

  return (
    <AuthShell title="Welcome back" footerTo="/register" footerLabel="New here? Create an account">
      <form onSubmit={onSubmit}>
        <TextField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <TextField label="Password" name="password" type="password" minLength={8} autoComplete="current-password" placeholder="At least 8 characters" />
        <div className="mb-4 flex items-center justify-between text-sm">
          <label className="flex min-h-11 items-center gap-2"><input type="checkbox" />Remember me</label>
          <Link to="/forgot-password" className="inline-flex min-h-11 items-center text-teal-800">Forgot password?</Link>
        </div>
        <button className={`${btnPrimary} w-full`}>Sign In to Demo <Icon name="arrow" /></button>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const { signIn } = useLearner();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = formData(e);
    if (data.get('password') !== data.get('confirm')) return setMessage('Passwords must match.');
    signIn(String(data.get('first')));
    navigate('/dashboard');
  };

  return (
    <AuthShell title="Create your account" message={message} footerTo="/login" footerLabel="Back to sign in">
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <TextField label="First name" name="first" autoComplete="given-name" />
          <TextField label="Last name" name="last" autoComplete="family-name" />
        </div>
        <TextField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <TextField label="Password" name="password" type="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
        <TextField label="Confirm password" name="confirm" type="password" minLength={8} autoComplete="new-password" />
        <button className={`${btnPrimary} w-full`}>Create Demo Account <Icon name="arrow" /></button>
      </form>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const [message, setMessage] = useState('');
  return (
    <AuthShell title="Forgot your password?" message={message} footerTo="/reset-password" footerLabel="Open demo password reset">
      <form onSubmit={(e) => { formData(e); setMessage('No email was sent in this preview. Use the demo reset form below.'); }}>
        <TextField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <button className={`${btnPrimary} w-full`}>Request Reset <Icon name="arrow" /></button>
      </form>
    </AuthShell>
  );
}

export function ResetPassword() {
  const [message, setMessage] = useState('');
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = formData(e);
    setMessage(
      data.get('password') !== data.get('confirm')
        ? 'Passwords must match.'
        : 'Demo password reset completed. No real credentials were changed.',
    );
  };
  return (
    <AuthShell title="Set a new password" message={message} footerTo="/login" footerLabel="Back to sign in">
      <form onSubmit={onSubmit}>
        <TextField label="Password" name="password" type="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
        <TextField label="Confirm password" name="confirm" type="password" minLength={8} autoComplete="new-password" />
        <button className={`${btnPrimary} w-full`}>Reset Demo Password <Icon name="arrow" /></button>
      </form>
    </AuthShell>
  );
}

export function Checkout() {
  const { id } = useParams();
  const course = getCourse(id);
  const navigate = useNavigate();
  const { student, enroll } = useLearner();

  if (!course) return <NotFound />;
  if (!student) return <Navigate to="/login" replace />;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    formData(e);
    enroll(course.id);
    navigate(`/learn/${course.id}`);
  };

  return (
    <AuthShell title="Review your enrollment" footerTo={`/courses/${course.id}`} footerLabel="Back to course">
      <form onSubmit={onSubmit}>
        <div className="mb-6 border-y border-slate-200 py-5">
          <p className="font-bold">{course.title}</p>
          <p className="my-3 text-xl">${course.price} USD</p>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input required type="checkbox" />
            I understand this is a free demo enrollment.
          </label>
        </div>
        <button className={`${btnPrimary} w-full`}>Confirm Demo Enrollment <Icon name="arrow" /></button>
      </form>
    </AuthShell>
  );
}