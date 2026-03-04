import { Activity } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-green-500" />
          <span className="font-bold inline-block">Innings Pro Reports</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-green-500">
              Home
            </Link>
            <Link href="/support" className="text-sm font-medium transition-colors hover:text-green-500">
              Support
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-green-500">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
