import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { readLocal, saveLocal } from '@/lib/storage';

/** useState that persists to localStorage. */
export function useLocalStorage<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readLocal(key, initial));
  useEffect(() => saveLocal(key, value), [key, value]);
  return [value, setValue];
}