import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row md:px-8 max-w-7xl mx-auto">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by Innings Pro. The modern cricket scoring system.
        </p>
        <Link
          href="/privacy"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
