'use client';

import { useState } from 'react';
import { Wand2, Image as ImageIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { JewelryType, Material, Style, GeneratedImage } from '@/types/jewelry';

interface JewelryImage {
  id: string;
  url: string;
  description: string;
  selected: boolean;
}

const JEWELRY_TYPES = [
  'Bague', 
  'Collier', 
  'Boucles d\'oreilles', 
  'Bracelet', 
  'Pendentif',
  'Bague de fiançailles',
  'Bague de mariage',
  'Bague de promesse',
  'Chaîne',
  'Gourmette',
];

export default function JewelryGenerator() {
  const [jewelryType, setJewelryType] = useState<JewelryType>('bague');
  const [material, setMaterial] = useState<Material>('or');
  const [style, setStyle] = useState<Style>('moderne');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<JewelryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const copyDescription = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success('Description copiée dans le presse-papier');
  };



  const generateImages = async () => {
    if (!description.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    const formData = {
      description,
      jewelryType,
      material,
      style
    };

    console.log('Données du formulaire:', formData);

    setIsGenerating(true);
    
    try {
      console.log('Envoi de la requête à /api/generate...');
      // Appel à l'API pour générer l'image
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Réponse reçue, status:', response.status);
      
      // Essayer de lire le corps de la réponse dans tous les cas
      let responseText;
      try {
        responseText = await response.text();
        console.log('Réponse brute:', responseText);
      } catch (e) {
        console.error('Impossible de lire le corps de la réponse:', e);
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = responseText ? JSON.parse(responseText) : null;
          console.error('Erreur API détaillée:', {
            status: response.status,
            statusText: response.statusText,
            errorData
          });
        } catch (e) {
          console.error('Impossible de parser la réponse d\'erreur:', responseText);
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const errorMessage = errorData?.error || 'Échec de la génération d\'image';
        const error = new Error(errorMessage);
        // Ajouter les détails supplémentaires à l'erreur
        Object.assign(error, { 
          response: errorData,
          status: response.status,
          statusText: response.statusText
        });
        throw error;
      }

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
        console.log('Données de la réponse:', data);
      } catch (e) {
        console.error('Erreur lors du parsing de la réponse:', e);
        throw new Error('Format de réponse invalide');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Erreur inconnue lors de la génération');
      }

      // Mettre à jour l'état avec la nouvelle image
      const newImage: JewelryImage = {
        id: `img-${Date.now()}`,
        url: data.imageUrl,
        description: data.description || `${jewelryType} en ${material} de style ${style}: ${description}`,
        selected: true,
      };

      setGeneratedImages([newImage]);
      setSelectedImage(newImage.url);
      
      toast.success('Image générée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image:', error);
      
      // Afficher plus de détails sur l'erreur
      let errorMessage = 'Erreur lors de la génération de l\'image';
      
      try {
        if (error instanceof Error) {
          // Si c'est une erreur avec une réponse JSON
          if ('json' in error && typeof error.json === 'function') {
            const errorData = await error.json();
            console.error('Détails de l\'erreur:', errorData);
            errorMessage = errorData.error || errorData.message || errorMessage;
            
            // Si l'API a retourné des détails supplémentaires
            if (errorData.details) {
              console.error('Détails techniques:', errorData.details);
            }
          } else {
            errorMessage = error.message || errorMessage;
          }
        }
      } catch (e) {
        console.error('Erreur lors de la récupération des détails de l\'erreur:', e);
      }
      
      toast.error(errorMessage, {
        description: 'Veuillez réessayer ou contacter le support si le problème persiste.',
        action: {
          label: 'Copier l\'erreur',
          onClick: () => navigator.clipboard.writeText(error instanceof Error ? error.message : 'Erreur inconnue')
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectImage = (id: string) => {
    setGeneratedImages(images =>
      images.map(img => ({
        ...img,
        selected: img.id === id
      }))
    );
    const selected = generatedImages.find(img => img.id === id);
    if (selected) {
      setSelectedImage(selected.url);
    }
  };

  const downloadImage = async (image: JewelryImage) => {
    if (!image.url) return;
    
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `bijou-${image.description.substring(0, 20).toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNnY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00Ii8+PHBvbHlsaW5lIHBvaW50cz0iOCAxNiAxMiAxMiAxNiAxNiIvPjxsaW5lIHgxPSIxMiIgeTE9IjIiIHgyPSIxMiIgeTI9IjEyIi8+PC9zdmc+'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Générateur de Bijoux IA</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de génération */}
        <div className="lg:col-span-1 bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Spécifications du bijou</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type de bijou</label>
              <select 
                value={jewelryType}
                onChange={(e) => setJewelryType(e.target.value as JewelryType)}
                className="w-full p-2 border rounded-md bg-background text-foreground"
                disabled={isGenerating}
              >
                <option value="bague">Bague</option>
                <option value="collier">Collier</option>
                <option value="bracelet">Bracelet</option>
                <option value="boucles-oreilles">Boucles d'oreilles</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Matière</label>
              <select 
                value={material}
                onChange={(e) => setMaterial(e.target.value as Material)}
                className="w-full p-2 border rounded-md bg-background text-foreground"
                disabled={isGenerating}
              >
                <option value="or">Or</option>
                <option value="argent">Argent</option>
                <option value="platine">Platine</option>
                <option value="or-rose">Or rose</option>
                <option value="pierres-precieuses">Pierres précieuses</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Style</label>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value as Style)}
                className="w-full p-2 border rounded-md bg-background text-foreground"
                disabled={isGenerating}
              >
                <option value="moderne">Moderne</option>
                <option value="classique">Classique</option>
                <option value="vintage">Vintage</option>
                <option value="ethnique">Ethnique</option>
                <option value="fantaisie">Fantaisie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description détaillée</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez en détail le bijou que vous imaginez..."
                rows={4}
                className="w-full p-2 border rounded-md bg-background text-foreground"
                disabled={isGenerating}
              />
            </div>

            <Button
              onClick={generateImages}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Générer des modèles
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Résultats de la génération */}
        <div className="lg:col-span-2">
          <div className="bg-card p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Modèles générés</h2>
            
            {generatedImages.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">Aucun modèle généré</h3>
                <p className="mt-1 text-sm text-muted-foreground">Utilisez le formulaire pour générer des modèles de bijoux uniques.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map((image) => (
                  <div 
                    key={image.id} 
                    className={`relative group border-2 rounded-lg overflow-hidden transition-all ${
                      image.selected 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => selectImage(image.id)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.description} 
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground truncate">
                        {image.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button 
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyDescription(image.description)}
                        className="h-8 w-8"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedImage && generatedImages.some(img => img.id === selectedImage) && (
            <div className="bg-card p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4">Modèle sélectionné</h2>
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md mb-4">
                  {generatedImages.find(img => img.id === selectedImage)?.url && (
                    <img 
                      src={generatedImages.find(img => img.id === selectedImage)?.url} 
                      alt="Modèle sélectionné" 
                      className="w-full rounded-lg shadow-lg"
                      onError={handleImageError}
                    />
                  )}
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      const img = generatedImages.find(img => img.id === selectedImage);
                      if (img) {
                        downloadImage(img);
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline">
                    Ajouter à la sélection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
