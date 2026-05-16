import Link from 'next/link';
import type { Category } from '@/lib/types';
import { Brain, Server, Zap, DollarSign, Palette, Wrench, Shield, Home, BarChart3, FileText, Folder } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Server,
  Zap,
  DollarSign,
  Palette,
  Wrench,
  Shield,
  Home,
  BarChart3,
  FileText,
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Folder;

  return (
    <Link href={`/category/${category.slug}`} className="block group">
      <article className="border border-slate-200 rounded-lg p-5 hover:border-slate-400 transition-colors bg-white h-full">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
            <IconComponent className="w-6 h-6 text-slate-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h3 className="font-semibold group-hover:text-blue-600 transition-colors">{category.name}</h3>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {category.project_count}
              </span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{category.description}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
