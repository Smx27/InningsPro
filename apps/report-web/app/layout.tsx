import './globals.css';
import { Inter } from 'next/font/google';

import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { QueryProvider } from '../components/providers/QueryProvider';

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
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col`}>
        <QueryProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
