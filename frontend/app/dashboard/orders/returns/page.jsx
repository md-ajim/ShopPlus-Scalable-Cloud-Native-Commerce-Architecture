"use client";

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

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReturnsPage() {
  const returnItems = [
    {
      name: "Acme Wireless Headphones",
      quantity: 1,
      price: 99.99,
      image: "/headphones.jpg",
    },
    {
      name: "Acme Smart Speakers",
      quantity: 2,
      price: 149.99,
      image: "/speakers.jpg",
    },
  ];

  const refundSummary = {
    subtotal: 249.98,
    totalRefund: 249.98,
    instructions: [
      { title: "Package Items", description: "Carefully package the items..." },
      {
        title: "Print Label",
        description: "Print the prepaid return label...",
      },
      {
        title: "Schedule Pickup",
        description: "Schedule a pickup or drop it off...",
      },
    ],
  };

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
                  <BreadcrumbPage>Returns</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-2 lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Items Being Returned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {returnItems.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[80px_1fr_80px] items-center gap-4"
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            width={80}
                            height={80}
                            alt={item.name}
                            className="rounded-md object-cover"
                            style={{ aspectRatio: "80/80", objectFit: "cover" }}
                          />
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right font-medium">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Refund Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <p>Subtotal</p>
                      <p className="font-medium">
                        ${refundSummary.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p>Refund Amount</p>
                      <p className="text-2xl font-bold">
                        ${refundSummary.totalRefund.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Returns Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {refundSummary.instructions.map((instruction, index) => (
                      <div key={index} className="grid gap-2">
                        <h4 className="font-medium">
                          Step {index + 1}: {instruction.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {instruction.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button size="lg">Confirm Return</Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
