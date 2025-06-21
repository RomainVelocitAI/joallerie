import { NextResponse } from 'next/server';

// Version simplifiée pour le débogage
export async function POST(request: Request) {
  try {
    console.log('=== DÉBUT DE LA REQUÊTE ===');
    
    // Simuler un délai pour le débogage
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retourner une réponse de test simple
    return new NextResponse(
      JSON.stringify({ 
        success: true,
        message: 'API fonctionnelle',
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
        details: error instanceof Error ? error.message : 'Erreur inconnue'
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
