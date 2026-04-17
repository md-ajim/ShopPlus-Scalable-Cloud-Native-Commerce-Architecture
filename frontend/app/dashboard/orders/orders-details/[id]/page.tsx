"use client";

import axios from "axios";
import { Order, OrderItem } from "@/types/order";
import { useRouter, useParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  zip: string;
  method: string;
  trackingNumber: string;
}

interface Orders {
  id: string;
  customer: Customer;
  date: string;
  status: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [orders, setOrders] = useState<Orders | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `/api/getOrder/`
        );
        if (response.data) {
          const order = response.data.results.find(
            (order: Order) => order.uniqId === id
          );
          console.log(order, "filtered");
          const primaryShipping = order.shipping_address[0];
          const processed = {
            id: order.uniqId,
            customer: {
              name: order.user.username || "", // Handle potential undefined
              email: order.user.email || "",
              phone: primaryShipping.phone,
            },
            date: order.created_at,
            status: order.status,
            items: order.items.map((item: OrderItem) => ({
              id: item.id.toString(),
              name: item.products.name,
              sku: item.sku || "", // Default value
              price: Number(item.unit_price),
              quantity: item.quantity,
              image: item.image,
            })),
            shipping: {
              address: primaryShipping.address,
              city: primaryShipping.city,
              state: primaryShipping.state,
              zip: primaryShipping.zip || "",
              method: primaryShipping.shipping_method,
              trackingNumber: primaryShipping.trackingNumber || "",
            },
            totals: {
              subtotal:
                Number(order.total_price) -
                Number(order.tax) -
                Number(order.shipping_cost),
              shipping: Number(order.shipping_cost),
              tax: Number(order.tax),
              total: Number(order.total_price),
            },
          };

          setOrders(processed);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateSubtotal = () => {
    const sum = orders?.items.reduce(
      (acc: number, item: OrderItem) =>
        acc + Number(item.unit_price) * item.quantity,
      0
    );
    return sum; 


  };
  console.log(orders, "orders");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    <BreadcrumbPage>Orders</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage
                    onClick={() => router.push("/dashboard/orders")}
                  >
                    #{orders?.id}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => router.push("/dashboard/orders")}
                  variant="outline"
                  size="icon"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1
                  className="text-2xl font-bold"
                  onClick={() => router.push("/dashboard/orders")}
                >
                  Order #{orders?.id}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <ChevronLeftIcon className="w-5 h-5" />
                  <span className="sr-only">Previous</span>
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRightIcon className="w-5 h-5" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders?.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-4 flex-wrap">
                                <img
                                  src={item.image || ""}
                                  alt="image"
                                  width={64}
                                  height={64}
                                  className="rounded-md"
                                  style={{
                                    aspectRatio: "64/64",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <div className="font-medium">
                                    {item?.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    SKU: {item.sku}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {formatCurrency(Number(item.price))}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(
                                Number(item.price) * item.quantity
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium">Shipping Address</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {`${orders?.shipping.address}`}
                        <br />
                        {`${orders?.shipping.city}, ${orders?.shipping.state} ${orders?.shipping.zip}`}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Shipping Method</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {orders?.shipping.method}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Tracking Number</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {orders?.shipping.trackingNumber}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <div className="text-gray-500 dark:text-gray-400">
                        Subtotal
                      </div>
                      <div>{formatCurrency(calculateSubtotal() || 0)}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-500 dark:text-gray-400">
                        Shipping
                      </div>
                      <div>{formatCurrency(orders?.totals.subtotal || 0)}</div>

                      <div className="flex justify-between">
                        <div className="text-gray-500 dark:text-gray-400">
                          Shipping
                        </div>
                        <div>
                          {formatCurrency(orders?.totals.shipping || 0)}
                        </div>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Tax
                      </div>
                      <div>{formatCurrency(orders?.totals.tax || 0)}</div>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <div>Total</div>
                      <div>{formatCurrency(orders?.totals.total || 0)}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {/* <Button variant="outline">Refund</Button> */}
                    <Button>Mark as Paid</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium">Customer</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {orders?.customer.name}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {orders?.customer.email}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {orders?.customer.phone}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
