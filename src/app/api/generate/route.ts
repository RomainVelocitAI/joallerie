import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Interface pour la requête
interface GenerateRequest {
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
}

// Interface pour la réponse de l'API
interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

// Cette route est sécurisée et ne s'exécute que côté serveur
export const dynamic = 'force-dynamic';

// Initialiser le client OpenAI avec la clé API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

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

    const { prompt, n = 1, size = '1024x1024' } = body;

    // Validation des entrées
    if (!prompt || typeof prompt !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'Le prompt est requis et doit être une chaîne de caractères' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const numImages = Number(n);
    if (isNaN(numImages) || numImages < 1 || numImages > 4) {
      return new NextResponse(
        JSON.stringify({ error: 'Le nombre d\'images doit être compris entre 1 et 4' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validSizes = ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'] as const;
    if (!validSizes.includes(size as any)) {
      return new NextResponse(
        JSON.stringify({ error: 'La taille spécifiée n\'est pas valide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier la présence de la clé API
    if (!process.env.OPENAI_API_KEY) {
      console.error('Clé API OpenAI manquante');
      return new NextResponse(
        JSON.stringify({ error: 'Configuration du serveur incomplète' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Appeler l'API DALL·E avec le format de requête correct
    const apiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Création de bijou: ${prompt}. Style professionnel, haute qualité, fond neutre.`,
        n: Math.min(numImages, 4),
        size: size as '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792',
        response_format: 'url'
      })
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.error?.message || 'Erreur lors de la génération des images');
    }

    const responseData = await apiResponse.json();

    // Vérifier que la réponse contient des données
    if (!responseData.data || !Array.isArray(responseData.data)) {
      throw new Error('Format de réponse inattendu de l\'API DALL·E');
    }

    // Formater la réponse
    const images: GeneratedImage[] = responseData.data.map((img: any) => ({
      url: img.url || '',
      revised_prompt: img.revised_prompt || prompt,
    }));

    // Renvoyer les URLs des images générées
    return new NextResponse(
      JSON.stringify({ images }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erreur lors de la génération des images:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Une erreur inconnue est survenue';
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Erreur lors de la génération des images',
        details: errorMessage
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
