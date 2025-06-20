'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Simuler une authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dans une application réelle, vous feriez une requête à votre API d'authentification
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Erreur de connexion');
      
      // Rediriger vers le tableau de bord après connexion réussie
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icons.gem className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Connexion
          </h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Se connecter
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continuez avec
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
          <Button variant="outline" type="button" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.github className="mr-2 h-4 w-4" />
            )}
            GitHub
          </Button>
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <a
            href="/register"
            className="hover:text-primary underline underline-offset-4"
          >
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}
