// Vérifie que toutes les variables d'environnement requises sont définies
const requiredEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
  'OPENAI_API_KEY'
];

// Variables optionnelles avec leurs valeurs par défaut
const optionalEnvVars = {
  'NEXT_PUBLIC_DEBUG': 'false',
  'NEXT_PUBLIC_DEFAULT_THEME': 'system',
  'NEXT_PUBLIC_API_URL': '/api'
};

// Vérifier les variables requises
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Erreur : Les variables d\'environnement suivantes sont requises mais non définies :');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  console.log('\nCopiez le fichier .env.example en .env.local et définissez les valeurs requises.');
  process.exit(1);
}

// Définir les valeurs par défaut pour les variables optionnelles manquantes
Object.entries(optionalEnvVars).forEach(([varName, defaultValue]) => {
  if (!process.env[varName]) {
    process.env[varName] = defaultValue;
    console.log(`\x1b[33m%s\x1b[0m`, `Avertissement : ${varName} n'est pas défini, utilisation de la valeur par défaut : ${defaultValue}`);
  }
});

console.log('\n\x1b[32m%s\x1b[0m', '✅ Toutes les variables d\'environnement requises sont définies.');
console.log('\x1b[36m%s\x1b[0m', '\nConfiguration actuelle :');
console.log('----------------------');

// Afficher la configuration actuelle
requiredEnvVars.forEach(varName => {
  console.log(`\x1b[1m${varName}\x1b[0m = ${process.env[varName] ? '*** (défini)' : 'non défini'}`);
});

Object.keys(optionalEnvVars).forEach(varName => {
  console.log(`\x1b[1m${varName}\x1b[0m = ${process.env[varName] || optionalEnvVars[varName]}`);
});

console.log('\n\x1b[32m%s\x1b[0m', '✅ Configuration de l\'environnement validée avec succès !');
process.exit(0);
