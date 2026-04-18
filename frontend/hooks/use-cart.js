"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

const API_BASE = '/api/cartitem/'
const ENDPOINTS = {
  GET_CART: API_BASE,
  ADD_ITEM: API_BASE,
  UPDATE_ITEM: (id) => `${API_BASE}${id}/`,
  REMOVE_ITEM: (id) => `${API_BASE}${id}/`,
  CLEAR_CART: API_BASE + 'clear/'
}

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      
      fetchCart: async () => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(ENDPOINTS.GET_CART)
          if (!response.ok) throw new Error('Failed to fetch cart')
          const data = await response.json()
          set({ items: data })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Unknown error' })
        } finally {
          set({ loading: false })
        }
      },
      
      addItem: async (productId, quantity) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(ENDPOINTS.ADD_ITEM, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product: productId,
              quantity: quantity
            })
          })
          
          if (!response.ok) throw new Error('Failed to add item')
          await get().fetchCart()
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Unknown error' })
        } finally {
          set({ loading: false })
        }
      },
      
      updateItem: async (id, quantity) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(ENDPOINTS.UPDATE_ITEM(id), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
          })
          
          if (!response.ok) throw new Error('Failed to update item')
          await get().fetchCart()
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Unknown error' })
        } finally {
          set({ loading: false })
        }
      },
      
      removeItem: async (id) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(ENDPOINTS.REMOVE_ITEM(id), {
            method: 'DELETE'
          })
          
          if (!response.ok) throw new Error('Failed to remove item')
          await get().fetchCart()
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Unknown error' })
        } finally {
          set({ loading: false })
        }
      },
      
      clearCart: async () => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(ENDPOINTS.CLEAR_CART, {
            method: 'POST'
          })
          
          if (!response.ok) throw new Error('Failed to clear cart')
          set({ items: [] })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Unknown error' })
        } finally {
          set({ loading: false })
        }
      },
      
      get subtotal() {
        return get().items.reduce(
          (sum, item) => sum + (parseFloat(item.product.price) * item.quantity,0),0)
      },
      
      get discount() {
        return get().items.reduce(
          (sum, item) => sum + (parseFloat(item.product.discount) * item.quantity, 0),0)
      },
      
      get tax() {
        const subtotal = get().subtotal
        const discount = get().discount
        return (subtotal - discount) * 0.1
      },
      
      get shipping() {
        const subtotal = get().subtotal
        return get().items.length === 0 || subtotal > 50 ? 0 : 5.99
      },
      
      get total() {
        const subtotal = get().subtotal
        const discount = get().discount
        const tax = get().tax
        const shipping = get().shipping
        return (subtotal - discount) + tax + shipping
      }
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items })
    }
  )
)

