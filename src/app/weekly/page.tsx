import Link from 'next/link';
import { getWeeklyPicks, getProjectBySlug } from '@/lib/data';
import { getCurrentYear } from '@/lib/utils';
import ProjectCard from '@/components/ui/ProjectCard';
import type { Project } from '@/lib/types';

export async function generateMetadata() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const month = months[now.getMonth()];
  const year = getCurrentYear();

  return {
    title: `GitHub Weekly Picks — Top Open Source Projects ${month} ${year} | GitHubPicks`,
    description: 'Our curated selection of the best GitHub projects this week, with editor notes and use cases.',
  };
}

export default async function WeeklyPage() {
  const weeklyData = getWeeklyPicks();

  const pickProjects = weeklyData.picks
    .map((pick) => {
      const project = getProjectBySlug(pick.project_id);
      return project ? { ...project, week_note: pick.week_note, rank: pick.rank } : null;
    })
    .filter((p): p is Project & { week_note: string; rank: number } => p !== null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Weekly Picks</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Weekly Picks — {weeklyData.current_week}</h1>
      <p className="text-slate-600 mb-8">Our top 3 open source picks this week, hand-selected by the editorial team.</p>

      {pickProjects.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No picks for this week yet. Check back soon!</p>
      ) : (
        <div className="space-y-6 mb-10">
          {pickProjects.map((project) => (
            <div key={project.slug} className="border border-slate-200 rounded-lg p-6 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-blue-600">#{project.rank}</span>
              </div>
              <ProjectCard project={project} variant="large" />
              <p className="text-sm text-slate-500 mt-3 italic">{project.week_note}</p>
            </div>
          ))}
        </div>
      )}

      {weeklyData.archive.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Past Picks</h2>
          <div className="space-y-2">
            {weeklyData.archive.map((archive) => (
              <div key={archive.week} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-2">{archive.week}</h3>
                <div className="flex flex-wrap gap-2">
                  {archive.picks.map((pick, i) => {
                    const project = getProjectBySlug(pick.project_id);
                    return project ? (
                      <Link key={i} href={`/project/${project.slug}`} className="text-sm text-blue-600 hover:underline">
                        {i + 1}. {project.name}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
