import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getCategoryBySlug, getProjectsByCategory } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';
import { getCurrentYear } from '@/lib/utils';
import ProjectCard from '@/components/ui/ProjectCard';

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
    title: `Best ${category.name} GitHub Projects ${year} — Free & Open Source | GitHubPicks`,
    description: category.description,
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{category.name}</h1>
        <p className="text-slate-600 max-w-2xl">{category.description}</p>
        <p className="text-sm text-slate-500 mt-2">{projects.length} projects in this category</p>
      </div>

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
