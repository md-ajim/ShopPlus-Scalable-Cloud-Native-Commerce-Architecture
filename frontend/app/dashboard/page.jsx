"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import  { useSession } from "next-auth/react";
import { useEffect , useState} from "react";
import Navbar from '@/components/layout/navbar'

import { BellIcon, ShoppingBagIcon, CreditCardIcon, Heart } from "lucide-react";
import axios from "axios";
import { setDate } from "date-fns";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [ orders , setOrders] = useState(null)
  const [recentOrders , setRecentOrders] = useState(null) 
  const [wishlist, setWishlist] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

const { data: session } = useSession();

useEffect(() => {
  setLoading(true);
  if( session){
    axios.get(`/api/users/${session?.user?.id}/`,{

       headers: {
         Authorization: `Bearer ${session?.accessToken}`,
       }
    }).then((response) => {
      setUser(response.data);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setLoading(false);
    })
  }


  const facetOrder = async () =>{
    try {
      const response = await axios.get('/api/order/')
       const data = response?.data?.results
       if( data){
          setOrders(data)
      let arr = []
      setRecentOrders(arr)
     
      function convertDate (timeDate){
        let date = new Date(timeDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart('0',2)
        const day = String( date.getDate()).padStart('0',2)
        const hours = String(date.getHours()).padStart('0',2)
        const minutes = String(date.getMinutes()).padStart('0',1)
        const seconds = String(date.getSeconds()).padStart('0',1)
        return `Date-${year}-${month}-${day} Time-${hours} : ${minutes}: ${seconds}`
      }
        data.forEach(( item) => (
        arr.push({
          id: `#${item.uniqId}`,
          date : convertDate(item.created_at),
          total : item.total_price,
          status : item.status
        })
      ))
       }
    }catch(error){
      console.error(`message is error${error}`)
    }
    
  }

  facetOrder()

    const getWishlist = async () => {
      if (!session?.accessToken) return;
      setLoading(true);
  
      try {
        const response = await axios.get(`/api/api/wishlistItems/`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
  
        setWishlist(response.data.results); // Assuming Django returns 'results' for paginated data
        setTotalItems(response.data.count); // Total count of items
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist");
        setLoading(false);
      }
    };
  
getWishlist()

}, [session]);



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
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <UserDashboard user={user} orders={orders}  recentOrders={ recentOrders}  wishlist={wishlist} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
const UserDashboard = ( { user , orders , recentOrders , wishlist  }) => {

  const sum =  orders?.reduce((acc , item ) => acc = parseInt(item.total_price) + parseFloat(item.total_price),0)
  const userStats = [
    { title: "Total Orders", value: orders?.length, icon: ShoppingBagIcon },
    { title: "Total Spent", 
      value: sum?.toFixed(2), icon: CreditCardIcon },
    { title: "Wishlist Items", value: wishlist?.length, icon: Heart },
  ];


  const recentProducts = [
    {
      name: "Wireless Headphones",
      price: "$199.99",
      category: "Electronics",
      image: "/images/headphones.jpg",
    },
    {
      name: "Leather Wallet",
      price: "$59.99",
      category: "Fashion",
      image: "/images/Gaming Set.webp",
    },
    {
      name: "Smart Watch",
      price: "$299.99",
      category: "Wearables",
      image: "/images/Home Appliance1.jpg",
    },
  ];

  function convertDate (timeDate){
        let date = new Date(timeDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart('0',2)
        const day = String( date.getDate()).padStart('0',2)
        const hours = String(date.getHours()).padStart('0',2)
        const minutes = String(date.getMinutes()).padStart('0',1)
        const seconds = String(date.getSeconds()).padStart('0',1)
        return `Date-${year}-${month}-${day} Time-${hours} : ${minutes}: ${seconds}`
      }

const joinDate = convertDate(user?.date_joined)


  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback> {user?.username.substring(0, 2)} </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, { user?.username }!</h1>
            <p className="text-gray-500 text-sm">
              Your latest dashboard overview
            </p>
          </div>
        </div>
        <Button variant="outline">
          <BellIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 rounded-lg">
        {userStats?.map((stat, index) => (
          <Card key={index} className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{stat.title}</CardTitle>
              <stat.icon className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="mb-6 rounded-lg">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      color={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Processing"
                          ? "warning"
                          : "blue"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Products & Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg">

        <Card>
          <CardHeader>
            <CardTitle>Recently Viewed Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-md"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <span className="text-gray-900 font-medium">
                  {product.price}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-900">{  user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined:</span>
              <span className="text-gray-900">{joinDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address:</span>
              <span className="text-gray-900">{ orders?.[0]?.shipping_address[0]?.address} </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );


};

