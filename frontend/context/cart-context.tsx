

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api} from "@/lib/axios";
import { CartItem } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner"; // Recommend using Sonner for modern toasts
import { OrderItem } from "@/types/order";

import { SessionData } from "@/types/sessionType";


interface CartContextType {
  items: CartItem[];
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  createOrder: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { data: session } = useSession() as { data: SessionData | null };
  const [isLoading, setIsLoading] = useState(false);


  

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("cartitem/");
      console.log(data, 'data')

      const CurrentUserCartItem = data?.filter(( i: CartItem) => i.cart.user === session?.user.id)
      console.log(CurrentUserCartItem, 'crrentusercartimtem')
      console.log(session?.user.id, 'user id')
      // Aggregate duplicates (Logic preserved from your code)
      const uniqueCartItems = CurrentUserCartItem.reduce((acc: CartItem[], item: CartItem) => {
        const existingItem = acc.find((i) => i.product.id === item.product.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      
      setItems(uniqueCartItems);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user){
      fetchCart();
    }
  }, [session]);

  const addItem = async (productId: number, quantity = 1) => {
    // Optimistic update could go here
    try {
      await api.post("cartitem/", { product: productId, quantity });
      toast.success("Item added to cart");
      await fetchCart();
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  const updateItem = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await api.patch(`cartitem/${itemId}/`, { quantity: newQuantity });
      // Manually update local state for instant feedback
      setItems(prev => prev.map(item => item.id === itemId ? {...item, quantity: newQuantity} : item));
    } catch (err) {
      console.error(err);
      fetchCart(); // Revert on error
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setItems(prev => prev.filter(item => item.id !== itemId)); // Optimistic
      await api.delete(`cartitem/${itemId}/`);
    } catch (err) {
      fetchCart();
    }
  };

  const clearCart = async () => {
    try {
      setItems([]);
      await Promise.all(items.map((item) => api.delete(`cartitem/${item.id}/`)));
    } catch (err) {
      fetchCart();
    }
  };

  const createOrder = async () => {
    if (!session?.user) return;
    const subtotal = items.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const uid = 'ORD' + Date.now().toString().slice(-5) + Math.floor(Math.random() * 1000);

    try {
      const { data} = await api.post(`order`, {
        uniqId: uid,
        status: "processing",
        total_price: total.toFixed(2),
        tax: tax.toFixed(2),
        shipping_cost: "5.99",
        payment_status: false,
        user: session.user.id, // Ensure your Session type includes ID
      });

      if (data){

     const header_data : OrderItem[] = [];

      const item =  items.forEach((item)=>{
         header_data.push({
          product: {
            name: item.product.name,
            price: item.product.price
          },
           image : item.product.image,
          quantity: item.quantity,
          user: session.user.id,
          color: item.color,
          size : item.size,
          unit_price: item.product.price,
          order: data.id,
        })

      })
      const res = await api.post(`orderitem/`, { header_data })
      if (res.data){
        console.log(res.data, 'res')
        await clearCart();
        return true;
      }
      }
  

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const cartTotal = items.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItem, clearCart, createOrder, cartTotal, itemCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};