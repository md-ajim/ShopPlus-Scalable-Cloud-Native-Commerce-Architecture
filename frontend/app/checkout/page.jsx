'use client';
import CheckoutButton from '@/components/CheckoutButton';

export default function TestCheckoutPage() {
  // Test cart data
  const testCartItems = [
    {
      id: 'prod_PNe8b3V4q1ZwJX',
      name: 'Premium T-Shirt',
      price: 29.99,
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Grey_Tshirt.jpg',
      quantity: 2
    },
    {
      id: 'prod_QWe5rT7y2XvBnM',
      name: 'Wireless Headphones',
      price: 199.99,
      image: 'https://media.istockphoto.com/id/1412240771/photo/headphones-on-white-background.jpg?s=612x612&w=0&k=20&c=DwpnlOcMzclX8zJDKOMSqcXdc1E7gyGYgfX5Xr753aQ=',
      quantity: 1
    }
  ];

  const testUserEmail = 'test@example.com';

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Checkout</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Cart Items</h2>
        <ul className="divide-y">
          {testCartItems.map(item => (
            <li key={item.id} className="py-3">
              <div className="flex justify-between">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p>${item.price.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t pt-3 mt-3">
          <p className="text-right font-medium">
            Total: ${testCartItems.reduce(
              (sum, item) => sum + (item.price * item.quantity), 0
            ).toFixed(2)}
          </p>
        </div>
      </div>

      <CheckoutButton 
        order_items={testCartItems} 
        customer_email={testUserEmail} 
      />
    </div>
  );
}