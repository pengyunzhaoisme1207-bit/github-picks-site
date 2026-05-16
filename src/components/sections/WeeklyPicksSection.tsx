import { getWeeklyPicks, getProjectBySlug } from '@/lib/data';
import ProjectCard from '@/components/ui/ProjectCard';
import type { Project } from '@/lib/types';

export default function WeeklyPicksSection() {
  const weeklyData = getWeeklyPicks();

  const pickProjects = weeklyData.picks
    .map((pick) => getProjectBySlug(pick.project_id))
    .filter((p): p is Project => p !== undefined)
    .slice(0, 5);

  if (pickProjects.length === 0) return null;

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 mb-1">Freshly updated</p>
            <h2 className="text-2xl font-bold text-slate-900">This Week&apos;s Picks — {weeklyData.current_week}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Five current GitHub projects selected for recent activity, practical use cases, and clear value beyond developer hype.
            </p>
          </div>
          <a href="/weekly" className="text-sm font-medium text-blue-600 hover:underline">View full archive →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {pickProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="large" />
          ))}
        </div>
      </div>
    </section>
  );
}
