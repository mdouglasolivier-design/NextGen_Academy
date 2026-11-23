import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CourseCard } from '@/components/course/CourseCard';
import { CourseFilters } from '@/components/course/CourseFilters';
import { Icon, type IconName } from '@/components/ui/Icon';
import { CATEGORIES, COURSES } from '@/data/courses';
import { DEFAULT_FILTERS, SORTS, filterCourses, sortCourses, type Filters } from '@/lib/courses';
import { btnPrimary } from '@/lib/ui';

const perks: { icon: IconName; text: string }[] = [
  { icon: 'book', text: 'Expert-designed courses' },
  { icon: 'clock', text: 'Learn at your own pace' },
  { icon: 'award', text: 'Earn professional certificates' },
];

const tabs = ['All Courses', 'Computer Science', 'Software Engineering', 'Artificial Intelligence', 'Data Science', 'Cybersecurity'];

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  const requested = params.get('category') ?? 'All Courses';
  const category = (CATEGORIES as readonly string[]).includes(requested) ? requested : 'All Courses';
  const setCategory = (c: string) => setParams(c === 'All Courses' ? {} : { category: c });

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<string>(SORTS[0]);

  // The header search icon navigates here with { focusSearch: true }.
  useEffect(() => {
    if ((location.state as { focusSearch?: boolean } | null)?.focusSearch) searchRef.current?.focus();
  }, [location.state]);

  const results = useMemo(
    () => sortCourses(filterCourses(COURSES, category, query, filters), sort),
    [category, query, filters, sort],
  );

  const reset = () => {
    setParams({});
    setQuery('');
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[#eff5f4]">
        <div aria-hidden="true" className="absolute -right-12 -top-48 h-[520px] w-[520px] rounded-full border-[70px] border-teal-800/[0.035]" />
        <div className="relative mx-auto max-w-[1360px] px-5 pb-10 pt-5 lg:px-10">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-slate-600">
            <Link to="/" className="inline-flex min-h-8 items-center hover:text-teal-800">Home</Link>
            <span>/</span>
            <span className="text-teal-800">Course Catalog</span>
          </nav>
          <span className="mb-3 block text-xs font-bold tracking-[0.18em] text-teal-800">LEARN TODAY. LEAD TOMORROW.</span>
          <h1 className="text-4xl font-bold tracking-tight text-[#143841] md:text-[44px]">Explore Our Courses<span className="text-teal-700">.</span></h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Build in-demand skills, explore new possibilities, and take the next step in your
            <br className="hidden lg:block" /> learning journey. Quality education, at your pace.
          </p>
          <div className="mt-7 flex max-w-[660px] items-center rounded-sm border border-slate-300 bg-white p-1.5 shadow-sm">
            <Icon name="search" className="ml-3 text-slate-600" />
            <input
              ref={searchRef}
              aria-label="Search courses"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to learn?"
              className="min-h-11 min-w-0 flex-1 px-3 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => document.getElementById('course-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className={btnPrimary}
            >
              Find Courses <Icon name="arrow" className="hidden h-4 w-4 sm:block" />
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-slate-600">
            {perks.map((p) => (
              <span key={p.text} className="flex items-center gap-2"><Icon name={p.icon} className="h-4 w-4 text-teal-800" />{p.text}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1360px] gap-7 overflow-x-auto px-5 lg:px-10">
          {tabs.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setCategory(x)}
              className={`min-h-16 shrink-0 border-b-2 text-sm font-medium ${category === x ? 'border-teal-800 text-teal-800' : 'border-transparent text-slate-600 hover:text-teal-800'}`}
            >
              {x === 'All Courses' && <span className="mr-2 inline-block align-middle"><Icon name="grid" className="h-4 w-4" /></span>}
              {x}
            </button>
          ))}
          <button
            type="button"
            onClick={() => document.getElementById('category-filter')?.focus()}
            className="min-h-16 shrink-0 border-b-2 border-transparent text-sm font-medium text-slate-600 hover:text-teal-800"
          >
            More Categories +
          </button>
        </div>
      </div>

      <main id="course-results" className="mx-auto grid max-w-[1360px] gap-8 px-5 py-9 md:grid-cols-[220px_1fr] lg:gap-10 lg:px-10">
        <CourseFilters category={category} onCategory={setCategory} filters={filters} onChange={(p) => setFilters((f) => ({ ...f, ...p }))} onReset={reset} />
        <section className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Showing <strong className="text-slate-900">{results.length}</strong> courses {category !== 'All Courses' && `in ${category}`}
            </p>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              Sort by:
              <select aria-label="Sort courses" value={sort} onChange={(e) => setSort(e.target.value)} className="min-h-11 rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-800">
                {SORTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {results.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>

          {results.length === 0 ? (
            <div className="border border-slate-200 p-12 text-center">
              <h2 className="text-xl font-bold">No courses found</h2>
              <p className="my-3 text-sm text-slate-600">Try a different search or clear your filters.</p>
              <button type="button" className={btnPrimary} onClick={reset}>Clear filters</button>
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-slate-600">Showing all {results.length} matching courses. Your next chapter starts here.</p>
          )}
        </section>
      </main>
    </>
  );
}