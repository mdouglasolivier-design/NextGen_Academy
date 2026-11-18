import { api } from "@/lib/api/client";
import type { Course } from "@/types";

export default async function CoursesPage() {
  const courses = await api<Course[] | { results: Course[] }>("/courses/");
  const list = Array.isArray(courses) ? courses : courses.results;
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">Courses</h1>
      <ul className="mt-4 space-y-3">
        {list.map((c) => (
          <li key={c.id} className="rounded border p-4">
            <h2 className="font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-600">{c.description}</p>
          </li>
        ))}
        {list.length === 0 && <li>No published courses yet. Add one in the Django admin.</li>}
      </ul>
    </main>
  );
}
