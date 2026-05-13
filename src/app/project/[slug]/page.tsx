import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Star, Calendar, Code } from 'lucide-react';
import { getProjects, getProjectBySlug, getCategories } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';
import { formatStars, getDifficultyStars, formatDate } from '@/lib/utils';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import AdSlot from '@/components/ui/AdSlot';
import ProjectCard from '@/components/ui/ProjectCard';
import type { Project } from '@/lib/types';

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.name} — ${project.one_liner} | GitHubPicks`,
    description: project.editors_note.slice(0, 155),
    openGraph: {
      title: `${project.name} | GitHubPicks`,
      description: project.one_liner,
      type: 'article',
      publishedTime: project.added_date,
    },
    alternates: {
      canonical: `${SITE_URL}/project/${project.slug}`,
    },
  };
}

function getBreadcrumb(categorySlug: string) {
  const categories = getCategories();
  const cat = categories.find((c) => c.slug === categorySlug);
  return cat?.name || 'Category';
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const relatedProjects = project.related_projects
    .map((id) => getProjects().find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined)
    .slice(0, 3);

  const breadcrumbName = getBreadcrumb(project.category);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.name,
    description: project.one_liner,
    datePublished: project.added_date,
    author: { '@type': 'Organization', name: 'GitHubPicks' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${project.category}`} className="hover:text-slate-900">{breadcrumbName}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{project.name}</span>
      </nav>

      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.name}</h1>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">{formatStars(project.stars)}</span>
        </div>
        <span className="text-xs bg-slate-100 px-2 py-1 rounded">{project.language}</span>
        <span className="text-xs bg-slate-100 px-2 py-1 rounded">{project.license}</span>
        <DifficultyBadge level={project.difficulty} />
      </div>

      {/* One-liner */}
      <p className="text-xl text-slate-700 mb-6 font-medium">{project.one_liner}</p>

      {/* Target Audience */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Best For</h3>
        <div className="flex flex-wrap gap-2">
          {project.target_audience.map((audience) => (
            <span key={audience} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full capitalize">
              {audience.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
        <ul className="space-y-2">
          {project.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700">
              <span className="text-green-500 mt-1">✓</span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <AdSlot slot="result" />

      {/* Use Cases */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">When to Use It</h3>
        <div className="space-y-4">
          {project.use_cases.map((uc, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <h4 className="font-medium text-slate-900 mb-1">{uc.scenario}</h4>
              <p className="text-sm text-slate-600">{uc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor's Note */}
      {project.editors_note && (
        <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
          <h3 className="font-semibold text-blue-900 mb-1">Editor&apos;s Note</h3>
          <p className="text-slate-700">{project.editors_note}</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3 mb-6">
        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors">
          <ExternalLink className="w-4 h-4" />
          View on GitHub
        </a>
        {project.website_url && (
          <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:border-slate-400 transition-colors">
            <ExternalLink className="w-4 h-4" />
            Official Website
          </a>
        )}
        {project.cross_links?.map((link, i) => (
          <a key={i} href={link.url} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:border-slate-400 transition-colors text-blue-600">
            <ExternalLink className="w-4 h-4" />
            {link.label}
          </a>
        ))}
      </div>

      <AdSlot slot="middle" />

      {/* Project Data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">Stars</div>
          <div className="font-semibold flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-current text-amber-500" />
            {formatStars(project.stars)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">Language</div>
          <div className="font-semibold flex items-center gap-1 mt-1">
            <Code className="w-4 h-4" />
            {project.language}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">Difficulty</div>
          <div className="font-semibold mt-1">{getDifficultyStars(project.difficulty)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">Added</div>
          <div className="font-semibold flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            {formatDate(project.added_date)}
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Similar Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedProjects.map((rp) => (
              <ProjectCard key={rp.slug} project={rp} />
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
