/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true, // Désactive l'optimisation d'image pour Netlify
  },
  // Désactive le cache des pages statiques pour éviter les problèmes de build
  generateEtags: false,
  // Active le mode strict pour React
  reactStrictMode: true,
  // Configuration pour les redirections et réécritures
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  // Configuration pour les en-têtes de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Désactive le cache du système de fichiers pour le développement
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Désactive le cache du système de fichiers pour la production
  experimental: {
    // Optimisations pour Netlify
    optimizeCss: true,
    scrollRestoration: true,
    // Désactive le cache des pages statiques
    staticPageGenerationTimeout: 1000,
  },
};

// Configuration pour le mode production
if (process.env.NODE_ENV === 'production') {
  nextConfig.poweredByHeader = false;
  nextConfig.devIndicators = {
    buildActivity: false,
  };
  nextConfig.swcMinify = true;
}

module.exports = nextConfig;
