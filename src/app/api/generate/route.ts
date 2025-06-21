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
  try {
    console.log('=== DÉBUT DE LA REQUÊTE ===');
    
    // Vérifier que la clé API est configurée
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('La clé API OpenAI n\'est pas configurée');
    }
    
    // Récupérer les données de la requête
    const { description, jewelryType, material, style } = await request.json() as GenerateRequest;
    
    // Valider les données
    if (!description?.trim() || !jewelryType || !material || !style) {
      throw new Error('Tous les champs sont requis');
    }
    
    console.log('Données reçues:', { description, jewelryType, material, style });
    
    // Créer un prompt détaillé
    const materialInEnglish = material === 'or' ? 'gold' : material;
    const prompt = `High-end product photography of a modern ${materialInEnglish} ${jewelryType} with detailed ${description} motifs, shown from three different angles in the same image — top view, side view, and perspective view. The ${jewelryType} features ${style} design and intricate ${description} detailing. Set on a dark velvet background with soft studio lighting, shallow depth of field, and realistic ${materialInEnglish} textures. Ultra-realistic render, 8K resolution, luxury jewelry showcase style.`;
    
    console.log('Appel de l\'API OpenAI avec le prompt:', prompt);
    
    // Appeler l'API OpenAI
    console.log('Appel de l\'API OpenAI avec le prompt:', prompt.substring(0, 100) + '...');
    
    try {
      // 1. Appel à l'API OpenAI
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: "1024x1024"
        // Le modèle gpt-image-1 retourne toujours du b64_json par défaut
      });
      
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
      
    } catch (error) {
      // Gestion des erreurs détaillée
      console.error('Erreur lors de l\'appel à l\'API OpenAI:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        status: error.status,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data
        } : undefined
      });
      
      // Renvoyer une réponse d'erreur structurée
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          error: 'Erreur lors de la génération de l\'image',
          details: error.message,
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
    return new NextResponse(
      JSON.stringify({ 
        success: true,
        b64Image: response.data[0].b64_json,
        mimeType: 'image/png', // Par défaut, l'API renvoie du PNG en base64
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
