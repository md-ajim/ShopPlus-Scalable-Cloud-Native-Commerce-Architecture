"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  Loader2,
  Plus,
  LayoutGrid
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

import { SessionData } from "@/types/sessionType";


// --- Types ---
interface WishlistItem {
  id: number;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: string;
  product : number
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [quantity, setQuantity] = useState(1);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartUser, setCartUser] = useState(null);
  const { data: session,  } = useSession() as { data: SessionData | null };
  const router = useRouter();


  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getWishlist = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/wishlistItems/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
        params: { page: currentPage, page_size: itemsPerPage }
      });
      setWishlist(response.data.results);
      setTotalItems(response.data.count);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlist();
  }, [session, currentPage]);

  // Framer Motion Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };



  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50 dark:bg-zinc-950">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-primary">Wishlist</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {totalItems} Items
          </Badge>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight">Your Favorites</h1>
              <p className="text-muted-foreground text-sm">
                Items you've saved for later. Prices and availability may change.
              </p>
            </div>

            {loading ? (
              <WishlistGridSkeleton />
            ) : wishlist.length > 0 ? (
              <>
                <motion.div
                  variants={containerVars}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {wishlist.map((item) => (
                      <WishlistCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination Section */}
                {totalPages > 1 && (
                  <div className="pt-8 pb-12">
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyWishlist />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// --- Sub-Components ---

function WishlistCard({ item }: { item: WishlistItem }) {


  const [quantity, setQuantity] = useState(1);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartUser, setCartUser] = useState(null);
  const { data: session,  } = useSession() as { data: SessionData | null };
  const router = useRouter();

  useEffect(() => {
    const factCart = async () => {
      const response = axios.get(`/api/cart/`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const cartUser = (await response)?.data?.results.find(
        (cart : any) => cart.user === session?.user?.id
      );
      setCartUser(cartUser);
    };
    factCart();
  }, [session]);


  const handleAddToCart = async (product: any) => {
    
    if (!session?.user?.id) {
      router.push("/form/login");
      return;
    }
    setIsLoading(true);
    try {
      // const image = await uploadImage(product?.image);

      const formData = new FormData();
      formData.append("cart", Number(cartUser?.id) || (cartUser?.id)); // fallback ID
      formData.append("product", product?.id);
      formData.append("color", product?.product?.default_color || "black");
      formData.append("size", product?.product?.default_size || "M");
      formData.append("image", product?.image);
      formData.append("quantity", 1);
      console.log(formData, 'form-data')

      if (session?.user?.id) {
        if (!cartUser) {
          const response = axios.post(`/api/cart/`, {
            user: session?.user?.id,
          });
          formData.append(
            "cart",
            Number(cartUser?.id) || (await response).data?.id
          ); // fallback ID
          console.log(response, 'cart response')
        }

        const res = await axios.post(
          `/api/cartItems/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.data) {
          toast.success("Added to cart!");
        }
      } else {
        router.push("form/login");
      }
    } catch (error) {
      console.log(error, "error");
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
      // window.location.reload();
    }
  };


const handelDeleteToWishlist = async ( id : number) =>{
 
  setIsLoading(true)
  try{
    const response = axios.delete(`/api/wishlist/${id}/`,{
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  })

 console.log(response, "response")
  if((await response).status === 204){
    toast.success("Removed from cart!");
  }else{
    toast.error("Failed to remove from cart!");
  }
  }
  catch(error){
    console.log(error, "error");
    toast.error("Failed to remove from cart!");
  }

  finally{
    setIsLoading(false)
  }

}

  


  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Card className="overflow-hidden border-none shadow-sm group-hover:shadow-xl transition-all duration-300 dark:bg-zinc-900">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-zinc-800">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button onClick={ () => handelDeleteToWishlist(item.id)} size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-destructive hover:text-white transition-colors">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Badge className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-black border-none dark:bg-zinc-900/90 dark:text-white">
            {item.price}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <div className="flex gap-2 text-xs text-muted-foreground uppercase tracking-wider">
              <span>{item.color}</span>
              <span>•</span>
              <span>Size: {item.size}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button onClick={() => router.push(`/product/${item?.product}`) } variant="outline" size="sm" className="rounded-full text-xs font-bold gap-2">
              Details
            </Button>
            <Button onClick={()=>  handleAddToCart(item) } size="sm" className="rounded-full text-xs font-bold gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-500">
              <ShoppingBag className="h-3 w-3" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center space-y-6"
    >
      <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
        <Heart className="h-12 w-12 text-slate-300 dark:text-zinc-700" strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
        <p className="text-muted-foreground max-w-xs mx-auto text-sm">
          Save items you love to keep an eye on them. Start browsing our latest collections!
        </p>
      </div>
      <Button asChild className="rounded-full px-8 py-6 text-lg shadow-lg">
        <a href="/category-sidebar">
          Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </Button>
    </motion.div>
  );
}

function WishlistGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[4/5] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-full rounded-full" />
              <Skeleton className="h-9 w-full rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PaginationComponent({ currentPage, totalPages, onPageChange }: any) {
  return (
    <Pagination>
      <PaginationContent className="bg-white dark:bg-zinc-900 border rounded-full px-2 py-1 shadow-sm">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            onClick={(e) => { e.preventDefault(); onPageChange(currentPage - 1); }}
          />
        </PaginationItem>

        {/* Simplified Page Logic for brevity */}
        <PaginationItem>
          <span className="text-sm font-medium px-4">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1); }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}