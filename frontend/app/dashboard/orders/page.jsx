"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


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
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";


export default function Page() {


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [orders, setOrders] = useState(null);
  const { data: session}=useSession()
  

  useEffect(() => {
    const facetOrder = async () => {
      const response = await axios.get(`/api/order/`);
      const data = response.data.results.filter(
        (item) => item.status === "completed" && item.user ===  session?.user?.id
      );
      
      console.log(response.data, 'data')


      function convertDate (uniqId){
        const date = new Date(uniqId);
        const year = date.getFullYear();
        const month = String( date.getMonth() + 1).padStart('0' , 2)
        const day = String(date.getDate()).padStart('0' , 2)
        const hours = String(date.getHours()).padStart('0' , 2)
        const minutes = String(date.getMinutes()).padStart('0', 2) 
        const seconds = String(date.getSeconds()).padStart('0', 2)
        return `Date ${year}-${month}-${day} Time ${hours} : ${minutes}: ${seconds}`

      }

      const arr  = []
      console.log(arr , 'arr')
      setOrders(arr);
      data.forEach((item)=>{
        arr.push({
          id : item.uniqId,
          date : convertDate(item.created_at),
          total : item.total_price,
          status: item.status
        })
      })
    };

    facetOrder();
  }, []);



  const filteredOrders = orders?.filter((order) =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders?.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders?.length / ordersPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                  <BreadcrumbPage> Orders </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto px-4 md:px-6 py-8">
            <header className="mb-6">
              <h1 className="text-2xl font-bold">My Orders</h1>
              <div className="relative mt-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-lg bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-background rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground rounded-t-lg">
                    <th className="px-4 py-3 text-left">Order #</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders?.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-muted/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/dashboard/orders/orders-details/${order.id}`}>{order.id}</Link>{" "}
                      </td>
                      <td className="px-4 py-3">
                        {" "}
                        <Link href={`/dashboard/orders/orders-details/${order.id}`}> {order.date}</Link>{" "}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/dashboard/orders/orders-details/${order.id}`}> ${order.total}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          <Link href={`/dashboard/orders/orders-details/${order.id}`}> {order.status} </Link>
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
