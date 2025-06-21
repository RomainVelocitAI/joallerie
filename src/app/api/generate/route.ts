import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Interface pour les erreurs de l'API OpenAI
interface OpenAIError extends Error {
  response?: {
    status: number;
    statusText: string;
    data: any;
  };
  error?: {
    message: string;
    type: string;
  };
}

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
  console.log('=== DÉBUT DE LA GÉNÉRATION D\'IMAGE ===');
  console.log('Prompt reçu:', prompt);
  
  try {
    // Vérification de la clé API
    if (!process.env.OPENAI_API_KEY) {
      console.error('ERREUR: La clé API OpenAI n\'est pas configurée');
      throw new Error('Configuration manquante: clé API OpenAI non définie');
    }
    
    console.log('Configuration du client OpenAI...');
    
    // Configuration du client OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log('Client OpenAI configuré, appel de l\'API...');
    
    // Appel simplifié à l'API
    const response = await openai.images.generate({
      model: "dall-e-3", // Changement pour un modèle plus stable
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });

    console.log('Réponse brute de l\'API:', JSON.stringify(response, null, 2));
    
    // Vérification de la réponse
    if (!response.data || response.data.length === 0) {
      throw new Error('Aucune donnée reçue de l\'API de génération d\'images');
    }

    const imageData = response.data[0];
    
    if (!imageData.url && !imageData.b64_json) {
      throw new Error('Format de réponse inattendu: ni URL ni données binaires trouvées');
    }
    
    // Retourner l'URL ou les données binaires
    if (imageData.url) {
      console.log('Image générée avec succès (URL)');
      return imageData.url;
    } else if (imageData.b64_json) {
      console.log('Image générée avec succès (données binaires)');
      return `data:image/webp;base64,${imageData.b64_json}`;
    }
    
    throw new Error('Format de réponse inattendu');
    
  } catch (error: unknown) {
    console.error('=== ERREUR LORS DE LA GÉNÉRATION ===');
    
    let errorMessage = 'Échec de la génération d\'image';
    
    if (error instanceof Error) {
      console.error('Erreur:', error.message);
      console.error('Stack:', error.stack);
      errorMessage += `: ${error.message}`;
      
      // Si c'est une erreur de l'API OpenAI
      if ('response' in error) {
        const response = (error as any).response;
        console.error('Réponse d\'erreur:', {
          status: response?.status,
          statusText: response?.statusText,
          data: response?.data
        });
        
        if (response?.status) {
          errorMessage += ` (Code: ${response.status}`;
          if (response.statusText) errorMessage += ` - ${response.statusText}`;
          errorMessage += ')';
        }
        
        if (response?.data?.error?.message) {
          errorMessage += ` - ${response.data.error.message}`;
        }
      }
    } else if (typeof error === 'string') {
      console.error('Erreur inattendue (string):', error);
      errorMessage += `: ${error}`;
    } else {
      console.error('Erreur inattendue (type inconnu):', error);
      errorMessage += ': Erreur inconnue';
    }
    
    console.error('=== FIN DU MESSAGE D\'ERREUR ===');
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
