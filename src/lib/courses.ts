import type { Course } from '@/types';

export const DURATIONS = ['Any duration', 'Under 20 hours', '20 hours or more'] as const;
export const SORTS = ['Recommended', 'Title A–Z', 'Shortest first'] as const;

export interface Filters {
  level: string[];
  price: string[];
  certOnly: boolean;
  duration: string;
}

export const DEFAULT_FILTERS: Filters = { level: [], price: [], certOnly: false, duration: DURATIONS[0] };

export function filterCourses(courses: Course[], category: string, query: string, f: Filters): Course[] {
  const q = query.trim().toLowerCase();
  return courses.filter(
    (c) =>
      (category === 'All Courses' || c.category === category) &&
      `${c.title} ${c.description}`.toLowerCase().includes(q) &&
      (!f.level.length || f.level.includes(c.level)) &&
      (!f.price.length || f.price.includes(c.price === 0 ? 'Free' : 'Paid')) &&
      (!f.certOnly || c.certificate) &&
      (f.duration === DURATIONS[0] || (f.duration === DURATIONS[1] ? c.hours < 20 : c.hours >= 20)),
  );
}

export function sortCourses(courses: Course[], sort: string): Course[] {
  return [...courses].sort((a, b) =>
    sort === 'Title A–Z' ? a.title.localeCompare(b.title) : sort === 'Shortest first' ? a.hours - b.hours : a.id - b.id,
  );
}

export const formatPrice = (price: number) => (price ? `$${price}` : 'Free');
export const certificateId = (courseId: number) => `NGA-DEMO-${courseId}-2026`;
export const unsplash = (photo: string, width = 800) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`;