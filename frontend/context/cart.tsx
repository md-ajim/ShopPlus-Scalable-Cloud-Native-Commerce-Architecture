// app/contexts/cart-context.tsx
"use client";

import { createContext, useContext, ReactNode, useState } from 'react';


type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  total: {
    subtotal: number;
    shipping: number;
    tax: number;
    grandTotal: number;
  };
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  proceedToPayment: (paymentDetails: unknown) => Promise<{ success: boolean; error?: string }>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProviders({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const grandTotal = subtotal + shipping + tax;

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };


  return (
  <CartContext.Provider value={{
    cart,
    total: { subtotal, shipping, tax, grandTotal },
    addToCart,
    removeFromCart,
    updateQuantity,
    proceedToPayment: async (paymentDetails: unknown) => {
      console.log('Processing payment with:', paymentDetails);
      return new Promise<{ success: boolean; error?: string }>(resolve => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    }
  }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
