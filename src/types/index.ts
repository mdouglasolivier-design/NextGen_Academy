export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: number;
  title: string;
  category: string;
  level: Level;
  hours: number;
  price: number;
  /** Unsplash photo id, e.g. "photo-1517694712202-14dd9538aa97" */
  image: string;
  description: string;
  certificate: boolean;
}

export interface NavItem {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  to: string;
  /** Path prefixes that mark this group as active in the header. */
  match: string[];
  items?: NavItem[];
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correct: number;
}