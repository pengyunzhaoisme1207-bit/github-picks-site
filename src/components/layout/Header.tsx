import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { Code, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <Code className="w-6 h-6" />
          {SITE_NAME}
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
          <Link href="/weekly" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Weekly Picks</Link>
          <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">About</Link>
          <Link href="/submit" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Submit</Link>
        </div>
        <button className="md:hidden p-2" aria-label="Menu">
          <Menu className="w-6 h-6" />
        </button>
      </nav>
    </header>
  );
}
