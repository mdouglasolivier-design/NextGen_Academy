import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Picture } from '@/components/ui/Picture';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { useLearner } from '@/context/LearnerContext';
import { COURSES } from '@/data/courses';
import { btnPrimary, btnText, field } from '@/lib/ui';

type Tab = 'Dashboard' | 'My Courses' | 'My Learning Progress' | 'Assessments' | 'Notifications' | 'Profile Settings' | 'Help and Support';

type SidebarItem = { label: string } & ({ tab: Tab } | { to: string } | { logout: true });

const sidebar: SidebarItem[] = [
  { label: 'Dashboard', tab: 'Dashboard' },
  { label: 'My Courses', tab: 'My Courses' },
  { label: 'Course Catalog', to: '/courses' },
  { label: 'My Learning Progress', tab: 'My Learning Progress' },
  { label: 'Assessments', tab: 'Assessments' },
  { label: 'My Certificates', to: '/certificates' },
  { label: 'Notifications', tab: 'Notifications' },
  { label: 'Profile Settings', tab: 'Profile Settings' },
  { label: 'Help and Support', tab: 'Help and Support' },
  { label: 'Logout', logout: true },
];

const itemClass = (active: boolean) =>
  `mb-1 flex min-h-11 w-full items-center rounded-sm px-3 text-left text-sm ${active ? 'bg-teal-800 font-semibold text-white' : 'hover:bg-slate-100'}`;

export default function Dashboard() {
  const { student, enrolled, passed, progress, lessonsCompleted, signIn, signOut } = useLearner();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Dashboard');
  const [message, setMessage] = useState('');

  const myCourses = COURSES.filter((c) => enrolled.includes(c.id));
  const stats: [number, string][] = [
    [enrolled.length, 'Enrolled Courses'],
    [enrolled.filter((id) => progress(id) > 0 && progress(id) < 100).length, 'In Progress'],
    [enrolled.filter((id) => progress(id) === 100).length, 'Completed'],
    [passed.length, 'Certificates Earned'],
  ];

  const saveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(String(new FormData(e.currentTarget).get('name')));
    setMessage('Profile name saved to this browser.');
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[210px_1fr]">
      <aside aria-label="Student workspace">
        <h2 className="mb-4 text-xs font-bold tracking-widest text-teal-800">STUDENT WORKSPACE</h2>
        {sidebar.map((item) =>
          'to' in item ? (
            <Link key={item.label} to={item.to} className={itemClass(false)}>{item.label}</Link>
          ) : (
            <button
              key={item.label}
              type="button"
              className={itemClass('tab' in item && tab === item.tab)}
              onClick={() => {
                if ('logout' in item) {
                  signOut();
                  navigate('/login');
                } else {
                  setTab(item.tab);
                  setMessage('');
                }
              }}
            >
              {item.label}
            </button>
          ),
        )}
      </aside>

      <section className="min-w-0">
        <h1 className="text-3xl font-bold">{tab === 'Dashboard' ? `Welcome back, ${student}.` : tab}</h1>
        <p className="mb-8 mt-3 text-sm text-slate-600">Your learning journey, one step at a time. Progress is stored in this browser.</p>

        {(tab === 'Dashboard' || tab === 'My Courses' || tab === 'My Learning Progress') && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map(([n, t]) => (
                <div key={t} className="border border-slate-200 p-5">
                  <p className="text-3xl font-bold text-teal-800">{n}</p>
                  <p className="mt-2 text-sm text-slate-600">{t}</p>
                </div>
              ))}
            </div>

            <h2 className="mb-5 text-xl font-bold">Continue learning</h2>
            {myCourses.length === 0 && (
              <div className="bg-slate-50 p-8">
                <p className="mb-4 text-sm">Your next opportunity is waiting. Enroll in your first course.</p>
                <Link to="/courses" className={btnPrimary}>Explore Courses</Link>
              </div>
            )}
            <div className="grid gap-5 lg:grid-cols-2">
              {myCourses.map((c) => (
                <div key={c.id} className="overflow-hidden border border-slate-200">
                  <Picture photo={c.image} alt="" className="h-36 w-full" />
                  <div className="p-5">
                    <h3 className="font-bold">{c.title}</h3>
                    <p className="my-3 text-sm text-slate-600">{progress(c.id)}% completed</p>
                    <progress value={progress(c.id)} max={100} className="h-2 w-full accent-teal-800" />
                    <Link to={`/learn/${c.id}`} className={`${btnText} mt-3`}>Continue Learning <Icon name="arrow" /></Link>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mb-3 mt-8 text-xl font-bold">Recent learning activity</h2>
            <p className="text-sm text-slate-600">
              {lessonsCompleted ? `${lessonsCompleted} lessons completed across your learning journey.` : 'Complete a lesson to see your activity here.'}
            </p>
            <h2 className="mb-3 mt-8 text-xl font-bold">Upcoming assessments</h2>
            <p className="text-sm text-slate-600">Self-paced assessments are available at the end of each enrolled course. No deadlines.</p>
          </>
        )}

        {tab === 'Assessments' && (
          <div>
            {myCourses.map((c) => (
              <Link key={c.id} to={`/quiz/${c.id}`} className="mb-3 flex min-h-16 w-full items-center justify-between border border-slate-200 p-4 text-left text-sm hover:bg-slate-50">
                {c.title}
                <Icon name="arrow" />
              </Link>
            ))}
            {myCourses.length === 0 && <p className="text-sm">Enroll in a course to access its assessment.</p>}
          </div>
        )}

        {tab === 'Profile Settings' && (
          <form className="max-w-lg" onSubmit={saveProfile}>
            <label className="block text-sm">
              Display name
              <input name="name" defaultValue={student} required className={`${field} my-3`} />
            </label>
            <button className={btnPrimary}>Save Profile</button>
            <StatusMessage>{message}</StatusMessage>
          </form>
        )}

        {(tab === 'Notifications' || tab === 'Help and Support') && (
          <p className="border border-slate-200 p-6 text-sm leading-7 text-slate-600">
            {tab === 'Notifications'
              ? 'You are all caught up. New learning activity will appear in your dashboard.'
              : 'Need a hand? Explore a course curriculum or visit Contact Us. This preview does not have a connected support service.'}
          </p>
        )}
      </section>
    </main>
  );
}