import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Définition des types pour la requête
type GenerateRequest = {
  description: string;
  jewelryType: string;
  material: string;
  style: string;
};

// Type pour la réponse d'erreur
type ErrorResponse = {
  error: string;
  details: string;
  debug?: Record<string, any>;
  timestamp?: string;
};

export async function POST(request: Request) {
  console.log('=== DÉBUT DE LA REQUÊTE ===');
  console.log('Environnement:', process.env.NODE_ENV);
  console.log('URL de la requête:', request.url);
  console.log('Méthode:', request.method);
  
  try {
    // Vérifier que la clé API est configurée
    const openAiKey = process.env.OPENAI_API_KEY;
    console.log('OPENAI_API_KEY:', openAiKey ? '*** (présente)' : 'manquante');
    
    if (!openAiKey) {
      const errorMessage = 'ERREUR: La clé API OpenAI n\'est pas configurée';
      console.error(errorMessage);
      console.log('Variables d\'environnement disponibles:', Object.keys(process.env).join(', '));
      
      return new NextResponse(
        JSON.stringify({ 
          error: errorMessage,
          details: 'Veuillez configurer la variable d\'environnement OPENAI_API_KEY'
        }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Configuration du client OpenAI avec la clé API
    const openai = new OpenAI({
      apiKey: openAiKey,
      timeout: 120000, // 120 secondes de timeout
    });
    
    // Vérifier que la requête contient des données JSON
    let requestBody: GenerateRequest;
    try {
      requestBody = await request.json();
      console.log('Corps de la requête reçu:', JSON.stringify(requestBody, null, 2));
    } catch (error) {
      console.error('Erreur lors de la lecture du corps de la requête:', error);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Format de requête invalide',
          details: 'Le corps de la requête doit être au format JSON'
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { description, jewelryType, material, style } = requestBody as GenerateRequest;
    
    // Valider les données
    if (!description?.trim() || !jewelryType || !material || !style) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Données manquantes',
          details: 'Tous les champs sont requis (description, jewelryType, material, style)'
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Données reçues:', { description, jewelryType, material, style });
    
    try {
      // Créer un prompt détaillé
      const materialInEnglish = material === 'or' ? 'gold' : material;
      const prompt = `High-end product photography of a modern ${materialInEnglish} ${jewelryType} with detailed ${description} motifs, shown from three different angles in the same image — top view, side view, and perspective view. The ${jewelryType} features ${style} design and intricate ${description} detailing. Set on a dark velvet background with soft studio lighting, shallow depth of field, and realistic ${materialInEnglish} textures. Ultra-realistic render, 8K resolution, luxury jewelry showcase style.`;

      // Appeler l'API OpenAI
      console.log('=== APPEL OPENAI ===');
      console.log('Modèle: gpt-image-1');
      console.log('Taille: 1024x1024');
      console.log('Prompt (tronqué):', prompt.substring(0, 200) + '...');
      
      // Limiter la taille du prompt si nécessaire (4000 caractères max)
      const maxPromptLength = 4000;
      const truncatedPrompt = prompt.length > maxPromptLength 
        ? prompt.substring(0, maxPromptLength) 
        : prompt;
      
      if (prompt.length > maxPromptLength) {
        console.log('Le prompt a été tronqué à', maxPromptLength, 'caractères');
      }
      
      const requestData = {
        model: "gpt-image-1",
        prompt: truncatedPrompt,
        n: 1,
        size: "1024x1024" as const
      };
      
      console.log('Envoi de la requête à OpenAI avec le prompt (tronqué):', 
        truncatedPrompt.substring(0, 100) + '...');
      
      const startTime = Date.now();
      const response = await openai.images.generate(requestData, {
        timeout: 120000 // 120 secondes de timeout
      });
      
      const endTime = Date.now();
      console.log(`Appel à l'API OpenAI terminé en ${(endTime - startTime) / 1000} secondes`);
      
      // Vérifier si la réponse contient des données
      if (!response.data || response.data.length === 0) {
        console.error('Aucune donnée dans la réponse de l\'API OpenAI');
        return new NextResponse(
          JSON.stringify({ 
            error: 'Aucune image générée',
            details: 'La réponse de l\'API OpenAI ne contient pas de données d\'image'
          }), 
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      const imageData = response.data[0];
      
      // Vérifier si l'image est en base64
      if (imageData.b64_json) {
        console.log('Image reçue en base64, longueur:', imageData.b64_json.length);
        
        // Retourner l'image en base64
        return new NextResponse(
          JSON.stringify({ 
            image: `data:image/png;base64,${imageData.b64_json}`,
            model: "gpt-image-1",
            prompt: truncatedPrompt
          }), 
          { 
            status: 200, 
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, max-age=0'
            } 
          }
        );
      } 
      // Si l'image est une URL au lieu de base64
      else if ('url' in imageData && imageData.url) {
        console.log('URL de l\'image reçue:', imageData.url);
        
        // Télécharger l'image et la convertir en base64
        try {
          const imageResponse = await fetch(imageData.url);
          const arrayBuffer = await imageResponse.arrayBuffer();
          const base64Image = Buffer.from(arrayBuffer).toString('base64');
          
          return new NextResponse(
            JSON.stringify({ 
              image: `data:image/png;base64,${base64Image}`,
              model: "gpt-image-1",
              prompt: truncatedPrompt
            }), 
            { 
              status: 200, 
              headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
              } 
            }
          );
        } catch (fetchError) {
          console.error('Erreur lors du téléchargement de l\'image:', fetchError);
          return new NextResponse(
            JSON.stringify({ 
              error: 'Erreur lors du téléchargement de l\'image',
              details: fetchError instanceof Error ? fetchError.message : 'Erreur inconnue'
            }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } else {
        console.error('Format de réponse inattendu de l\'API OpenAI:', response);
        return new NextResponse(
          JSON.stringify({ 
            error: 'Format de réponse inattendu',
            details: 'La réponse de l\'API OpenAI ne contient ni données binaires ni URL d\'image'
          }), 
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API OpenAI:', error);
      
      let errorMessage = 'Erreur inconnue';
      let errorDetails: Record<string, any> = {};
      
      if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails = {
          name: error.name,
          stack: error.stack,
          ...(error as any).response?.data
        };
      }
      
      return new NextResponse(
        JSON.stringify({
          error: 'Erreur lors de la génération de l\'image',
          details: errorMessage,
          ...(Object.keys(errorDetails).length > 0 && { debug: errorDetails })
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Erreur inattendue dans la route API:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Erreur serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
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
}
