'use client';

import { Activity, Menu, Moon, Sun, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '../ui/button';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Reports', href: '/reports' },
  { label: 'Tournament Analytics', href: '/tournament-analytics' },
  { label: 'Contact', href: '/contact' }
];

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isDark = mounted && resolvedTheme === 'dark';

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">Innings Pro Reports</span>
        </Link>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary"
          >
            <Link href="/#upload">Upload Report</Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:text-primary focus-visible:ring-primary"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:text-primary focus-visible:ring-primary"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:text-primary focus-visible:ring-primary"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-nav" className="border-t bg-background/95 px-4 py-4 backdrop-blur md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button
            asChild
            className="mt-3 w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary"
          >
            <Link href="/#upload">Upload Report</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
