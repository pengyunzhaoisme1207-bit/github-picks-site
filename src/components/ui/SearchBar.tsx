'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Search } from 'lucide-react';
import type { Project } from '@/lib/types';
import { formatStars } from '@/lib/utils';

interface SearchBarProps {
  projects: Project[];
}

export default function SearchBar({ projects }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => {
    return new Fuse(projects, {
      keys: ['name', 'tags', 'one_liner', 'category'],
      threshold: 0.4,
      includeScore: true,
    });
  }, [projects]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  }, [query, fuse]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShowResults = isOpen && results.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search projects by name, tag, or description..."
          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>
      {shouldShowResults && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {results.map((project) => (
            <Link
              key={project.slug}
              href={`/project/${project.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
              onClick={() => setIsOpen(false)}
            >
              <div>
                <span className="font-medium">{project.name}</span>
                <span className="text-sm text-slate-500 ml-2">{project.one_liner.slice(0, 60)}...</span>
              </div>
              <span className="text-xs text-amber-500 font-medium">{formatStars(project.stars)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
