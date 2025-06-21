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
    // Appeler directement l'API REST d'OpenAI avec le modèle gpt-image-1
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        background: "auto",
        output_format: "webp",
        output_compression: 100,
        quality: "high",
        moderation: "auto"
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

    // Récupérer les données binaires de l'image
    const imageData = data.data[0];
    
    // Vérifier si on a des données binaires (cas de gpt-image-1)
    if (imageData.b64_json) {
      // Convertir les données base64 en URL de données
      return `data:image/webp;base64,${imageData.b64_json}`;
    }
    
    // Sinon, essayer de récupérer l'URL (pour compatibilité avec d'autres modèles)
    if (imageData.url) {
      return imageData.url;
    }
    
    throw new Error('Format de réponse inattendu de l\'API de génération d\'images');
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
