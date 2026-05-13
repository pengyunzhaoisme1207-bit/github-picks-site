import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata = {
  title: `Privacy Policy — ${SITE_NAME}`,
  description: 'Privacy policy and data handling practices for GitHubPicks.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-6">Last updated: May 13, 2026</p>

      <div className="prose prose-slate max-w-none">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Introduction</h2>
        <p className="text-slate-700 mb-6">
          {SITE_NAME} (&quot;we&quot;, &quot;our&quot;, or &quot;this website&quot;) is committed to protecting your privacy.
          This policy explains what information we collect, how we use it, and your rights.
          The website is located at {SITE_URL}.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Information We Collect</h2>
        <p className="text-slate-700 mb-4">This is a static website. We do not:</p>
        <ul className="list-disc pl-6 text-slate-700 mb-6 space-y-1">
          <li>Collect personal information from visitors</li>
          <li>Require user accounts or registration</li>
          <li>Store cookies for tracking purposes</li>
          <li>Share data with third-party analytics</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Google AdSense</h2>
        <p className="text-slate-700 mb-6">
          We use Google AdSense to display advertisements on this website. Google AdSense may use cookies to serve
          ads based on your browsing history and interests. You can opt out of personalized advertising by visiting
          <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline ml-1">Google Ads Settings</a>.
          Google&apos;s use of advertising cookies is governed by the{' '}
          <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline">Google Privacy &amp; Terms page</a>.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Server Logs</h2>
        <p className="text-slate-700 mb-6">
          Our hosting provider (Vercel) may collect standard server logs including your IP address, browser type,
          and pages visited. This data is used solely for maintaining website availability and is not shared with third parties.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">5. External Links</h2>
        <p className="text-slate-700 mb-6">
          This website contains links to external sites (e.g., GitHub repositories). We are not responsible for
          the privacy practices of those sites. We recommend reviewing their individual privacy policies.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Contact</h2>
        <p className="text-slate-700">
          If you have questions about this privacy policy, please{' '}
          <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.
        </p>
      </div>
    </div>
  );
}
