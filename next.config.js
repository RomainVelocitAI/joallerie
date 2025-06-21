/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true, // Désactive l'optimisation d'image pour Netlify
  },
  // Désactive le cache des pages statiques pour éviter les problèmes de build
  generateEtags: false,
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
  // Configuration pour le mode production
  poweredByHeader: false,
  // Optimisations - Désactivées temporairement pour le débogage
  // experimental: {
  //   optimizeCss: true,
  //   scrollRestoration: true,
  // },
  // Configuration pour le build - Augmentation du timeout
  staticPageGenerationTimeout: 3000,
};

module.exports = nextConfig;
