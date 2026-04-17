// app/account/addresses/page.tsx

import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

export default function SavedAddressesPage() {
  // Mock data - replace with your actual data fetching
  const addresses = [
    {
      id: "1",
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      name: "John Doe",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
      isDefault: false,
    },
  ];

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
                      <BreadcrumbPage>Addresses</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Separator />
                  <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <Button asChild>
          <Link href="/dashboard/account/addresses/add">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Address
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {address.name}{" "}
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/account/addresses/edit/${address.id}`}>
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2Icon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
                <p className="text-muted-foreground">{address.phone}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {!address.isDefault && (
                <Button variant="outline" size="sm">
                  Set as Default
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You don&#39;t have any saved addresses yet.
          </p>
          <Button asChild>
            <Link href="/account/addresses/add">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Your First Address
            </Link>
          </Button>
        </div>
      )}
    </div>
            </div>
          </SidebarInset>
        </SidebarProvider>



  );
}