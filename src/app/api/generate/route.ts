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
    console.log('Début de la génération d\'image avec le prompt:', prompt);
    
    // Utilisation du SDK OpenAI officiel
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
      // Le modèle gpt-image-1 retourne toujours du b64_json par défaut
    });

    console.log('Réponse de l\'API OpenAI:', JSON.stringify(response, null, 2));
    
    // Vérifier que la réponse contient bien des données
    if (!response.data || response.data.length === 0) {
      throw new Error('Aucune donnée reçue de l\'API de génération d\'images');
    }

    // Récupérer les données binaires de l'image
    const imageData = response.data[0];
    
    // Vérifier si on a des données binaires
    if (!imageData.b64_json) {
      throw new Error('Format de réponse inattendu: données binaires manquantes');
    }
    
    // Convertir les données base64 en URL de données
    return `data:image/webp;base64,${imageData.b64_json}`;
  } catch (error) {
    console.error('Erreur lors de la génération d\'image:', error);
    
    // Extraire le message d'erreur détaillé
    let errorMessage = 'Échec de la génération d\'image';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      
      // Si c'est une erreur de l'API OpenAI, essayer d'extraire plus de détails
      if ('error' in error && typeof error.error === 'object' && error.error !== null) {
        const apiError = error.error as Record<string, unknown>;
        if ('message' in apiError) {
          errorMessage += ` (Détails: ${String(apiError.message)})`;
        }
      }
    }
    
    throw new Error(errorMessage);
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
    
    try {
      // Générer l'image
      console.log('Début de la génération d\'image avec le prompt:', prompt);
      const imageUrl = await generateImage(prompt);
      
      console.log('Image générée avec succès, URL de l\'image:', imageUrl ? 'Reçue' : 'Vide');

      // Retourner la réponse avec l'URL de l'image générée
      return NextResponse.json({ 
        success: true, 
        imageUrl,
        description: prompt,
        model: "gpt-image-1"
      });
    } catch (error) {
      console.error('Erreur détaillée lors de la génération:', error);
      if (error instanceof Error) {
        console.error('Message d\'erreur:', error.message);
        if ('stack' in error) {
          console.error('Stack trace:', error.stack);
        }
      }
      throw error; // Laisser le bloc catch externe gérer l'erreur
    }

  } catch (error) {
    console.error('Erreur globale lors de la génération d\'image :', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : {};

    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la génération de l\'image',
        details: errorMessage,
        errorDetails,
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
