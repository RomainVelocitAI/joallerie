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
    // Appeler l'API de génération d'images selon la documentation officielle
    const response = await openai.images.generate({
      model: "dall-e-3",  // Utilisation du modèle DALL-E 3 comme recommandé
      prompt: prompt,
      n: 1,  // Une seule image
      size: "1024x1024",  // Taille maximale pour DALL-E 3
      quality: "standard",  // Qualité standard (ou "hd" pour haute qualité)
      style: "vivid",  // Style plus vif et détaillé
      response_format: "url"  // Format de réponse avec URL
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
    throw new Error('Échec de la génération d\'image: ' + (error as Error).message);
  }
}

export async function POST(request: Request) {
  try {
    const { description, jewelryType, material, style } = (await request.json()) as GenerateRequest;

    // Validation des champs requis
    if (!description?.trim()) {
      return NextResponse.json(
        { error: 'La description est requise' },
        { status: 400 }
      );
    }

    if (!jewelryType?.trim() || !material?.trim() || !style?.trim()) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Construire le prompt détaillé
    const prompt = `Crée une image haute qualité d'un bijou de type ${jewelryType} en ${material} de style ${style}. Détails : ${description}. L'image doit être réaliste et professionnelle, avec un éclairage de studio et un fond neutre.`;
    
    // Générer l'image
    const imageUrl = await generateImage(prompt);

    // Retourner la réponse avec l'URL de l'image générée
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      description: prompt,
      model: "dall-e-3"
    });

  } catch (error) {
    console.error('Erreur lors de la génération d\'image :', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la génération de l\'image',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
