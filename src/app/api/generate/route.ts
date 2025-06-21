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

    const responseData = await response.json();
    
    console.log('Réponse brute de l\'API:', JSON.stringify(responseData, null, 2));
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${JSON.stringify(responseData)}`);
    }

    const data = responseData;
    
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
    const materialInEnglish = material === 'or' ? 'gold' : material;
    const prompt = `High-end product photography of a modern ${materialInEnglish} ${jewelryType} with detailed ${description} motifs, shown from three different angles in the same image — top view, side view, and perspective view. The ${jewelryType} features ${style} design and intricate ${description} detailing. Set on a dark velvet background with soft studio lighting, shallow depth of field, and realistic ${materialInEnglish} textures. Ultra-realistic render, 8K resolution, luxury jewelry showcase style.`;
    
    console.log('Prompt envoyé à l\'API:', prompt);
    
    // Générer l'image
    const imageUrl = await generateImage(prompt);
    
    console.log('Réponse de l\'API:', { imageUrl: imageUrl ? 'Reçue' : 'Vide' });

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
