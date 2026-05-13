import { getLatestProjects } from '@/lib/data';
import ProjectCard from '@/components/ui/ProjectCard';
import type { Project } from '@/lib/types';

interface LatestProjectsSectionProps {
  projects?: Project[];
}

export default function LatestProjectsSection({ projects }: LatestProjectsSectionProps) {
  const latest = projects || getLatestProjects(6);

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Latest Additions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
