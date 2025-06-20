# Tableau de Bord Joaillerie IA

Une application de tableau de bord moderne pour les joailliers, permettant de générer des designs de bijoux personnalisés avec l'IA.

## Fonctionnalités

- Génération d'images de bijoux avec IA (DALL-E)
- Personnalisation des spécifications (type, matériau, style)
- Visualisation des modèles générés
- Interface utilisateur moderne et réactive
- Mode clair/sombre

## Technologies Utilisées

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API
- Radix UI

## Configuration Requise

- Node.js 18+
- npm ou yarn
- Clé API OpenAI

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/joaillerie-dashboard.git
   cd joaillerie-dashboard
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Créer un fichier `.env.local` à la racine du projet :
   ```
   OPENAI_API_KEY=votre_cle_api_openai
   ```

4. Démarrer le serveur de développement :
   ```bash
   npm run dev
   ```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

- `/src/app` - Pages et routes de l'application
- `/src/components` - Composants réutilisables
- `/src/lib` - Utilitaires et configurations
- `/public` - Fichiers statiques

## Licence

MIT
