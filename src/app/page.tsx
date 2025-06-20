import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Gem, Palette, Zap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: 'Génération IA',
      description: 'Créez des designs uniques en quelques secondes avec la puissance de l\'IA',
    },
    {
      icon: <Gem className="h-8 w-8 text-primary" />,
      title: 'Bibliothèque de modèles',
      description: 'Accédez à une vaste collection de modèles de bijoux personnalisables',
    },
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: 'Personnalisation avancée',
      description: 'Ajustez chaque détail pour créer le bijou parfait pour vos clients',
    },
  ];

  return (
    <div className="container relative pb-10">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Créez des bijoux uniques avec l'intelligence artificielle
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Transformez vos idées en designs époustouflants en quelques clics. Notre outil puissant vous permet de générer, personnaliser et visualiser des bijoux comme jamais auparavant.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button size="lg" asChild>
              <Link href="/generate">
                <Zap className="mr-2 h-4 w-4" />
                Essayer maintenant
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/clients">
                Voir les clients
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-4xl">
            Pourquoi choisir notre plateforme ?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Une solution complète pour les créateurs de bijoux modernes
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg border bg-background p-4">
              <div className="flex h-[120px] flex-col justify-between rounded-md p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container flex flex-col items-center justify-center gap-4 py-12 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
          Prêt à créer quelque chose d'extraordinaire ?
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Commencez dès maintenant et découvrez comment notre outil peut transformer votre processus de création.
        </p>
        <Button size="lg" asChild className="mt-4">
          <Link href="/generate">
            <Sparkles className="mr-2 h-4 w-4" />
            Commencer la création
          </Link>
        </Button>
      </section>
    </div>
  );
}
