export interface Product {
  id: number;
  name: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  default_size: string;
  default_color: string;
  discount: string;
  image: string;
  stock: number;
  is_active: boolean;
  category: Category;
  search_categories: 'CLOTHES' | 'HOME' | 'ELECTRONICS' | 'BEAUTY' | 'SPORTS' | 'ALL';
  materials: string;
  care_instructions: string;
  video_url?: string;
  rating_count: number;
  created_at: string;
  updated_at: string;
  features: Feature[];
  specifications: Specification[];
  details: Detail[]; 
  variants: Variant[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
}

export interface Feature {
  feature: string;
}

export interface Specification {
  id: number;
  key: string;
  value: string;
  order: number;
}

export interface Detail {
  material: string;
  core: string;
  origin: string;
  weight: string;
}

export interface Variant {
  id: number;
  quality: VariantQuality[];
  stock: number;
  price_modifier: string;
  product: number;
}

export interface VariantQuality {
  color: string;
  color_code: string;
  size: string;
  size_code: string;
  image: string;
}
