'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, Sparkles, Users, Settings } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Accueil",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/generate",
      label: "Générer",
      icon: Sparkles,
      active: pathname === "/generate",
    },
    {
      href: "/clients",
      label: "Clients",
      icon: Users,
      active: pathname === "/clients",
    },
    {
      href: "/settings",
      label: "Paramètres",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
              route.active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
