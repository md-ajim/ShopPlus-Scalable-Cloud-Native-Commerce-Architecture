import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function SaveForLaterPage() {

  const savedItems = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 199.99,
      originalPrice: 249.99,
      image: "/headphones.jpg",
      quantity: 1,
    },
    {
      id: "2",
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      image: "/tshirt.jpg",
      quantity: 2,
    },
  ];

  const subtotal = savedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Saved for Later</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {savedItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No saved items
              </h3>
              <p className="mt-1 text-gray-500">
                Items you save for later will appear here.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            savedItems.map((item) => (
              <SavedItemCard key={item.id} item={item} />
            ))
          )}
        </div>

        {savedItems.length > 0 && (
          <div>
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

interface SavedItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

function SavedItemCard({ item }: { item: SavedItem }) {
  return (
    <Card className="flex flex-col sm:flex-row">
      <div className="sm:w-1/3 p-4">
        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
       
          <img
            src={item.image}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <div className="sm:w-2/3 p-4 flex flex-col">
        <div className="flex-1">
          <h3 className="font-medium text-lg">{item.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold">${item.price.toFixed(2)}</span>
            {item.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              -
            </Button>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              className="w-16 text-center"
              readOnly
            />
            <Button variant="outline" size="sm">
              +
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Remove
          </Button>
          <Button size="sm" className="ml-auto">
            Move to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}