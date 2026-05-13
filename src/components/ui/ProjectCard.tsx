import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Project } from '@/lib/types';
import { formatStars } from '@/lib/utils';
import DifficultyBadge from './DifficultyBadge';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'large';
}

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  if (variant === 'large') {
    return (
      <Link href={`/project/${project.slug}`} className="block group">
        <article className="border border-slate-200 rounded-lg p-6 hover:border-slate-400 transition-colors bg-white">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">{project.name}</h3>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{formatStars(project.stars)}</span>
            </div>
          </div>
          <p className="text-slate-600 mb-3">{project.one_liner}</p>
          <div className="flex items-center gap-3">
            <DifficultyBadge level={project.difficulty} />
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{project.language}</span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded capitalize">{project.category.replace('-', ' ')}</span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/project/${project.slug}`} className="block group">
      <article className="border border-slate-200 rounded-lg p-4 hover:border-slate-400 transition-colors bg-white h-full flex flex-col">
        <h3 className="font-semibold group-hover:text-blue-600 transition-colors mb-1">{project.name}</h3>
        <p className="text-sm text-slate-600 mb-3 flex-grow line-clamp-2">{project.one_liner}</p>
        <div className="flex items-center justify-between mt-auto">
          <DifficultyBadge level={project.difficulty} />
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium">{formatStars(project.stars)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
