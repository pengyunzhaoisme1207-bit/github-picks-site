import { getProjects } from '@/lib/data';
import HeroSection from '@/components/sections/HeroSection';
import WeeklyPicksSection from '@/components/sections/WeeklyPicksSection';
import CategoryGridSection from '@/components/sections/CategoryGridSection';
import LatestProjectsSection from '@/components/sections/LatestProjectsSection';
import AdSlot from '@/components/ui/AdSlot';
import { SITE_NAME } from '@/lib/constants';

export default function HomePage() {
  const projects = getProjects();
  const latest = projects
    .sort((a, b) => new Date(b.added_date).getTime() - new Date(a.added_date).getTime())
    .slice(0, 6);

  return (
    <div>
      <HeroSection projects={projects} />
      <WeeklyPicksSection />
      <AdSlot slot="top" />
      <CategoryGridSection />
      <LatestProjectsSection projects={latest} />
      <AdSlot slot="middle" />
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Why {SITE_NAME}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-lg mb-2">Human Curation</h3>
              <p className="text-slate-600 text-sm">Every project is hand-picked with editorial notes — no algorithms, no data dumps.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-lg mb-2">Plain English</h3>
              <p className="text-slate-600 text-sm">No jargon. We explain what each tool does and who it&apos;s for, in words anyone can understand.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-lg mb-2">Scene-Based</h3>
              <p className="text-slate-600 text-sm">Navigate by &ldquo;what problem do I have&rdquo; instead of &ldquo;what technology&rdquo;.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
