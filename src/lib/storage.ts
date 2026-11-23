export const STORAGE_KEYS = {
  student: 'nextgen-student',
  enrolled: 'nextgen-enrolled',
  completed: 'nextgen-completed',
  passed: 'nextgen-passed',
  contact: 'nextgen-contact',
} as const;

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveLocal(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage may be disabled (private mode). The app keeps working in memory. */
  }
}