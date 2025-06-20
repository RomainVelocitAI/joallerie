import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/SiteHeader';
import { MainNav } from '@/components/MainNav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Joaillerie IA - Tableau de bord',
  description: 'Générez des designs de bijoux uniques avec IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
              <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block">
                  <div className="py-4">
                    <MainNav />
                  </div>
                </aside>
                <main className="flex w-full flex-col overflow-hidden">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
