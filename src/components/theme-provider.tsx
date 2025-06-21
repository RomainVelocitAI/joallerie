'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Type simplifié pour les props du ThemeProvider
type ThemeProviderProps = {
  children: React.ReactNode;
  [key: string]: any; // Permet de passer n'importe quelle autre prop
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
