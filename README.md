# Tableau de Bord Joaillerie IA

Une application de tableau de bord moderne pour les joailliers, permettant de générer des designs de bijoux personnalisés avec l'IA.

## Fonctionnalités

- Génération d'images de bijoux avec IA (DALL-E)
- Personnalisation des spécifications (type, matériau, style)
- Visualisation des modèles générés
- Interface utilisateur moderne et réactive
- Mode clair/sombre

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) 18.x ou supérieur
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- Clé API OpenAI (obtenez-la sur [platform.openai.com](https://platform.openai.com/))

### Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-utilisateur/joaillerie-dashboard.git
   cd joaillerie-dashboard
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Configurer l'environnement** :
   ```bash
   # Copier le fichier d'exemple
   cp .env.example .env.local
   ```
   
   Puis éditez `.env.local` pour y ajouter vos clés API et configurations.

4. **Vérifier la configuration** :
   ```bash
   npm run check-env
   ```

5. **Démarrer le serveur de développement** :
   ```bash
   npm run dev
   # Le serveur sera accessible sur http://localhost:3000
   ```

## 🛠 Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Obligatoire
OPENAI_API_KEY=votre_cle_api_openai
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optionnel (valeurs par défaut ci-dessous)
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_API_URL=/api
```

## 🚀 Déploiement

### Vercel (Recommandé)

[![Déployer avec Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvotre-utilisateur%2Fjoaillerie-dashboard&env=OPENAI_API_KEY,NEXT_PUBLIC_SITE_URL&envDescription=Configurez%20votre%20application%20avec%20ces%20variables%20d'environnement.&envLink=https%3A%2F%2Fgithub.com%2Fvotre-utilisateur%2Fjoaillerie-dashboard%2Fblob%2Fmain%2F.env.example)

1. Cliquez sur le bouton ci-dessus
2. Ajoutez vos variables d'environnement dans les paramètres du projet Vercel
3. Déployez !

### Netlify

[![Déployer sur Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/votre-utilisateur/joaillerie-dashboard)

1. Cliquez sur le bouton ci-dessus
2. Connectez votre compte GitHub
3. Ajoutez les variables d'environnement requises
4. Cliquez sur "Deploy site"

## 🛠 Technologies Utilisées

- [Next.js](https://nextjs.org/) 14+ - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Tailwind CSS](https://tailwindcss.com/) - Styles utilitaires
- [OpenAI API](https://platform.openai.com/) - Génération d'images avec DALL-E
- [Radix UI](https://www.radix-ui.com/) - Composants accessibles
- [Lucide Icons](https://lucide.dev/) - Icônes

## 📦 Scripts Disponibles

- `npm run dev` - Démarrer le serveur de développement (port 3001 par défaut)
- `npm run build` - Compiler pour la production
- `npm start` - Démarrer le serveur de production
- `npm run lint` - Vérifier le code avec ESLint
- `npm run check-env` - Vérifier la configuration de l'environnement
- `npm run clean` - Nettoyer le projet et réinstaller les dépendances

## 🙌 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📝 Licence

Ce projet est sous licence [MIT](LICENSE).
