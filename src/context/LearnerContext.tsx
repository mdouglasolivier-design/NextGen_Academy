import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { MODULES } from '@/data/courses';

interface LearnerContextValue {
  student: string;
  enrolled: number[];
  passed: number[];
  signIn: (name: string) => void;
  signOut: () => void;
  enroll: (courseId: number) => void;
  isEnrolled: (courseId: number) => boolean;
  completeLesson: (courseId: number, lesson: number) => void;
  isLessonComplete: (courseId: number, lesson: number) => boolean;
  lessonsCompleted: number;
  progress: (courseId: number) => number;
  recordPass: (courseId: number) => void;
  hasPassed: (courseId: number) => boolean;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);
const lessonKey = (courseId: number, lesson: number) => `${courseId}-${lesson}`;
const addUnique = <T,>(list: T[], item: T) => (list.includes(item) ? list : [...list, item]);

/** Holds the demo learner's session and progress. Everything is stored in this browser only. */
export function LearnerProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useLocalStorage<string>(STORAGE_KEYS.student, '');
  const [enrolled, setEnrolled] = useLocalStorage<number[]>(STORAGE_KEYS.enrolled, []);
  const [completed, setCompleted] = useLocalStorage<string[]>(STORAGE_KEYS.completed, []);
  const [passed, setPassed] = useLocalStorage<number[]>(STORAGE_KEYS.passed, []);

  const value = useMemo<LearnerContextValue>(
    () => ({
      student,
      enrolled,
      passed,
      signIn: setStudent,
      signOut: () => setStudent(''),
      enroll: (id) => setEnrolled((prev) => addUnique(prev, id)),
      isEnrolled: (id) => enrolled.includes(id),
      completeLesson: (id, lesson) => setCompleted((prev) => addUnique(prev, lessonKey(id, lesson))),
      isLessonComplete: (id, lesson) => completed.includes(lessonKey(id, lesson)),
      lessonsCompleted: completed.length,
      progress: (id) =>
        Math.round((MODULES.filter((_, i) => completed.includes(lessonKey(id, i))).length / MODULES.length) * 100),
      recordPass: (id) => setPassed((prev) => addUnique(prev, id)),
      hasPassed: (id) => passed.includes(id),
    }),
    [student, enrolled, completed, passed, setStudent, setEnrolled, setCompleted, setPassed],
  );

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner(): LearnerContextValue {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error('useLearner must be used inside <LearnerProvider>');
  return ctx;
}