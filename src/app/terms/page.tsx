import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata = {
  title: `Terms of Service — ${SITE_NAME}`,
  description:
    'Terms of Service for GitHubPicks, including editorial content, external repository links, advertising, and affiliate disclosure.',
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-6">Last updated: June 4, 2026</p>

      <div className="prose prose-slate max-w-none">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Website Purpose</h2>
        <p className="text-slate-700 mb-6">
          {SITE_NAME} is an editorial directory of open source GitHub projects. We summarize,
          categorize, and explain projects in plain English so readers can decide whether a
          repository is worth exploring. We are not affiliated with GitHub or with the maintainers
          of the projects we list unless explicitly stated.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Editorial Content</h2>
        <p className="text-slate-700 mb-6">
          We try to keep project details, star counts, links, licenses, and setup notes accurate,
          but open source projects change frequently. Before installing, deploying, or relying on a
          project, always verify the latest information on the official repository or website.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">3. External Links</h2>
        <p className="text-slate-700 mb-6">
          Many pages link to GitHub repositories, documentation, project websites, and related
          tools. These external sites are controlled by their own owners. We are not responsible for
          their content, licenses, privacy practices, security, or availability.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Advertising and Affiliate Disclosure</h2>
        <p className="text-slate-700 mb-6">
          This website may display ads, including Google AdSense. Some future links may be
          affiliate or sponsored links, and when that happens we will disclose the relationship. We
          do not recommend projects solely because of advertising or affiliate opportunities.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">5. No Professional Advice</h2>
        <p className="text-slate-700 mb-6">
          Our project notes are informational. They are not security, legal, financial, compliance,
          or engineering advice. If a project will handle sensitive data, business operations, or
          production infrastructure, review the code, license, and security posture yourself before
          adopting it.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Contact</h2>
        <p className="text-slate-700">
          To report outdated information, request a correction, or ask about these terms, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
