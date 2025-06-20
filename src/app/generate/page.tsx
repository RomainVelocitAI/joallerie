'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Image as ImageIcon, Download, Wand2 } from 'lucide-react';

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
  'Montre',
  'Autre'
];

const MATERIALS = [
  'Or jaune', 
  'Or blanc', 
  'Or rose', 
  'Argent 925', 
  'Platine',
  'Palladium',
  'Acier inoxydable',
  'Titane',
  'Or blanc rhodié',
  'Or jaune 18 carats',
  'Or blanc 18 carats',
  'Or rose 18 carats'
];

const STYLES = [
  'Moderne', 
  'Classique', 
  'Vintage', 
  'Minimaliste', 
  'Fantaisie',
  'Élégant',
  'Bohème',
  'Rétro',
  'Contemporain',
  'Art déco',
  'Baroque',
  'Personnalisé'
];

export default function JewelryGenerator() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [specs, setSpecs] = useState({
    type: JEWELRY_TYPES[0],
    material: MATERIALS[0],
    style: STYLES[0],
    description: '',
  });

  const handleGenerate = async () => {
    setLoading(true);
    setImages([]);
    setSelectedImage(null);
    
    try {
      // Simuler un délai pour le chargement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dans une vraie application, on appellerait l'API ici
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     prompt: generatePrompt(),
      //   })
      // });
      // const data = await response.json();
      
      // Simulation de données pour le développement
      const mockImages = [
        'https://images.unsplash.com/photo-1611591437281-460914d22873?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1602173570798-2eeaa302be42?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1605100804545-04cdaa0d4a95?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60'
      ];
      
      setImages(mockImages);
      setSelectedImage(mockImages[0]);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePrompt = () => {
    return `Crée une image photoréaliste d'une ${specs.material} ${specs.type} de style ${specs.style}. ${specs.description}`;
  };

  const handleExport = () => {
    if (!selectedImage) return;
    // Dans une vraie application, on appellerait l'API d'export ici
    alert('Fonctionnalité d\'export à implémenter');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Générateur de Bijoux IA</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Wand2 className="mr-2 h-5 w-5" /> Spécifications
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de bijou</label>
              <select 
                value={specs.type}
                onChange={(e) => setSpecs({...specs, type: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {JEWELRY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Métal</label>
              <select 
                value={specs.material}
                onChange={(e) => setSpecs({...specs, material: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {MATERIALS.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <select 
                value={specs.style}
                onChange={(e) => setSpecs({...specs, style: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description détaillée
                <span className="text-xs text-gray-500 ml-1">(facultatif)</span>
              </label>
              <textarea
                value={specs.description}
                onChange={(e) => setSpecs({...specs, description: e.target.value})}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez en détail le bijou que vous imaginez..."
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Générer des modèles
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" /> Modèles générés
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Génération en cours...</span>
              </div>
            ) : images.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {images.map((img, index) => (
                    <div 
                      key={index}
                      className={`relative group rounded-lg overflow-hidden border-2 ${
                        selectedImage === img 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      } transition-all`}
                    >
                      <img
                        src={img}
                        alt={`Modèle ${index + 1}`}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => setSelectedImage(img)}
                      />
                      {selectedImage === img && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="bg-white text-gray-800 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Fonction d'édition à implémenter
                            }}
                          >
                            ✏️ Éditer
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Modèle sélectionné</h3>
                      <p className="text-sm text-gray-500">
                        {specs.material} {specs.type} - Style {specs.style}
                      </p>
                    </div>
                    <Button 
                      onClick={handleExport}
                      className="ml-4"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun modèle généré</h3>
                  <p className="text-gray-500 mb-4">
                    Remplissez le formulaire et cliquez sur "Générer des modèles" pour commencer.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
