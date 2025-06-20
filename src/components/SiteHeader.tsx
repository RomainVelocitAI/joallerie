'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function SiteHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Joaillerie IA</span>
          </Link>
        </div>
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Basculer le thème</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
