import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: `About Us — ${SITE_NAME}`,
  description: 'Learn about our mission, curation process, and how we select each GitHub project.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">About {SITE_NAME}</h1>

      <div className="prose prose-slate max-w-none">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Our Mission</h2>
        <p className="text-slate-700 mb-6">
          GitHub hosts millions of repositories, but finding the ones that actually solve your problems is hard.{' '}
          {SITE_NAME} exists to bridge that gap. We find, test, and explain the best open source projects in plain English —
          so you don&apos;t need a computer science degree to benefit from them.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">How We Choose Projects</h2>
        <p className="text-slate-700 mb-4">Every project we feature must meet these criteria:</p>
        <ul className="list-disc pl-6 text-slate-700 mb-6 space-y-2">
          <li><strong>Community validation:</strong> At least 500 stars on GitHub</li>
          <li><strong>Active maintenance:</strong> Recent commits within the last 6 months</li>
          <li><strong>Clear documentation:</strong> A README that explains what the project does</li>
          <li><strong>Open source license:</strong> MIT, Apache, GPL, or similar</li>
          <li><strong>Real-world value:</strong> Solves a genuine problem for non-developers or significantly improves developer productivity</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">Why We Write Our Own Descriptions</h2>
        <p className="text-slate-700 mb-6">
          GitHub READMEs are written for developers. We rewrite every description to answer a different question:
          &quot;What can this do for me?&quot; Each project gets original highlights, use cases, and editor notes
          that no automated scraper could produce.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">Who We Are</h2>
        <p className="text-slate-700 mb-6">
          {SITE_NAME} is part of the next-happy.com site matrix — a collection of independently operated
          websites focused on practical tools and content. We believe open source should be accessible to everyone,
          not just people who write code for a living.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">Suggest a Project</h2>
        <p className="text-slate-700">
          Found a GitHub project you think more people should know about?{' '}
          <a href="/submit" className="text-blue-600 hover:underline">Submit it here</a>.
        </p>
      </div>
    </div>
  );
}
