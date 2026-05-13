'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Search, Star } from 'lucide-react';
import type { Project } from '@/lib/types';
import { formatStars } from '@/lib/utils';

export interface WeeklyPickItem {
  week: string;
  rank: number;
  week_note: string;
  project: Pick<Project, 'name' | 'slug' | 'stars' | 'language' | 'category' | 'difficulty' | 'tags' | 'one_liner'>;
}

interface WeeklyPicksDirectoryProps {
  currentWeek: string;
  picks: WeeklyPickItem[];
}

const difficultyLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Some setup',
  3: 'Developer',
};

export default function WeeklyPicksDirectory({ currentWeek, picks }: WeeklyPicksDirectoryProps) {
  const [query, setQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [category, setCategory] = useState('all');

  const weeks = useMemo(() => Array.from(new Set(picks.map((pick) => pick.week))), [picks]);
  const categories = useMemo(() => {
    return Array.from(new Set(picks.map((pick) => pick.project.category))).sort();
  }, [picks]);

  const filteredPicks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return picks.filter((pick) => {
      const haystack = [
        pick.week,
        pick.week_note,
        pick.project.name,
        pick.project.one_liner,
        pick.project.category,
        pick.project.language,
        ...pick.project.tags,
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesWeek = selectedWeek === 'all' || pick.week === selectedWeek;
      const matchesCategory = category === 'all' || pick.project.category === category;

      return matchesQuery && matchesWeek && matchesCategory;
    });
  }, [category, picks, query, selectedWeek]);

  const groupedPicks = useMemo(() => {
    return weeks
      .map((week) => ({
        week,
        items: filteredPicks
          .filter((pick) => pick.week === week)
          .sort((a, b) => a.rank - b.rank),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredPicks, weeks]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Weekly Picks</span>
      </nav>

      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 mb-2">Curated weekly shortlist</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">GitHub Weekly Picks</h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Browse every weekly recommendation by week, category, and keyword. The current issue is {currentWeek}.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        <aside className="lg:sticky lg:top-20 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <h2 className="font-semibold text-slate-900">Weekly Archive</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="weekly-search" className="block text-sm font-medium text-slate-700 mb-2">
                Search picks
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  id="weekly-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="AI, photos, design..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Weeks</h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedWeek('all')}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-left ${selectedWeek === 'all' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span>All weeks</span>
                  <span>{picks.length}</span>
                </button>
                {weeks.map((week) => {
                  const count = picks.filter((pick) => pick.week === week).length;
                  return (
                    <button
                      key={week}
                      type="button"
                      onClick={() => setSelectedWeek(week)}
                      className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-left ${selectedWeek === week ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span>{week === currentWeek ? `${week} current` : week}</span>
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-2">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item.replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Weekly Directory</h2>
            <p className="text-sm text-slate-600 mt-1">
              {filteredPicks.length} of {picks.length} picks matched
            </p>
          </div>

          {groupedPicks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-medium text-slate-900">No weekly picks matched these filters.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedWeek('all');
                  setCategory('all');
                }}
                className="mt-3 text-sm font-medium text-blue-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedPicks.map((group) => (
                <section key={group.week} aria-labelledby={`week-${group.week}`}>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 id={`week-${group.week}`} className="text-xl font-bold text-slate-900">
                      {group.week}
                    </h3>
                    {group.week === currentWeek && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Current week
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {group.items.map((pick) => (
                      <Link key={`${pick.week}-${pick.project.slug}`} href={`/project/${pick.project.slug}`} className="group block">
                        <article className="h-full rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-slate-400">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-blue-600 mb-1">#{pick.rank}</div>
                              <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                                {pick.project.name}
                              </h4>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                              <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                              {formatStars(pick.project.stars)}
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-slate-700 mb-3">{pick.week_note}</p>
                          <p className="text-sm leading-6 text-slate-500 mb-4">{pick.project.one_liner}</p>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                              {difficultyLabels[pick.project.difficulty]}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                              {pick.project.language}
                            </span>
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                              {pick.project.category.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
