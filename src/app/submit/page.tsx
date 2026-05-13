import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: `Submit a Project — ${SITE_NAME}`,
  description: 'Recommend an open source project to be featured on GitHubPicks.',
};

export default function SubmitPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Submit a Project</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 mb-6">
          Know a GitHub project that deserves more attention? Submit it and our editorial team
          will review it for inclusion on {SITE_NAME}.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">What We Look For</h2>
        <ul className="list-disc pl-6 text-slate-700 mb-6 space-y-2">
          <li>At least 500 stars on GitHub</li>
          <li>Active development (commits within the last 6 months)</li>
          <li>Clear README explaining what the project does</li>
          <li>Open source license (MIT, Apache, GPL, etc.)</li>
          <li>Useful to non-developers or significantly improves developer productivity</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">How to Submit</h2>
        <p className="text-slate-700 mb-4">
          Send us an email with the following information:
        </p>
        <ol className="list-decimal pl-6 text-slate-700 mb-6 space-y-2">
          <li>Project name and GitHub URL</li>
          <li>A one-sentence description of what it does</li>
          <li>Why you think it should be featured</li>
          <li>Who the target users are</li>
        </ol>

        <p className="text-slate-700 mb-6">
          Email: <a href="mailto:hello@next-happy.com" className="text-blue-600 hover:underline">hello@next-happy.com</a>
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> Submission does not guarantee inclusion. We review each project
            against our curation standards and may take up to 2 weeks to respond.
          </p>
        </div>
      </div>
    </div>
  );
}
