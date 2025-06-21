import { ComponentType, SVGProps, JSX } from 'react';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export interface IconsType {
  [key: string]: Icon | ((props: SVGProps<SVGSVGElement>) => JSX.Element);
  spinner: Icon;
  gem: Icon;
  sparkles: Icon;
  moon: Icon;
  sun: Icon;
  home: Icon;
  users: Icon;
  settings: Icon;
  image: Icon;
  download: Icon;
  wand: Icon;
  zap: Icon;
  palette: Icon;
  logo: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  google: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  github: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export type Theme = 'light' | 'dark' | 'system';

export interface JewelrySpecs {
  type: string;
  material: string;
  style: string;
  description: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  clientId: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
  total: number;
  deposit?: number;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
