import type { Course, CourseDetail } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type Loaded<T> = { data: T; error: null } | { data: null; error: "not_found" | "unavailable" };

async function load<T>(path: string): Promise<Loaded<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (res.status === 404) return { data: null, error: "not_found" };
    if (!res.ok) return { data: null, error: "unavailable" };
    return { data: (await res.json()) as T, error: null };
  } catch {
    return { data: null, error: "unavailable" };
  }
}

export async function getCourses(): Promise<Loaded<Course[]>> {
  const r = await load<Course[] | { results: Course[] }>("/courses/");
  if (r.error) return r;
  return { data: Array.isArray(r.data) ? r.data : r.data.results, error: null };
}

export const getCourse = (slug: string) => load<CourseDetail>(`/courses/${encodeURIComponent(slug)}/`);