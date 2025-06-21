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
    // Appeler directement l'API REST d'OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",  // Utilisation de DALL-E 3 comme modèle de secours
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "url"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur API: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Vérifier que la réponse contient bien des données
    if (!data.data || data.data.length === 0) {
      throw new Error('Aucune donnée reçue de l\'API de génération d\'images');
    }

    const imageUrl = data.data[0]?.url;

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
    const requestData = await request.json();
    console.log('Données reçues par l\'API:', requestData);
    
    const { description, jewelryType, material, style } = requestData as GenerateRequest;
    
    console.log('Données extraites:', {
      description,
      jewelryType,
      material,
      style
    });

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
      model: "gpt-image-1"
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
