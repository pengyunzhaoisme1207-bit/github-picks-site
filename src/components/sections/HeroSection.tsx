import SearchBar from '@/components/ui/SearchBar';
import type { SearchProject } from '@/lib/types';

interface HeroSectionProps {
  projects: SearchProject[];
  categoryCount: number;
  currentWeek: string;
}

export default function HeroSection({ projects, categoryCount, currentWeek }: HeroSectionProps) {
  return (
    <section className="py-16 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 max-w-3xl mx-auto leading-tight">
        The Best GitHub Projects, Explained for Everyone
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
        Weekly curated picks with use cases, difficulty ratings, and editor&apos;s notes. No coding required to understand.
      </p>
      <SearchBar projects={projects} />
      <dl className="mt-8 grid grid-cols-3 gap-3 max-w-xl mx-auto text-center">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Projects</dt>
          <dd className="mt-1 text-xl font-bold text-slate-900">{projects.length}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Categories</dt>
          <dd className="mt-1 text-xl font-bold text-slate-900">{categoryCount}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Current</dt>
          <dd className="mt-1 text-xl font-bold text-slate-900">{currentWeek}</dd>
        </div>
      </dl>
    </section>
  );
}
