import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Interface pour la requête
interface GenerateRequest {
  description: string;
  jewelryType: string;
  material: string;
  style: string;
}

// Initialiser le client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Fonction pour générer une image avec l'API de génération d'images
async function generateImage(prompt: string): Promise<string> {
  try {
    // Appeler l'API de génération d'images
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });

    // Vérifier que la réponse contient bien des données
    if (!response.data || response.data.length === 0) {
      throw new Error('Aucune donnée reçue de l\'API de génération d\'images');
    }

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('Aucune URL d\'image reçue de l\'API de génération d\'images');
    }
    
    return imageUrl;
  } catch (error) {
    console.error('Erreur lors de la génération d\'image:', error);
    throw new Error('Échec de la génération d\'image');
  }
}

export async function POST(request: Request) {
  try {
    const { description, jewelryType, material, style } = (await request.json()) as GenerateRequest;

    if (!description || !jewelryType || !material || !style) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Construire le prompt détaillé
    const prompt = `Crée une image haute qualité d'un bijou de type ${jewelryType} en ${material} de style ${style}. Détails : ${description}. L'image doit être réaliste et professionnelle.`;
    
    // Générer l'image
    const imageUrl = await generateImage(prompt);

    // Retourner la réponse avec l'URL de l'image générée
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      description: prompt
    });

  } catch (error) {
    console.error('Erreur lors de la génération d\'image :', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération de l\'image',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
