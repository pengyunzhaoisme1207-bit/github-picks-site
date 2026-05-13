import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: `Contact Us — ${SITE_NAME}`,
  description: 'Get in touch with the GitHubPicks team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Contact Us</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 mb-6">
          Have a question, feedback, or want to report an issue? We&apos;d love to hear from you.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">Email</h2>
        <p className="text-slate-700 mb-6">
          You can reach us at <a href="mailto:hello@next-happy.com" className="text-blue-600 hover:underline">hello@next-happy.com</a>.
          We aim to respond within 48 hours.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">Project Submissions</h2>
        <p className="text-slate-700 mb-6">
          If you maintain an open source project and think it would be a good fit for {SITE_NAME},
          please use our <a href="/submit" className="text-blue-600 hover:underline">submission page</a>.
          Include a link to the repository and a brief explanation of why it should be featured.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">Corrections</h2>
        <p className="text-slate-700">
          If you notice incorrect information about a project (wrong stars, outdated description, broken links),
          please email us with the project name and the correction. We update our database weekly.
        </p>
      </div>
    </div>
  );
}
