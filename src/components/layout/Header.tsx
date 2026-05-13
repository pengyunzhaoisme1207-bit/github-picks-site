import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { Code } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/weekly', label: 'Weekly Picks' },
  { href: '/about', label: 'About' },
  { href: '/submit', label: 'Submit' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <Code className="w-6 h-6" aria-hidden="true" />
            {SITE_NAME}
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
          <details className="relative md:hidden">
            <summary className="list-none rounded-md px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 bg-white">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
