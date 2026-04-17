"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

const cartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    quantity: 1,
    image: "/images/Headphones.jpg"
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: 159.95,
    quantity: 2,
    image: "/images/Smart Watches1.webp"
  }
]

export default function CartPage() {
  const [items, setItems] = React.useState(cartItems)

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({items.length})</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.id} className="flex gap-6 border-b pb-6">
              <img
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                // layout="responsive"
                className="h-24 w-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-20"
                    min="1"
                  />
                  <p className="text-lg font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-muted p-6 rounded-xl h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal ({items.length} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full mt-6" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}