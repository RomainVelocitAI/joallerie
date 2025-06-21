import type { Config } from '@jest/types';

// Configuration pour TypeScript
const config: Config.InitialOptions = {
  // Préconfiguration de ts-jest
  preset: 'ts-jest',
  
  // Environnement de test
  testEnvironment: 'jsdom',
  
  // Fichiers de configuration
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Dossiers à inclure dans les tests
  roots: ['<rootDir>/src'],
  
  // Extensions de fichiers à traiter
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Chemins d'aliases (comme dans tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Transformations
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      isolatedModules: true,
    }],
  },
  
  // Fichiers à ignorer
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/'
  ],
  
  // Configuration de la couverture de code
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!src/pages/_app.{ts,tsx}',
    '!src/pages/_document.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Configuration pour les tests
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  
  // Configuration pour les fichiers statiques
  moduleDirectories: ['node_modules', 'src'],
  
  // Configuration pour les tests asynchrones
  testTimeout: 10000,
};

export default config;
