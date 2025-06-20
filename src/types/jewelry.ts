export type JewelryType = 'bague' | 'collier' | 'bracelet' | 'boucles-oreilles' | 'autre';
export type Material = 'or' | 'argent' | 'platine' | 'or-rose' | 'pierres-precieuses';
export type Style = 'moderne' | 'classique' | 'vintage' | 'ethnique' | 'fantaisie';

export interface GeneratedImage {
  id: string;
  url: string;
  revised_prompt?: string;
  prompt: string;
  selected: boolean;
}
