'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import type { Category, SearchProject } from '@/lib/types';
import { formatStars } from '@/lib/utils';

interface ProjectDirectoryProps {
  projects: SearchProject[];
  categories: Category[];
}

type SortMode = 'featured' | 'popular' | 'latest' | 'beginner';

const difficultyLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Some setup',
  3: 'Developer',
};

export default function ProjectDirectory({ projects, categories }: ProjectDirectoryProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [audience, setAudience] = useState('all');
  const [tag, setTag] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('featured');

  const categoryCounts = useMemo(() => {
    return projects.reduce<Record<string, number>>((counts, project) => {
      counts[project.category] = (counts[project.category] || 0) + 1;
      return counts;
    }, {});
  }, [projects]);

  const audiences = useMemo(() => {
    return Array.from(new Set(projects.flatMap((project) => project.target_audience || []))).sort();
  }, [projects]);

  const tags = useMemo(() => {
    return Array.from(new Set(projects.flatMap((project) => project.tags))).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...projects]
      .filter((project) => {
        const matchesQuery =
          !normalizedQuery ||
          [project.name, project.one_liner, project.category, project.language, ...(project.tags || [])]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesCategory = category === 'all' || project.category === category;
        const matchesDifficulty = difficulty === 'all' || String(project.difficulty) === difficulty;
        const matchesAudience = audience === 'all' || project.target_audience?.includes(audience);
        const matchesTag = tag === 'all' || project.tags.includes(tag);

        return matchesQuery && matchesCategory && matchesDifficulty && matchesAudience && matchesTag;
      })
      .sort((a, b) => {
        if (sortMode === 'popular') return b.stars - a.stars;
        if (sortMode === 'latest') {
          return new Date(b.added_date || 0).getTime() - new Date(a.added_date || 0).getTime();
        }
        if (sortMode === 'beginner') return (a.difficulty || 3) - (b.difficulty || 3);

        const featuredScore = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredScore !== 0) return featuredScore;
        const weeklyScore = Number(Boolean(b.weekly_pick)) - Number(Boolean(a.weekly_pick));
        if (weeklyScore !== 0) return weeklyScore;
        return b.stars - a.stars;
      });
  }, [audience, category, difficulty, projects, query, sortMode, tag]);

  return (
    <section className="px-4 pb-12" aria-labelledby="directory-heading">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        <aside className="lg:sticky lg:top-20 border border-slate-200 rounded-lg bg-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <h2 className="font-semibold text-slate-900">Browse the Directory</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="project-search" className="block text-sm font-medium text-slate-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  id="project-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ollama, PDF, finance..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Categories</h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-left ${category === 'all' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span>All projects</span>
                  <span>{projects.length}</span>
                </button>
                {categories.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setCategory(item.slug)}
                    className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-left ${category === item.slug ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>{item.name}</span>
                    <span>{categoryCounts[item.slug] || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 mb-2">Difficulty</span>
                <select
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="all">All levels</option>
                  <option value="1">Beginner friendly</option>
                  <option value="2">Some setup</option>
                  <option value="3">Developer oriented</option>
                </select>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700 mb-2">Audience</span>
                <select
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="all">Everyone</option>
                  {audiences.map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700 mb-2">Tag</span>
                <select
                  value={tag}
                  onChange={(event) => setTag(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="all">All tags</option>
                  {tags.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            <div>
              <h2 id="directory-heading" className="text-2xl font-bold text-slate-900">
                Open Source Project Directory
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {filteredProjects.length} of {projects.length} projects matched
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Sort
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              >
                <option value="featured">Featured first</option>
                <option value="popular">Most starred</option>
                <option value="latest">Latest added</option>
                <option value="beginner">Beginner friendly</option>
              </select>
            </label>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-medium text-slate-900">No projects matched these filters.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                  setDifficulty('all');
                  setAudience('all');
                  setTag('all');
                }}
                className="mt-3 text-sm font-medium text-blue-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <Link key={project.slug} href={`/project/${project.slug}`} className="group block">
                  <article className="h-full rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-slate-400">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                        {project.name}
                      </h3>
                      <span className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                        <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                        {formatStars(project.stars)}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600 mb-4">{project.one_liner}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                        {difficultyLabels[project.difficulty || 3]}
                      </span>
                      {project.language && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{project.language}</span>
                      )}
                      {project.tags.slice(0, 3).map((item) => (
                        <span key={item} className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
