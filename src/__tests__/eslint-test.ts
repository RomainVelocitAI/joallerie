// Fichier de test pour vérifier le fonctionnement d'ESLint

// Violation intentionnelle de la règle no-console
console.log('Ceci est un test')

// Variable non utilisée
const unusedVariable = 'test'

// Any explicite
function testFunction(arg: any) {
  return arg
}

// Éléments non échappés
document.body.innerHTML = '<div class="test">Test</div>'

// Import non trié
import { z } from 'zod'
import { a } from './a'
