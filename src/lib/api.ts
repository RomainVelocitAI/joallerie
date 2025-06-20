class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export interface GenerateImageParams {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  n?: number;
}

export interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

export const api = {
  /**
   * Génère des images basées sur une description
   */
  async generateImages(params: GenerateImageParams): Promise<GeneratedImage[]> {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        size: params.size || '1024x1024',
        n: Math.min(params.n || 1, 4),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Erreur lors de la génération des images',
        response.status,
        data.details
      );
    }

    return data.images;
  },

  // Vous pouvez ajouter d'autres méthodes d'API ici
  // Par exemple pour gérer les clients, les commandes, etc.
};

export default api;
