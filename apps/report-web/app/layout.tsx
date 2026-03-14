import '../styles/globals.css';
import { Inter } from 'next/font/google';

import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { QueryProvider } from '../components/providers/QueryProvider';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { GradientBackground } from '../components/ui/GradientBackground';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Innings Pro Reports',
  description: 'Generate beautiful cricket match reports from Innings Pro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col`}>
        <QueryProvider>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="pointer-events-none absolute inset-0 z-0 print:hidden" aria-hidden>
                <GradientBackground />
              </div>

              <div className="relative z-10 flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
