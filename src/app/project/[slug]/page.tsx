import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Code, Download, ExternalLink, Rocket, Star, Calendar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getProjects, getProjectBySlug, getCategories } from '@/lib/data';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { formatStars, formatDate } from '@/lib/utils';
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
  const title = `${project.name} GitHub Project Review 2026`;
  const description = `${project.one_liner}. Read plain-English use cases, setup notes, difficulty, license, and when this open source project is worth trying.`;

  return {
    title,
    description: description.slice(0, 158),
    openGraph: {
      title: `${project.name} | GitHubPicks`,
      description: project.one_liner,
      type: 'article',
      url: `${SITE_URL}/project/${project.slug}`,
      publishedTime: project.added_date,
      modifiedTime: project.added_date,
    },
    twitter: {
      card: 'summary',
      title: `${project.name} | GitHubPicks`,
      description: project.one_liner,
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

function getSetupLabel(project: Project) {
  if (project.tags.includes('desktop')) return 'Download the desktop app';
  if (project.tags.includes('docker') || project.tags.includes('self-hosted')) return 'Self-host or run with Docker';
  if (project.tags.includes('no-code')) return 'Start with the official guide';
  return 'Read the installation guide';
}

function getFitSummary(project: Project) {
  if (project.difficulty === 1) {
    return 'Good first choice if you want a practical tool without spending the afternoon reading developer docs.';
  }

  if (project.difficulty === 2) {
    return 'Best for users who are comfortable following setup instructions or running a self-hosted tool.';
  }

  return 'Best for developers and technical teams that want control, extensibility, and a deeper setup path.';
}

function getAudienceLabel(project: Project) {
  return project.target_audience.map((audience) => audience.replace(/-/g, ' ')).join(', ');
}

function getInstallCaution(project: Project) {
  if (project.difficulty === 1) {
    return `${project.name} is one of the easier projects in this category to try first. You should still check the official installation page, but the expected path is closer to downloading an app, running a simple command, or following a guided setup than maintaining a complex server.`;
  }

  if (project.difficulty === 2) {
    return `${project.name} is approachable if you are comfortable following documentation, using Docker, or adjusting a few settings. It is not a one-click consumer app, but the setup cost is reasonable when the project solves a recurring workflow problem.`;
  }

  return `${project.name} is best treated as a technical project. It may require command-line work, hosting knowledge, environment variables, or debugging. The extra effort can be worth it for teams that need control, but casual users should read the docs before committing time.`;
}

function getSkipReason(project: Project) {
  if (project.tags.includes('self-hosted') || project.tags.includes('docker')) {
    return `Skip it for now if you do not want to maintain a server, run Docker, or think about updates and backups. A hosted commercial tool may be simpler when convenience matters more than control.`;
  }

  if (project.difficulty === 3) {
    return `Skip it for now if you need an immediate no-code result. This project is more valuable when you have technical support or a developer willing to adapt it to your workflow.`;
  }

  return `Skip it for now if your current tool already solves the same problem well. Open source is most valuable when it gives you privacy, flexibility, cost savings, or a workflow improvement you cannot get from your existing setup.`;
}

function getWorkflowSummary(project: Project) {
  const firstUseCase = project.use_cases[0];
  const secondUseCase = project.use_cases[1];
  const tagText = project.tags.slice(0, 4).join(', ');

  return `${project.name} is most useful when your goal matches one of its real use cases rather than when you are simply browsing popular repositories. Start by checking whether "${firstUseCase.scenario.toLowerCase()}" sounds like your situation. If it does, read the install guide, try the smallest possible setup, and only then decide whether to bring it into a personal workflow or team stack. The project is tagged around ${tagText}, which gives you a quick sense of the ecosystem it belongs to.${secondUseCase ? ` It can also fit "${secondUseCase.scenario.toLowerCase()}", but that second path may require a different setup or expectation.` : ''}`;
}

function getActionLinks(project: Project) {
  const installHref = project.install_url || project.docs_url || `${project.github_url}#readme`;
  const docsHref = project.docs_url || `${project.github_url}#readme`;

  return [
    {
      label: 'GitHub Repository',
      href: project.github_url,
      icon: Code,
      tone: 'primary',
    },
    project.website_url
      ? {
          label: 'Official Website',
          href: project.website_url,
          icon: ExternalLink,
          tone: 'secondary',
        }
      : null,
    {
      label: 'Install Guide',
      href: installHref,
      icon: Download,
      tone: 'secondary',
    },
    !project.website_url || docsHref !== project.website_url
      ? {
          label: 'Docs / README',
          href: docsHref,
          icon: BookOpen,
          tone: 'secondary',
        }
      : null,
    project.deploy_url
      ? {
          label: 'Deploy Guide',
          href: project.deploy_url,
          icon: Rocket,
          tone: 'secondary',
        }
      : null,
  ].filter((link): link is { label: string; href: string; icon: LucideIcon; tone: string } => Boolean(link));
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
  const projectUrl = `${SITE_URL}/project/${project.slug}`;
  const actionLinks = getActionLinks(project);
  const setupLabel = getSetupLabel(project);
  const fitSummary = getFitSummary(project);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.name,
    description: project.one_liner,
    url: projectUrl,
    mainEntityOfPage: projectUrl,
    datePublished: project.added_date,
    dateModified: project.added_date,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    about: {
      '@type': 'SoftwareSourceCode',
      name: project.name,
      codeRepository: project.github_url,
      programmingLanguage: project.language,
      license: project.license,
    },
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

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            {breadcrumbName}
          </span>
          <DifficultyBadge level={project.difficulty} />
          <span className="text-xs bg-slate-100 px-2 py-1 rounded">{project.language}</span>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded">{project.license}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{project.name}</h1>
        <p className="text-xl text-slate-700 font-medium leading-relaxed">{project.one_liner}</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-8">
        <div className="border border-slate-200 rounded-lg p-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-slate-900">Editor&apos;s Take</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">{project.editors_note}</p>
          <p className="text-slate-600 mt-3 leading-relaxed">{fitSummary}</p>
        </div>

        <aside className="border border-slate-200 rounded-lg p-5 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Project Snapshot</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Stars</dt>
              <dd className="font-semibold flex items-center gap-1 text-slate-900">
                <Star className="w-4 h-4 fill-current text-amber-500" aria-hidden="true" />
                {formatStars(project.stars)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Setup</dt>
              <dd className="font-semibold text-right text-slate-900">{setupLabel}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Added</dt>
              <dd className="font-semibold flex items-center gap-1 text-slate-900">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {formatDate(project.added_date)}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mb-8 border border-slate-200 rounded-lg p-5 bg-white">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Start Here</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actionLinks.map((link) => {
            const Icon = link.icon;
            const className =
              link.tone === 'primary'
                ? 'bg-slate-900 text-white hover:bg-slate-700'
                : 'border border-slate-200 text-slate-800 hover:border-slate-400 bg-white';

            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${className}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {link.label}
              </a>
            );
          })}
        </div>
      </section>

      {/* Highlights */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Why It Stands Out</h2>
        <ul className="grid grid-cols-1 gap-3">
          {project.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-700">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-700">
                {i + 1}
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot slot="result" />

      {/* Use Cases */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Best Use Cases</h2>
        <div className="space-y-4">
          {project.use_cases.map((uc, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <h4 className="font-medium text-slate-900 mb-1">{uc.scenario}</h4>
              <p className="text-sm text-slate-600">{uc.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Plain-English Buying Guide
        </h2>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            {project.name} is a good candidate for {getAudienceLabel(project)} who want an open
            source option in the {breadcrumbName.toLowerCase()} category. The key question is not
            whether the repository is popular. The better question is whether it removes a real
            friction point from your day: replacing a paid SaaS tool, keeping more data under your
            control, speeding up a repeated task, or giving a team a workflow they can inspect and
            adapt.
          </p>
          <p>{getWorkflowSummary(project)}</p>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Before You Install</h2>
          <p className="text-slate-700 leading-relaxed">{getInstallCaution(project)}</p>
          <p className="mt-3 text-sm text-slate-600">
            Check the {project.license} license, the {project.language} ecosystem, and the latest
            activity on GitHub before using it for important work.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">When to Skip It</h2>
          <p className="text-slate-700 leading-relaxed">{getSkipReason(project)}</p>
          <p className="mt-3 text-sm text-slate-600">
            If you are unsure, compare it with the similar projects below before spending time on a
            full setup.
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Who Should Try It</h2>
        <div className="flex flex-wrap gap-2">
          {project.target_audience.map((audience) => (
            <span key={audience} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full capitalize">
              {audience.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </section>

      {project.cross_links && project.cross_links.length > 0 && (
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Related Resources</h2>
          <div className="flex flex-wrap gap-3">
            {project.cross_links.map((link, i) => (
              <a key={i} href={link.url} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:border-slate-400 transition-colors text-blue-600">
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                {link.label}
              </a>
            ))}
          </div>
        </section>
      )}

      <AdSlot slot="middle" />

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
