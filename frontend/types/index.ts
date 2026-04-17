export type Notification = {
  id: number
  title: string
  message: string
  read: boolean
  type: "order" | "promotion" | "system"
  actionUrl?: string
  createdAt: string
}


// types/index.ts
export interface Product {
  id: number;
  name: string;
  price: string; // Django DecimalField usually returns string
  image: string;
  category?: string;
}

export interface CartItem {
  id: number;
  cart : number,
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  // Included mainly for UI optimism
  isLoading?: boolean; 
}

export interface User {
  id: number;
  email: string;
  name: string;
}