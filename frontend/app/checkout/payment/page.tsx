

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import type { SessionData } from "@/types/sessionType";
import { Order } from "@/types/order";
import CheckOutButton from "@/components/CheckoutButton";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart";

// Types
interface OrderSummary {
  id: number;
  uniqId: string;
  tax: number;
  total_price: number;
  shipping_cost: number;
  payment_status: number;
  user: number;
}

interface CartItem {
  id: number;
  uniqId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

// Corrected Payment Validation Schema
const paymentSchema = z.object({
  method: z.enum(
    ["credit-card", "paypal", "stripe", "bank-transfer", "cash-on-delivery"],
    {
      required_error: "Please select a payment method",
    }
  ),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
  cardName: z.string().optional(),
}).superRefine((data, ctx) => {
  // Cross-field validation for credit card
  if (data.method === "credit-card") {
    if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ""))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid card number",
        path: ["cardNumber"]
      });
    }
    
    if (!data.expiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.expiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid expiry date (MM/YY)",
        path: ["expiry"]
      });
    }
    
    if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid CVV",
        path: ["cvv"]
      });
    }
    
    if (!data.cardName || data.cardName.trim().length <= 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cardholder name required",
        path: ["cardName"]
      });
    }
  }
});

export default function PaymentMethodPage() {
  const { cart, proceedToPayment } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { data: session } = useSession() as { data: SessionData | null };
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<CartItem[] | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    id: 0,
    uniqId: '',
    tax: 0,
    total_price: 0,
    shipping_cost: 0,
    payment_status: 0,
    user: 0,
  });

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: "credit-card",
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardName: "",
    },
  });

  
  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await axios.get(`/api/order/`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const processingData = response.data.results.filter((item: Order) => item.status === 'processing' &&  item.user ===session.user.id);
        
        const items: CartItem[] = [];
        console.log(processingData , 'processingData')

        processingData.forEach((order: Order) => {
          order.items.forEach((order_item) => {
            items.push({
              id: order.id,
              uniqId: order.uniqId,
              name: order_item.products.name,
              image: order_item.image,
              quantity: order_item.quantity,
              price: parseFloat(order_item.unit_price),
            });
          });
        });

        setOrderItems(items);

        const userOrders: Order[] = response.data.results.filter(
          (order: Order) => {
            if (order?.user && typeof order.user === "object" && "id" in order.user) {
              return (order.user as { id: number }).id === session?.user?.id;
            }
            return typeof order?.user === "number" && order.user === session?.user?.id;
          }
        );

  


        const summary = processingData.reduce(
          (acc: OrderSummary, item: Order) => ({
            id: typeof item.id === "number" ? item.id : acc.id,
            uniqId: typeof item.uniqId === "string" ? item.uniqId : acc.uniqId,
            tax: acc.tax + (typeof item.tax === "string" ? parseFloat(item.tax) : item.tax || 0),
            total_price: acc.total_price + (typeof item.total_price === "string" ? parseFloat(item.total_price) : item.total_price || 0),
            shipping_cost: acc.shipping_cost + (typeof item.shipping_cost === "string" ? parseFloat(item.shipping_cost) : item.shipping_cost || 0),
            payment_status: acc.payment_status + (item.payment_status ? 1 : 0),
            user: typeof item.user === "number" ? item.user : acc.user,
          }),
          {
            id: 0,
            uniqId: '',
            tax: 0,
            total_price: 0,
            shipping_cost: 0,
            payment_status: 0,
            user: 0,
          }
        );

        setOrderSummary(summary);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrderSummary({
          id: 0,
          uniqId: '',
          tax: 0,
          total_price: 0,
          shipping_cost: 0,
          payment_status: 0,
          user: 0,
        });
      }
    };

    fetchOrder();
  }, [session]);

  // Fetch shipping address and customer email
  useEffect(() => {
    const fetchShippingAddress = async () => {
      if (!session?.accessToken || !orderSummary.id || !orderSummary.user) return;

      try {
        const response = await axios.get("/api/shipping/", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        type ShippingResultItem = { order: { id: number } };
        const shippingData = response.data.results.find(
          (item: ShippingResultItem) => item.order.id === orderSummary.id
        );

        if (shippingData) {
          const userResponse = await axios.get(
            `/api/users/${orderSummary.user}`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );
          setCustomerEmail(userResponse.data.email);
        }
      } catch (error) {
        console.error("Error fetching shipping address:", error);
      }
    };

    fetchShippingAddress();
  }, [session, orderSummary.id, orderSummary.user]);

  const selectedMethod = form.watch("method");

  async function onSubmit(values: z.infer<typeof paymentSchema>) {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const paymentResult = await proceedToPayment({
        method: values.method,
        details:
          values.method === "credit-card"
            ? {
                cardNumber: values.cardNumber,
                expiry: values.expiry,
                cvv: values.cvv,
                name: values.cardName,
              }
            : null,
      });

      if (paymentResult.success) {
        setPaymentSuccess(true);
      } else {
        throw new Error(paymentResult.error || "Payment failed");
      }
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Payment processing failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg mb-8">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>
        <Button onClick={() => (window.location.href = "/orders")}>
          View Your Orders
        </Button>
      </div>
    );
  }

  const subtotal = orderSummary.total_price - orderSummary.tax - orderSummary.shipping_cost;



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment Method</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-4"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="credit-card"
                              id="credit-card"
                            />
                            <Label htmlFor="credit-card">
                              Credit/Debit Card
                            </Label>
                          </div>

                          {selectedMethod === "credit-card" && (
                            <div className="ml-6 space-y-4">
                              <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="1234 5678 9012 3456"
                                        onChange={(e) => {
                                          const value = e.target.value
                                            .replace(/\D/g, "")
                                            .match(/.{1,4}/g);
                                          field.onChange(
                                            value ? value.join(" ") : ""
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="expiry"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiry Date</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="MM/YY"
                                          onChange={(e) => {
                                            let value = e.target.value.replace(
                                              /\D/g,
                                              ""
                                            );
                                            if (value.length > 2) {
                                              value =
                                                value.substring(0, 2) +
                                                "/" +
                                                value.substring(2, 4);
                                            }
                                            field.onChange(value);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="cvv"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVV</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="123"
                                          type="password"
                                          maxLength={4}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name="cardName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name on Card</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="John Doe"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal">PayPal</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="stripe" id="stripe" />
                            <Label htmlFor="stripe">Stripe</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="bank-transfer"
                              id="bank-transfer"
                            />
                            <Label htmlFor="bank-transfer">Bank Transfer</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="cash-on-delivery"
                              id="cash-on-delivery"
                            />
                            <Label htmlFor="cash-on-delivery">
                              Cash on Delivery
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {form.formState.errors.root && (
                    <p className="text-sm font-medium text-destructive mt-4">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => window.history.back()}
                >
                  Back to Shipping
                </Button>
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <CheckOutButton
                  user_id={session?.user.id}
                  order_id={orderSummary.id}
                  order_items={orderItems}
                  customer_email={customerEmail}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${orderSummary.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${orderSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${orderSummary.total_price.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}