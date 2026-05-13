import { getWeeklyPicks, getProjectBySlug } from '@/lib/data';
import ProjectCard from '@/components/ui/ProjectCard';
import type { Project } from '@/lib/types';

export default function WeeklyPicksSection() {
  const weeklyData = getWeeklyPicks();

  const pickProjects = weeklyData.picks
    .map((pick) => getProjectBySlug(pick.project_id))
    .filter((p): p is Project => p !== undefined)
    .slice(0, 3);

  if (pickProjects.length === 0) return null;

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">This Week&apos;s Picks — {weeklyData.current_week}</h2>
          <a href="/weekly" className="text-sm text-blue-600 hover:underline">View all →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pickProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="large" />
          ))}
        </div>
      </div>
    </section>
  );
}
