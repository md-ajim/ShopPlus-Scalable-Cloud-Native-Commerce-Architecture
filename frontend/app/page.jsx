"use client";

import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  ArrowRight, 
  Flame, 
  ShoppingBag, 
  Search, 
  Send, 
  Sparkles,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
// UI Components
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/navbar";
import FooterWithSitemap from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "./api/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  // --- STATE MANAGEMENT (PRESERVED) ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [outdoorProducts, setOutdoorProducts] = useState([]);
  const [electronicProducts, setElectronicProducts] = useState([]);
   
  // Form state
  const [formData, setFormData] = useState({
    itemNeeded: "",
    details: "",
    quantity: ""
  });

  // --- API FETCHING (PRESERVED) ---
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("/api/product/"),
          axios.get("/api/category/"),
        ]);

        setProducts(productsRes.data.results);
        
        // Logic preserved exactly as requested
        const outdoorProducts = productsRes.data.results.filter(product => product.search_categories === 'SPORTS' && product.discount_percentage == null).slice(0,4);
        const electronicProducts = productsRes.data.results.filter(product => product.search_categories === 'ELECTRONICS' && product.discount_percentage == null).slice(0,7);
        const specialsOffers = productsRes.data.results.filter(product => product.discount_start_date !== null);
        const categories =  categoriesRes.data.results.filter( category => category.name !== 'SPORTS' && category.name !== 'ELECTRONICS')
        setOutdoorProducts(outdoorProducts);
        setElectronicProducts(electronicProducts);
        setSpecials(specialsOffers);
        setCategories(categories);
      } catch (error) {
        toast.error("Error loading data. Please check your connection.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
     const res =  await axios.post("/api/requestquote/", {
        item_needed: formData.itemNeeded,
        details: formData.details,
        quantity: formData.quantity,
      });
      console.log(res.data, 'res');
      toast.success("Quote request sent successfully!");
      setFormData({ itemNeeded: "", details: "", quantity: "" });
    } catch (error) {
      console.log(error, 'error');
      toast.error("Failed to send quote request.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- HARDCODED CATEGORIES (PRESERVED) ---
  const categories_data = [
     { id: 1, name: "ALL", image : './', slug: "all" },
     { id: 2, name: "CLOTHES", slug: "clothes" },
     { id: 3, name: "FOOD", slug: "food" },
     { id: 4, name: "BEAUTY", slug: "beauty" },
     { id: 5, name: "SPORTS", slug: "sports" },
     { id: 6, name: "HOME", slug: "home" },
     { id: 7, name: "OUTDOOR", slug: "outdoor" },
     { id: 8, name: "ELECTRONICS", slug: "electronics" },
     { id: 9, name: "GADGETS", slug: "gadgets" },
     { id: 10, name: "BOOKS", slug : "books" },
  ];

  const mainCategories = categories_data.slice(0, 4);

  return (
    // ADDED: bg-white dark:bg-neutral-950 and text-handling
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1">
        
        {/* --- HERO SECTION (MODERNIZED) --- */}
        <section className="relative border-b border-neutral-200 dark:border-slate-700/10 overflow-hidden pt-12 pb-20 lg:pt-20">
          <div className="container px-4 mx-auto relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              // UPDATED: Light/Dark background classes
              className="bg-white dark:bg-black text-neutral-900 dark:text-white border border-neutral-100 dark:border-slate-700/10 rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative shadow-2xl"
            >
              {/* Abstract Background Shapes */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/50 dark:bg-purple-600/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <Badge variant="secondary" className="px-4 py-1 text-sm bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/20 border-0 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 mr-2 text-yellow-500 dark:text-yellow-400" /> New Collection 2026
                  </Badge>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                    Future of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                      Shopping
                    </span>
                  </h1>
                  <p className="text-lg text-neutral-600 dark:text-gray-300 max-w-lg leading-relaxed">
                    Discover cutting-edge electronics and lifestyle gear with our curated 2026 collection.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button asChild size="lg" className="rounded-full px-8 h-12 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-semibold text-base border-0">
                      <Link href="/category-sidebar">Explore Store</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 bg-transparent border-neutral-300 dark:border-gray-700 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 font-semibold text-base">
                      <Link href="/category-sidebar/?category=ELECTRONICS">View Gadgets</Link>
                    </Button>
                  </div>
                </div>
                
                {/* Hero Image / Graphic Area */}
                <div className="hidden lg:block relative h-[400px]">
                   <motion.div 
                     animate={{ y: [0, -20, 0] }}
                     transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                     className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl opacity-10 dark:opacity-20 rotate-3"
                   />
                   <div className="absolute inset-0 bg-[url('/bannar/bannar.png')] bg-cover bg-center rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

   
        {/* --- CATEGORIES SECTION --- */}

        <section className="py-16 container border-b border-neutral-200 dark:border-slate-700/10 px-4 mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Browse Categories</h2>
                <p className="text-neutral-500 dark:text-gray-400 mt-2">Explore our most popular collections</p>
              </div>
              <Button variant="ghost" asChild className="group hover:bg-neutral-100 dark:hover:bg-white/10">
                <Link href="/category-sidebar" className="text-blue-600 dark:text-primary font-semibold">
                  View All 
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {loading ? (
                 Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl bg-neutral-200 dark:bg-slate-800" />)
              ) : (
                categories.slice(0,2).map((category) => (
                  // variants={fadeIn} 
                  <motion.div key={category.id} className="h-64">
                    <Link href={`/category-sidebar/?category=${category?.name}`} className="block h-full">
                      <div className="group relative h-full w-full rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
           
                        <div className="absolute inset-0">
                           <img 
                             src={category.image} 
                             alt={category.name}
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           />
                        </div>
                        
             
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                        
                        
                        <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center justify-between">
                            <div>
                               <p className="text-xs font-bold text-white/80 tracking-widest uppercase mb-1">Collection</p>
                               <h3 className="text-xl font-bold text-white leading-tight">{category.name}</h3>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                               <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>

                  
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </section>

        
        {/* --- HOT DEALS (CAROUSEL) --- */}
        <section className="py-16 border-b border-neutral-200 dark:border-slate-700/10 overflow-hidden">
           <div className="container px-4 mx-auto">
             <div className="flex items-center gap-3 mb-8">
               <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/20">
                 <Flame className="w-6 h-6 text-orange-600 dark:text-orange-500 animate-pulse" />
               </div>
               <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Flash Deals</h2>
             </div>

             <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/4">
                      <Skeleton className="h-[350px] bg-neutral-200 dark:bg-slate-800 rounded-xl" />
                    </CarouselItem>
                  ))
                ) : (
                  specials.map((item) => (
                    <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                      <Link href={`/product/${item?.id}`}>
                        {/* UPDATED: Card background for light/dark */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-slate-700/10 p-4 h-full hover:shadow-lg dark:hover:bg-slate-700 transition-all duration-300 group">
                          <div className="relative aspect-square bg-white rounded-xl overflow-hidden mb-4 p-4">
                            <img src={item.image} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            {item.discount_percentage && (
                              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white border-0">
                                -{item.discount_percentage}%
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1 mb-1">{item.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-neutral-900 dark:text-white">${item.price}</span>
                            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-primary transition-colors">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-6">
                 {/* UPDATED: Buttons for light/dark */}
                 <CarouselPrevious className="static translate-y-0 bg-white dark:bg-transparent text-neutral-900 dark:text-white border-neutral-200 dark:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/10" />
                 <CarouselNext className="static translate-y-0 bg-white dark:bg-transparent text-neutral-900 dark:text-white border-neutral-200 dark:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/10" />
              </div>
            </Carousel>
           </div>
        </section>

        {/* --- DUAL SECTIONS (OUTDOOR & ELECTRONICS) --- */}
        <div className="container px-4 mx-auto py-20 space-y-20">
          
          {/* Outdoor Section */}
          <SectionHeader title="Sports & Outdoor" link="/category-sidebar/?category=SPORTS" />
          <div 
            // variants={staggerContainer}
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {loading ? <LoadingGrid count={4} /> : outdoorProducts.map(p => <ModernProductCard key={p.id} product={p} />)}
          </div>

          {/* Electronics Section */}
          <SectionHeader title="Electronics & Gadgets" link="/category-sidebar/?category=ELECTRONICS" />
          <div 
            // variants={staggerContainer}
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
             {loading ? <LoadingGrid count={4} /> : electronicProducts.map(p => <ModernProductCard key={p.id} product={p} />)}
          </div>

        </div>

        {/* --- REQUEST QUOTE (User Friendly Light/Dark) --- */}
        <section className="py-20 relative border-t border-b border-neutral-200 dark:border-slate-700/10 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-none opacity-20" />
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none" />

          <div className="container px-4 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                  <Zap className="w-4 h-4" /> B2B Services
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">Need a custom order?</h2>
                <p className="text-lg leading-relaxed max-w-md text-neutral-600 dark:text-neutral-300">
                  We specialize in bulk sourcing. Tell us what you need, and we'll scan our global network to find the best price for you within 24 hours.
                </p>
                <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"/> Competitive wholesale pricing</li>
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"/> Verified Global Suppliers</li>
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"/> Dedicated support agent</li>
                </ul>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* UPDATED: Glassmorphism that works in light & dark */}
                <Card className="shadow-2xl border-neutral-200 dark:border-white/10 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-md">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                          <Label className="text-neutral-900 dark:text-white">Product Name</Label>
                          <Input 
                            name="itemNeeded"
                            value={formData.itemNeeded}
                            onChange={handleInputChange}
                            placeholder="E.g. Wireless Noise Cancelling Headphones" 
                            className="bg-white dark:bg-white/5 border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/30 focus-visible:ring-indigo-500 h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-900 dark:text-white">Quantity</Label>
                          <Input 
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            placeholder="100" 
                            className="bg-white dark:bg-white/5 border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/30 focus-visible:ring-indigo-500 h-12"
                          />
                        </div>
                          <div className="space-y-2">
                          <Label className="text-neutral-900 dark:text-white">Timeline</Label>
                          <Input 
                            placeholder="ASAP" 
                            className="bg-white dark:bg-white/5 border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/30 focus-visible:ring-indigo-500 h-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                          <Label className="text-neutral-900 dark:text-white">Additional Details</Label>
                          <Textarea 
                            name="details"
                            value={formData.details}
                            onChange={handleInputChange}
                            placeholder="Specific colors, materials, or shipping requirements..."
                            className="bg-white dark:bg-white/5 border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/30 focus-visible:ring-indigo-500 min-h-[100px]"
                          />
                       </div>
                      <Button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold text-base transition-all">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Send className="w-4 h-4 mr-2"/>}
                        {loading ? "Sending Request..." : "Request Quote"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <FooterWithSitemap />
    </div>
  );
}

// --- SUB COMPONENTS FOR CLEANLINESS ---

function SectionHeader({ title, link }) {
  return (
    <div className="flex items-end justify-between mb-8 border-b border-neutral-200 dark:border-slate-800 pb-4">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h2>
      <Link href={link} className="flex items-center text-sm font-semibold text-blue-600 dark:text-primary hover:underline">
        View Collection <ArrowRight className="ml-1 w-4 h-4" />
      </Link>
    </div>
  );
}




const uploadImage = async (imageUrl, fileName = "image.jpg") => {
    // Call your own Next.js API instead of the external URL directly
    const response = await fetch('/api/proxy-image', {
        method: 'POST',
        body: JSON.stringify({ imageUrl }),
    });
    
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
};


function ModernProductCard({ product }) {
  // Mock function for add to cart to prevent navigation

  console.log(product, "product")
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [cartUser, setCartUser] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();


 useEffect(() => {
    const factCart = async () => {
      const response = axios.get(`/api/cart/`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const cartUser = (await response)?.data?.results.find(
        (cart) => cart.user === session?.user?.id
      );
      setCartUser(cartUser);
    };
    factCart();
  }, [session]);





  const handleAddToCart = async (product) => {
    if (!session?.user?.id) {
      router.push("/form/login");
      return;
    }
    setIsAddingToCart(true);
    try {

   
      const formData = new FormData();
      formData.append("cart", Number(cartUser?.id)); // fallback ID
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
        console.log(res, "res");
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
      setIsAddingToCart(false);
      // window.location.reload();
    }
  };




    const handleWishlist = async () => {
      // const image = await uploadImage(product?.image);
      const formData = new FormData();
      formData.append("cart", Number(cartUser?.id)); // fallback ID
      formData.append("product",product?.id);
      formData.append("name", product?.name);
      formData.append("color", product?.default_color || "black");
      formData.append("price", product?.price);
      formData.append("user", Number(session?.user?.id));
      formData.append("size", product?.product?.default_size || "M");
      formData.append("image", product?.image);
      formData.append("quantity", 1);
  
      console.log(formData, "wishlist_formData");
      setIsWishlistLoading(true);
      try {
        // Implement wishlist API call
        const response = axios.post(
          `/api/wishlist/`,
          formData
        );
        console.log(response, "wishlist_response");
        const data = (await response).data;
        if (data) {
          toast.success("Added to wishlist!");
        }
      } catch (error) {
        toast.error("Failed to update wishlist");
      } finally {
        setIsWishlistLoading(false);
      }
    };
  

  return (
    <motion.div variants={fadeIn} className="h-full">
      <Link href={`#`} className="group h-full block relative">
        <Card className="h-full border border-neutral-200 dark:border-slate-700/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl flex flex-col">
          
          {/* --- IMAGE SECTION --- */}
          <div className="relative aspect-[4/3] bg-gray-50 dark:bg-neutral-800 overflow-hidden p-4">
            {/* Discount Badge */}
            {product.discount_percentage && (
              <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                -{product.discount_percentage}%
              </div>
            )}

            {/* Wishlist Button (Top Right) - Always visible */}
            <button 
              onClick={()=> handleWishlist(product)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 text-neutral-600 dark:text-neutral-300 hover:text-red-500 hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>

            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500 ease-out" 
            />

            {/* Quick Action Overlay (Only View Button) */}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-black/90 dark:via-black/50">
               {/* Note: changed to div/span instead of Button to avoid nesting issues, styled as button */}
             <Link href={`/product/${product.id}`}>
               <span className="flex items-center justify-center w-full h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium shadow-lg cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                  <Eye className="w-4 h-4 mr-2" /> View Product
               </span>
             </Link>
            </div>
          </div>

          {/* --- CONTENT SECTION --- */}
          <CardContent className="p-4 flex-1 flex flex-col justify-between">
                 {/* Star Rating (Static/Mock for now) */}
            <div>
         
              {/* <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <Star className="w-3 h-3 text-neutral-300 dark:text-neutral-600" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">(4.0)</span>
              </div> */}


              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
                {product.title}
              </h3>
            </div>

            {/* Price & Add to Cart Row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  ${product.price}
                </span>
                {/* Optional: Show original price if discounted */}
                {product.discount_percentage && (
                   <span className="text-xs text-neutral-400 line-through">
                     ${(product.price * (1 + product.discount_percentage / 100)).toFixed(2)}
                   </span>
                )}
              </div>
              
              {/* Direct Add to Cart Button */}
              <Button 
                onClick={()=>handleAddToCart(product)}
                size="icon" 
                variant="secondary"
                className="rounded-full h-10 w-10 bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white dark:hover:bg-indigo-600 transition-colors"
                title="Add to Cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}






function LoadingGrid({ count }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="space-y-3">
      <Skeleton className="h-[250px] w-full rounded-2xl bg-neutral-200 dark:bg-slate-800" />
      <Skeleton className="h-4 w-2/3 bg-neutral-200 dark:bg-slate-800" />
      <Skeleton className="h-4 w-1/3 bg-neutral-200 dark:bg-slate-800" />
    </div>
  ));
}









