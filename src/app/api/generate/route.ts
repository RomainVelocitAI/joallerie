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
console.log('Initialisation du client OpenAI...');
console.log('Clé API OpenAI:', process.env.OPENAI_API_KEY ? '*** (présente)' : 'manquante');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  console.log('=== DÉBUT DE LA REQUÊTE ===');
  console.log('Environnement:', process.env.NODE_ENV);
  console.log('URL de la requête:', request.url);
  console.log('Méthode:', request.method);
  console.log('En-têtes:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Vérifier que la clé API est configurée
    const openAiKey = process.env.OPENAI_API_KEY;
    console.log('OPENAI_API_KEY:', openAiKey ? '*** (présente)' : 'manquante');
    
    if (!openAiKey) {
      console.error('ERREUR: La clé API OpenAI n\'est pas configurée');
      console.log('Variables d\'environnement disponibles:', Object.keys(process.env).join(', '));
    }
    
    if (!openAiKey) {
      throw new Error('La clé API OpenAI n\'est pas configurée');
    }
    
    // Vérifier que la requête contient des données JSON
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('Corps de la requête reçu:', JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error('Erreur lors de l\'analyse du corps de la requête:', parseError);
      throw new Error('Format de requête invalide');
    }
    
    const { description, jewelryType, material, style } = requestBody as GenerateRequest;
    
    // Valider les données
    if (!description?.trim() || !jewelryType || !material || !style) {
      throw new Error('Tous les champs sont requis');
    }
    
    console.log('Données reçues:', { description, jewelryType, material, style });
    
    // Créer un prompt détaillé
    const materialInEnglish = material === 'or' ? 'gold' : material;
    const prompt = `High-end product photography of a modern ${materialInEnglish} ${jewelryType} with detailed ${description} motifs, shown from three different angles in the same image — top view, side view, and perspective view. The ${jewelryType} features ${style} design and intricate ${description} detailing. Set on a dark velvet background with soft studio lighting, shallow depth of field, and realistic ${materialInEnglish} textures. Ultra-realistic render, 8K resolution, luxury jewelry showcase style.`;

    // Appeler l'API OpenAI
    console.log('=== APPEL OPENAI ===');
    console.log('Modèle: gpt-image-1');
    console.log('Taille: 1024x1024');
    console.log('Prompt (tronqué):', prompt.substring(0, 200) + '...');
    
    try {
      // 1. Appel à l'API OpenAI
      console.log('Initialisation de la requête vers OpenAI...');
      const startTime = Date.now();
      
      // Utilisation du modèle gpt-image-1 comme spécifié
      console.log('Envoi de la requête à OpenAI avec le prompt:', prompt);
      const requestData: Parameters<typeof openai.images.generate>[0] = {
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: "1024x1024" as const
      };
      console.log('Données de la requête OpenAI:', JSON.stringify(requestData, null, 2));
      
      console.log('Envoi de la requête à OpenAI...');
      console.log('URL de l\'API OpenAI:', openai.baseURL);
      console.log('Options de la requête:', {
        method: 'POST',
        url: '/v1/images/generations',
        data: requestData
      });
      
      const response = await openai.images.generate(requestData);
      console.log('Réponse brute de l\'API OpenAI:', JSON.stringify(response, null, 2));
      
      const endTime = Date.now();
      console.log(`Réponse reçue d'OpenAI en ${endTime - startTime}ms`);
      
      console.log('Réponse de l\'API OpenAI reçue:', JSON.stringify({
        hasData: !!response.data,
        dataLength: response.data?.length,
        firstItemKeys: response.data?.[0] ? Object.keys(response.data[0]) : []
      }, null, 2));
      
      // 2. Vérification de la réponse
      if (!response || !response.data || response.data.length === 0) {
        console.error('Réponse invalide de l\'API OpenAI:', JSON.stringify(response, null, 2));
        throw new Error('Réponse invalide de l\'API OpenAI');
      }
      
      const imageData = response.data[0];
      
      if (!imageData.b64_json) {
        console.error('Format de réponse inattendu:', JSON.stringify(imageData, null, 2));
        throw new Error('Format de réponse inattendu de l\'API');
      }
      
      console.log('Données d\'image reçues avec succès, taille du b64_json:', 
        imageData.b64_json.length, 'caractères');
        
      // 3. Retour de la réponse formatée
      return new NextResponse(
        JSON.stringify({ 
          success: true,
          b64Image: imageData.b64_json,
          mimeType: 'image/png',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          } 
        }
      );
      
    } catch (error: unknown) {
      // Gestion des erreurs détaillée
      let errorMessage = 'Une erreur inconnue est survenue';
      let errorDetails: Record<string, any> = { unknownError: true };
      
      if (error instanceof Error) {
        const errorObj = error as Error & {
          code?: string;
          status?: number;
          response?: {
            status: number;
            statusText: string;
            headers: Record<string, string>;
            data: any;
          };
        };
        
        errorMessage = errorObj.message || errorMessage;
        errorDetails = {
          name: errorObj.name,
          message: errorObj.message,
          stack: errorObj.stack,
          code: errorObj.code,
          status: errorObj.status,
          response: errorObj.response ? {
            status: errorObj.response.status,
            statusText: errorObj.response.statusText,
            headers: errorObj.response.headers,
            data: errorObj.response.data
          } : undefined
        };
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'toString' in error) {
        errorMessage = error.toString();
      }
      
      console.error('Erreur lors de l\'appel à l\'API OpenAI:', errorMessage, '\nDétails:', errorDetails);
      
      // Renvoyer une réponse d'erreur structurée
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          error: 'Erreur lors de la génération de l\'image',
          details: errorMessage,
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          } 
        }
      );
    }
    
    // Retourner les données de l'image en base64
    // Cette partie du code n'est plus accessible car nous avons déjà retourné une réponse
    // dans le bloc try ou catch ci-dessus
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        error: 'Une erreur inattendue est survenue',
        details: 'La fonction a atteint une partie du code qui ne devrait pas être exécutée',
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        } 
      }
    );
    
  } catch (error) {
    console.error('Erreur dans la route API:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        error: 'Erreur serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString()
      }), 
      { 
        status: error instanceof Error && 'status' in error ? Number(error.status) : 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        } 
      }
    );
  }
}
