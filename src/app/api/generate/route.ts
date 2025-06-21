import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Interface pour la requête
interface GenerateRequest {
  prompt: string;
  jewelryType: string;
  material: string;
  style: string;
}

// Interface pour la réponse de l'API
interface GeneratedImage {
  url: string;
  description?: string;
}

// Cette route est sécurisée et ne s'exécute que côté serveur
export const dynamic = 'force-dynamic';

// Initialiser le client OpenAI avec la clé API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Fonction pour générer une image avec GPT-4 Vision
async function generateWithGPT4Vision(prompt: string, jewelryType: string, material: string, style: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `Crée une image détaillée d'un bijou avec les caractéristiques suivantes:\n` +
                `- Type: ${jewelryType}\n` +
                `- Matériau: ${material}\n` +
                `- Style: ${style}\n` +
                `- Détails: ${prompt}\n\n` +
                `L'image doit être réaliste et de haute qualité, montrant le bijou sous différents angles.` 
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    // Dans une vraie implémentation, vous devrez gérer la réponse pour extraire l'URL de l'image
    // Pour l'instant, nous retournons une URL factice
    return 'https://example.com/generated-image.jpg';
  } catch (error) {
    console.error('Erreur lors de la génération avec GPT-4 Vision:', error);
    throw new Error('Échec de la génération d\'image avec GPT-4 Vision');
  }
}

export async function POST(req: Request) {
  try {
    // Valider et parser le corps de la requête
    let body: GenerateRequest;
    try {
      body = await req.json();
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Le corps de la requête doit être un JSON valide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, jewelryType, material, style } = body;

    // Validation des entrées
    if (!prompt || typeof prompt !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'La description est requise et doit être une chaîne de caractères' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que la clé API est configurée
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY non configurée');
      return new NextResponse(
        JSON.stringify({ error: 'Erreur de configuration du serveur' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Générer l'image avec GPT-4 Vision
      const imageUrl = await generateWithGPT4Vision(prompt, jewelryType, material, style);
      
      // Retourner la réponse formatée
      const images: GeneratedImage[] = [{
        url: imageUrl,
        description: `${jewelryType} en ${material} de style ${style}: ${prompt}`
      }];

      return new NextResponse(
        JSON.stringify(images),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Erreur lors de la génération avec GPT-4 Vision:', error);
      return new NextResponse(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Échec de la génération d\'image avec GPT-4 Vision'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
