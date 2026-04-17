"use client";
import { loadStripe } from "@stripe/stripe-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import type { SessionData } from "@/types/sessionType";
import { Order, OrderItem } from "@/types/order";
import CheckOutButton from "@/components/CheckoutButton";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
interface CartItem {
  id: number;
  uniqId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  phone: string;
  saveInfo: boolean;
  shipping_method: string;
  order: number;
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);
// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().min(1, "Phone number is required"),
  order: z.number(),
  saveInfo: z.boolean().default(false),
  shipping_method: z.enum(["standard", "express", "overnight"]),
});

interface OrderSummary {
  id: number;
  tax: number;
  total_price: number;
  shipping_cost: number;
  payment_status: number;
}
export default function ShippingPage() {
  const { data: session } = useSession() as { data: SessionData | null };
  const [loading, setLoading] = useState(false);

  const [customerEmail, setCustomerEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const [OrderSummary, setOrderSummary] = useState<OrderSummary>({
    id: 0,
    tax: 0,
    total_price: 0,
    shipping_cost: 0,
    payment_status: 0,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      country: "",
      state: "",
      postalCode: "",
      phone: "",
      saveInfo: false,
      order: 0,
      shipping_method: "standard",
    },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/order/`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        console.log(response.data, "orders");
        const userOrders: Order[] = response.data.results.find(
          (order: Order) =>
            order?.user === session?.user?.id && order.status === "processing",
        );

        const userOrdersFilter: Order[] = response.data.results.filter(
          (order: Order) =>
            order?.user === session?.user?.id && order.status === "processing",
        );
        setOrder(userOrders);

        console.log(userOrders, "userOrders");

        const summary = userOrdersFilter.reduce(
          (acc: OrderSummary, item: Order) => ({
            id: item.id || acc.id,
            tax: acc.tax + (parseFloat(item.tax) || 0),
            total_price: acc.total_price + (parseFloat(item.total_price) || 0),
            shipping_cost:
              acc.shipping_cost + (parseFloat(item.shipping_cost) || 0),
            payment_status: acc.payment_status + (item.payment_status ? 1 : 0),
          }),
          {
            id: 0,
            tax: 0,
            total_price: 0,
            shipping_cost: 0,
            payment_status: 0,
          },
        );

        setOrderSummary(summary);
        const address = userOrdersFilter.map(
          (order: Order) => order.shipping_address,
        );
        if (address) {
          const shippingAddress: ShippingAddress = address[0][0];
          console.log(shippingAddress, "shippingAddress");
          form.setValue("firstName", shippingAddress.firstName);
          form.setValue("lastName", shippingAddress.lastName);
          form.setValue("address", shippingAddress.address);
          form.setValue("apartment", shippingAddress.apartment);
          form.setValue("city", shippingAddress.city);
          form.setValue("country", shippingAddress.country);
          form.setValue("state", shippingAddress.state);
          form.setValue("postalCode", shippingAddress.postalCode);
          form.setValue("phone", shippingAddress.phone);

          const processingData = response.data.results.filter(
            (item: Order) =>
              item.status === "processing" && item.user === session.user.id,
          );
          const items: CartItem[] = [];
          processingData.forEach((order: Order) => {
            order.items.forEach((order_item: any) => {
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
          handelCheckOut();
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrderSummary({
          id: 0,
          tax: 0,
          total_price: 0,
          shipping_cost: 0,
          payment_status: 0,
        });
      }
    };

    if (session?.accessToken) {
      fetchOrder();
    }
  }, [session]);

  console.log(order, "order id");

  useEffect(() => {
    if (OrderSummary.id > 0) {
      form.setValue("order", OrderSummary.id);
    }

    const factShippingAddress = async () => {
      const response = await axios.get("/api/shipping/", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      type ShippingResultItem = { order: { id: number } };
      const uniqId = response.data.results.find(
        (item: ShippingResultItem) => item.order.id === OrderSummary.id,
      );
      if (uniqId) {
        // router.push("/checkout/payment");
        handelCheckOut();
      }
    };
    if (session?.user.id) {
      factShippingAddress();
    }
  }, [session, form, OrderSummary.id]);

  console.log(order, "order");
  console.log(orderItems, "orderItems");

  const handelCheckOut = async () => {
    setLoading(true);
    try {
      // 1. Await the Stripe instance
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // 2. Create the checkout session on your backend
      const response = await axios.post(`/api/checkout`, {
        user_id: session?.user?.id,
        order_id: order?.id,
        order_items: orderItems,
        customer_email: "example@example.com",
      });

      if (!response.data || !response.data.id) {
        throw new Error("Checkout session creation failed");
      }

      const sessionId = response.data.id;

      // 3. Redirect to Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe Redirect Error:", error.message);
      }
    } catch (error) {
      console.log("Checkout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler

  console.log(OrderSummary, "orderSummary");

  console.log(session?.user.id, "user id");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/shippingAddress/`,
        values,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      );
      const { data } = response.data;
      if (data) {
        // router.push("/checkout/payment");
        handelCheckOut();
        return;
      }
    } catch (err) {
      console.log(err, "error");
    } finally {
      setLoading(false);

      // router.push("/checkout/payment");
    }
  }

  console.log(order, "order");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apt 4B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="saveInfo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Save this information for next time
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="shipping_method"
                      render={({ field }) => (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="standard"
                              value="standard"
                              checked={field.value === "standard"}
                              onChange={() => field.onChange("standard")}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="standard" className="block">
                              <div className="flex justify-between w-full">
                                <span>Standard Shipping</span>
                                <span>$5.99</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                3-5 business days
                              </p>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="express"
                              value="express"
                              checked={field.value === "express"}
                              onChange={() => field.onChange("express")}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="express" className="block">
                              <div className="flex justify-between w-full">
                                <span>Express Shipping</span>
                                <span>$12.99</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                1-2 business days
                              </p>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="overnight"
                              value="overnight"
                              checked={field.value === "overnight"}
                              onChange={() => field.onChange("overnight")}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="overnight" className="block">
                              <div className="flex justify-between w-full">
                                <span>Overnight Shipping</span>
                                <span>$24.99</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Next business day
                              </p>
                            </label>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                {/* <Button variant="outline" asChild>
                  <Link href="/cart">Back to Cart</Link>
                </Button> */}
                <Button disabled={loading} type="submit">
                  Continue to Payment{" "}
    
                  {loading ? <Loader2Icon className="animate-spin" /> : ""}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{`${(
                  OrderSummary.total_price -
                  OrderSummary.tax -
                  OrderSummary.shipping_cost
                ).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Default Shipping Standard{" "}
                </span>
                <span>{`${OrderSummary?.shipping_cost.toFixed()}.00`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{OrderSummary?.tax.toFixed() || "0.00"}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${OrderSummary?.total_price.toFixed() || "0.00"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
