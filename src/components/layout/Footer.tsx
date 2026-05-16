import Link from 'next/link';
import { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-2">{SITE_NAME}</h4>
            <p className="text-sm text-slate-600">{SITE_TAGLINE}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Navigate</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/" className="text-slate-600 hover:text-slate-900">Home</Link></li>
              <li><Link href="/weekly" className="text-slate-600 hover:text-slate-900">Weekly Picks</Link></li>
            <li><Link href="/about" className="text-slate-600 hover:text-slate-900">About</Link></li>
            <li><Link href="/contact" className="text-slate-600 hover:text-slate-900">Contact</Link></li>
            <li><Link href="/privacy" className="text-slate-600 hover:text-slate-900">Privacy</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-600 hover:text-slate-900">{CONTACT_EMAIL}</a></li>
          </ul>
        </div>
          <div>
            <h4 className="font-semibold mb-2">More from next-happy.com</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="https://next-happy.com" className="text-slate-600 hover:text-slate-900">AI Tools Directory</a></li>
              <li><a href="https://prompt.next-happy.com" className="text-slate-600 hover:text-slate-900">PromptCraft</a></li>
              <li><a href="https://converter.next-happy.com" className="text-slate-600 hover:text-slate-900">Free Unit Converter</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4 text-sm text-slate-500 text-center">
          &copy; {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
