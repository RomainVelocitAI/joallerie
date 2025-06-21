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
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    }, {
      headers: {
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    console.log('Réponse de l\'API OpenAI reçue');
    
    // Vérifier la réponse
    if (!response.data || !response.data[0]?.b64_json) {
      throw new Error('Aucune donnée d\'image reçue de l\'API');
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
