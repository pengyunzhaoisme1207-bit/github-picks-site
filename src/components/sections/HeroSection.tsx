import SearchBar from '@/components/ui/SearchBar';
import type { Project } from '@/lib/types';

interface HeroSectionProps {
  projects: Project[];
}

export default function HeroSection({ projects }: HeroSectionProps) {
  return (
    <section className="py-16 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 max-w-3xl mx-auto leading-tight">
        The Best GitHub Projects, Explained for Everyone
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
        Weekly curated picks with use cases, difficulty ratings, and editor&apos;s notes. No coding required to understand.
      </p>
      <SearchBar projects={projects} />
    </section>
  );
}
