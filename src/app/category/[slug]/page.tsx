import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getCategoryBySlug, getProjectsByCategory } from '@/lib/data';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { getCurrentYear } from '@/lib/utils';
import ProjectCard from '@/components/ui/ProjectCard';

const CATEGORY_GUIDES: Record<string, { intro: string; bestFor: string; howToChoose: string }> = {
  'ai-tools': {
    intro:
      'Open source AI projects are useful when you want more control than a hosted chatbot can offer. This category focuses on local LLM runners, private chat interfaces, RAG tools, agent builders, and automation platforms that can bring AI into real workflows without forcing every document, prompt, or experiment through a single vendor account.',
    bestFor:
      'Start here if you want to run models locally, build a private knowledge base, test AI automation, or compare open source alternatives before paying for a commercial AI platform.',
    howToChoose:
      'Choose beginner-friendly tools when you only need local chat or a simple UI. Choose developer-oriented projects when you need APIs, custom models, workflow orchestration, or self-hosted team infrastructure.',
  },
  'self-hosted': {
    intro:
      'Self-hosted projects are for people who want ownership over data, configuration, and long-term costs. They can replace cloud subscriptions for notes, documents, dashboards, automation, media, and internal tools, but they also require a little more responsibility around updates, backups, and security.',
    bestFor:
      'This category is best for home lab users, privacy-focused teams, indie makers, and small businesses that prefer controlling their own stack instead of renting every workflow forever.',
    howToChoose:
      'Pick a self-hosted project only when the value is worth the operational work. Check Docker support, backup guidance, authentication, update frequency, and whether you can recover if the server fails.',
  },
  productivity: {
    intro:
      'Open source productivity tools help you organize notes, tasks, calendars, bookmarks, and daily workflows without locking your personal systems into a closed app. The best options here are not just cheaper replacements; they give you portability, markdown-friendly data, automation, or a calmer interface.',
    bestFor:
      'Use this category when you want a better personal operating system for work, study, writing, planning, or team coordination.',
    howToChoose:
      'Start with the tool that matches your existing habit. A powerful app is not helpful if it asks you to rebuild your entire workflow on day one.',
  },
  finance: {
    intro:
      'Finance and money projects can help with budgeting, expense tracking, personal dashboards, and self-hosted alternatives to paid finance apps. The strongest tools in this category make money data easier to understand while keeping sensitive records away from unnecessary third-party services.',
    bestFor:
      'This category is useful for people who want private budget tracking, small business visibility, or a clearer picture of subscriptions and spending.',
    howToChoose:
      'Be careful with setup quality and data import support. A finance tool should make reconciliation, export, backup, and privacy easy to reason about before you trust it with real records.',
  },
  'design-tools': {
    intro:
      'Design and creative open source projects give makers alternatives to expensive design suites, diagram tools, image editors, and publishing workflows. Some are polished enough for non-designers, while others are better for technical creators who want flexible formats and self-hosted control.',
    bestFor:
      'Use this category when you need diagrams, mockups, visual assets, image editing, or creative workflows without committing to a large subscription.',
    howToChoose:
      'Choose based on output format and collaboration needs. A personal design utility can be simple; a team design workflow needs sharing, versioning, and predictable exports.',
  },
  'developer-tools': {
    intro:
      'Developer tools are the most crowded part of GitHub, so curation matters. This category highlights projects that make coding, debugging, terminal work, monitoring, local development, or software delivery easier, with plain-English notes about who should actually use them.',
    bestFor:
      'This category is strongest for developers, technical founders, and teams looking for tools that save repeated engineering time.',
    howToChoose:
      'Prioritize tools that fit your current stack and reduce an existing pain. Avoid adopting a popular developer tool just because it is trending if it adds another workflow to maintain.',
  },
  'security-privacy': {
    intro:
      'Security and privacy projects can protect passwords, networks, personal data, and team workflows, but they require careful evaluation. This category favors projects with clear use cases, active maintenance, understandable setup paths, and practical benefits for everyday users or small teams.',
    bestFor:
      'Start here if you want better password management, private infrastructure, network filtering, or tools that reduce dependence on opaque cloud services.',
    howToChoose:
      'Security tools should be judged more strictly than ordinary utilities. Check maintenance, documentation, backup paths, and whether you understand the failure mode before relying on them.',
  },
  'home-media': {
    intro:
      'Home and media projects turn a home server, spare computer, or small device into something useful: media streaming, smart home control, dashboards, automation, or entertainment workflows. The appeal is control and customization, not just saving money.',
    bestFor:
      'This category is for home lab users, families, media collectors, and anyone who wants personal infrastructure that feels useful rather than experimental.',
    howToChoose:
      'Check device support, mobile apps, backup options, and how much maintenance the project expects. The best home tool is the one you will still want to maintain in six months.',
  },
  'data-analytics': {
    intro:
      'Open source data and analytics tools help you understand traffic, product usage, business metrics, logs, and dashboards without sending every event to a large enterprise platform. Many are excellent fits for independent sites, small products, and internal reporting.',
    bestFor:
      'Use this category when you need practical visibility into numbers: website analytics, product events, dashboards, monitoring, or lightweight business intelligence.',
    howToChoose:
      'Choose based on the question you need answered. Simple traffic analytics, operational monitoring, and exploratory dashboards are different jobs and deserve different tools.',
  },
  'writing-content': {
    intro:
      'Writing and content projects support notes, publishing, knowledge bases, documentation, and long-form thinking. The best open source options here help you keep ownership of your words while still making writing, linking, searching, and publishing easier.',
    bestFor:
      'This category is useful for writers, students, researchers, content operators, and teams that want durable knowledge systems instead of scattered documents.',
    howToChoose:
      'Look for export formats, search quality, linking model, and publishing options. A writing tool should make your archive more valuable over time, not trap it.',
  },
};

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found' };

  const year = getCurrentYear();
  return {
    title: `Best ${category.name} GitHub Projects ${year} — Free & Open Source`,
    description: `${category.description} Browse ${category.project_count} curated projects in this category, with editor notes and use cases.`,
    openGraph: {
      title: `Best ${category.name} GitHub Projects ${year} | ${SITE_NAME}`,
      description: `${category.description} Browse ${category.project_count} curated projects in this category, with editor notes and use cases.`,
      url: `${SITE_URL}/category/${category.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `Best ${category.name} GitHub Projects ${year} | ${SITE_NAME}`,
      description: `${category.description} Browse ${category.project_count} curated projects in this category, with editor notes and use cases.`,
    },
    alternates: {
      canonical: `${SITE_URL}/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const projects = getProjectsByCategory(slug)
    .sort((a, b) => b.stars - a.stars);
  const guide = CATEGORY_GUIDES[category.slug];
  const categoryUrl = `${SITE_URL}/category/${category.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} GitHub Projects`,
    description: category.description,
    url: categoryUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: projects.slice(0, 12).map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/project/${project.slug}`,
      name: project.name,
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{category.name}</h1>
        <p className="text-slate-600 max-w-2xl">{category.description}</p>
        <p className="text-sm text-slate-500 mt-2">
          {category.project_count} curated projects in this category, sorted by stars.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/weekly" className="text-blue-600 hover:underline">
            See this week&apos;s picks
          </Link>
          <Link href="/" className="text-blue-600 hover:underline">
            Browse all categories
          </Link>
        </div>
      </div>

      {guide && (
        <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              What This Category Helps You Do
            </h2>
            <p className="text-slate-700 leading-relaxed">{guide.intro}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Best For</h2>
            <p className="text-slate-700 leading-relaxed">{guide.bestFor}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 lg:col-span-3">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              How to Choose from These Projects
            </h2>
            <p className="text-slate-700 leading-relaxed">{guide.howToChoose}</p>
          </div>
        </section>
      )}

      {projects.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No projects in this category yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
