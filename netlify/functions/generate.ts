import { Handler } from '@netlify/functions';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Définition des types pour la requête
type GenerateRequest = {
  description: string;
  jewelryType: string;
  material: string;
  style: string;
};

export const handler: Handler = async (event, context) => {
  // Vérifier que la méthode est POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    };
  }

  try {
    // Vérifier que la clé API est configurée
    const openAiKey = process.env.OPENAI_API_KEY;
    
    if (!openAiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Configuration manquante',
          details: 'La clé API OpenAI n\'est pas configurée',
        }),
      };
    }

    // Parser le corps de la requête
    let requestBody: GenerateRequest;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Format de requête invalide',
          details: 'Le corps de la requête doit être au format JSON',
        }),
      };
    }

    const { description, jewelryType, material, style } = requestBody;

    // Valider les données
    if (!description?.trim() || !jewelryType || !material || !style) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Données manquantes',
          details: 'Tous les champs sont requis (description, jewelryType, material, style)',
        }),
      };
    }

    // Configuration du client OpenAI
    const openai = new OpenAI({
      apiKey: openAiKey,
      timeout: 30000, // 30 secondes de timeout
    });

    // Créer un prompt détaillé
    const materialInEnglish = material === 'or' ? 'gold' : material;
    const prompt = `High-end product photography of a modern ${materialInEnglish} ${jewelryType} with detailed ${description} motifs, shown from three different angles in the same image — top view, side view, and perspective view. The ${jewelryType} features ${style} design and intricate ${description} detailing. Set on a dark velvet background with soft studio lighting, shallow depth of field, and realistic ${materialInEnglish} textures. Ultra-realistic render, 8K resolution, luxury jewelry showcase style.`;

    // Limiter la taille du prompt si nécessaire (4000 caractères max)
    const maxPromptLength = 4000;
    const truncatedPrompt = prompt.length > maxPromptLength 
      ? prompt.substring(0, maxPromptLength) 
      : prompt;

    // Appeler l'API OpenAI
    try {
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: truncatedPrompt,
        n: 1,
        size: "1024x1024" as const
      });

      // Vérifier si la réponse contient des données
      if (!response.data || response.data.length === 0) {
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'Aucune image générée',
            details: 'La réponse de l\'API OpenAI ne contient pas de données d\'image',
          }),
        };
      }

      const imageData = response.data[0];

      // Vérifier si l'image est une URL
      if ('url' in imageData && imageData.url) {
        // Télécharger l'image et la convertir en base64
        try {
          const imageResponse = await fetch(imageData.url);
          const arrayBuffer = await imageResponse.arrayBuffer();
          const base64Image = Buffer.from(arrayBuffer).toString('base64');
          
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, max-age=0'
            },
            body: JSON.stringify({
              image: `data:image/png;base64,${base64Image}`,
              model: "gpt-image-1",
              prompt: truncatedPrompt
            })
          };
        } catch (fetchError) {
          console.error('Erreur lors du téléchargement de l\'image:', fetchError);
          return {
            statusCode: 500,
            body: JSON.stringify({ 
              error: 'Erreur lors du téléchargement de l\'image',
              details: fetchError instanceof Error ? fetchError.message : 'Erreur inconnue',
            }),
          };
        }
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'Format de réponse inattendu',
            details: 'La réponse de l\'API OpenAI ne contient pas d\'URL d\'image',
          }),
        };
      }
    } catch (apiError) {
      console.error('Erreur lors de l\'appel à l\'API OpenAI:', apiError);
      
      // Vérifier si c'est une erreur de timeout
      if ((apiError as any).name === 'TimeoutError' || (apiError as any).code === 'ETIMEDOUT') {
        return {
          statusCode: 504,
          body: JSON.stringify({ 
            error: 'Timeout',
            details: 'La requête a expiré. Veuillez réessayer avec un prompt plus court.',
          }),
        };
      }
      
      // Autre type d'erreur
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Erreur de l\'API OpenAI',
          details: (apiError as Error).message || 'Erreur inconnue lors de l\'appel à l\'API',
          code: (apiError as any).code,
        }),
      };
    }
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erreur inattendue',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      }),
    };
  }
};
