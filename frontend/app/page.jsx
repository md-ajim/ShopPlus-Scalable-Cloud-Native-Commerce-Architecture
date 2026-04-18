"use client";

import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Loader2, 
  ArrowRight, 
  Flame, 
  Search, 
  Send, 
  Sparkles,
  Zap,
  ShoppingCart, 
  Heart, 
  Star, 
  Eye 
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

// Modern Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function HomePage() {
  // --- STATE MANAGEMENT ---
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

  // --- API FETCHING (Unchanged) ---
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("/api/product/"),
          axios.get("/api/category/"),
        ]);

        setProducts(productsRes.data.results);
        
        const outdoorProducts = productsRes.data.results.filter(product => product.search_categories === 'SPORTS' && product.discount_percentage == null).slice(0,4);
        const electronicProducts = productsRes.data.results.filter(product => product.search_categories === 'ELECTRONICS' && product.discount_percentage == null).slice(0,7);
        const specialsOffers = productsRes.data.results.filter(product => product.discount_start_date !== null);
        const categories = categoriesRes.data.results.filter(category => category.name !== 'SPORTS' && category.name !== 'ELECTRONICS')
        
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
     const res = await axios.post("/api/requestquote/", {
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

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 selection:bg-indigo-500/30">
      <Navbar />
      
      <main className="flex-1">
        
        {/* --- HERO SECTION (Ultra Modern Clean) --- */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <div className="container px-4 mx-auto relative z-10 text-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8"
            >
              <motion.div variants={fadeUp}>
                <Badge variant="outline" className="px-5 py-2 rounded-full text-sm font-medium border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                  Redefining E-Commerce in 2026
                </Badge>
              </motion.div>
              
              <motion.div variants={fadeUp}>
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.05] text-neutral-900 dark:text-white">
                  Minimalist. <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-900 dark:from-neutral-500 dark:to-neutral-100">
                    Exceptionally Crafted.
                  </span>
                </h1>
              </motion.div>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl font-light">
                Discover our curated collection of cutting-edge electronics and lifestyle gear. Designed for the modern aesthetic.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-8 w-full sm:w-auto">
                <Button asChild size="lg" className="rounded-full px-10 h-14 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-base font-medium transition-all w-full sm:w-auto">
                  <Link href="/category-sidebar">Shop Collection</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-10 h-14 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white text-base font-medium transition-all w-full sm:w-auto bg-transparent">
                  <Link href="/category-sidebar/?category=ELECTRONICS">View Gadgets</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- CATEGORIES SECTION (Bento/Clean Grid) --- */}
        <section className="py-24 container px-4 mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <SectionHeader title="Shop by Category" subtitle="Curated collections for your lifestyle" link="/category-sidebar" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <LoadingGrid count={4} height="h-[380px]" />
              ) : (
                categories.slice(0, 4).map((category) => (
                  <motion.div key={category.id} variants={fadeUp}>
                    <Link href={`/category-sidebar/?category=${category?.name}`} className="group block">
                      <div className="relative h-[380px] w-full rounded-[2rem] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 transition-all duration-500">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                          <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                          <div className="flex items-center text-white/80 text-sm font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            Explore <ArrowRight className="ml-2 w-4 h-4" />
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
        <section className="py-24 bg-neutral-50/50 dark:bg-neutral-900/10 border-y border-neutral-200/50 dark:border-neutral-800/50">
           <div className="container px-4 mx-auto">
             <SectionHeader 
               title="Flash Deals" 
               subtitle="Limited time offers on premium items" 
               icon={<Flame className="w-6 h-6 text-orange-500" />} 
             />

             <Carousel className="w-full mt-10">
              <CarouselContent className="-ml-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/4">
                      <Skeleton className="h-[450px] bg-neutral-100 dark:bg-neutral-900 rounded-[2rem]" />
                    </CarouselItem>
                  ))
                ) : (
                  specials.map((item) => (
                    <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                      <ModernProductCard product={item} />
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-10">
                 <CarouselPrevious className="static translate-y-0 w-12 h-12 rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50" />
                 <CarouselNext className="static translate-y-0 w-12 h-12 rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50" />
              </div>
            </Carousel>
           </div>
        </section>

        {/* --- DUAL SECTIONS (OUTDOOR & ELECTRONICS) --- */}
        <div className="container px-4 mx-auto py-32 space-y-32">
          {/* Outdoor Section */}
          <div className="space-y-12">
            <SectionHeader title="Sports & Outdoor" subtitle="Gear up for your next adventure" link="/category-sidebar/?category=SPORTS" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? <LoadingGrid count={4} /> : outdoorProducts.map(p => <ModernProductCard key={p.id} product={p} />)}
            </div>
          </div>

          {/* Electronics Section */}
          <div className="space-y-12">
            <SectionHeader title="Tech & Gadgets" subtitle="The latest in electronic innovation" link="/category-sidebar/?category=ELECTRONICS" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {loading ? <LoadingGrid count={4} /> : electronicProducts.map(p => <ModernProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>

        {/* --- REQUEST QUOTE (Minimalist Form) --- */}
        <section className="py-32 relative border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-[#0a0a0a]">
          <div className="container px-4 mx-auto">
            <div className="max-w-6xl mx-auto bg-neutral-50 dark:bg-neutral-900/50 rounded-[3rem] p-8 md:p-16 lg:p-20 border border-neutral-200/50 dark:border-neutral-800/50">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <div className="space-y-8">
                  <Badge variant="outline" className="px-4 py-1.5 rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <Zap className="w-3.5 h-3.5 mr-2 text-indigo-500" /> 
                    B2B & Wholesale
                  </Badge>
                  <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
                    Custom orders, <br className="hidden lg:block"/> simplified.
                  </h2>
                  <p className="text-lg text-neutral-500 dark:text-neutral-400 font-light max-w-md">
                    Tell us exactly what you need. We tap into our global network to source premium products at the best rates, delivered fast.
                  </p>
                  
                  <ul className="space-y-4 pt-4">
                     {['Competitive B2B pricing', 'Verified global suppliers', 'Dedicated account manager'].map((item, i) => (
                       <li key={i} className="flex items-center text-neutral-600 dark:text-neutral-300 font-medium">
                         <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mr-4">
                           <div className="w-2 h-2 rounded-full bg-indigo-500" />
                         </div>
                         {item}
                       </li>
                     ))}
                  </ul>
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-0 shadow-2xl shadow-neutral-200/40 dark:shadow-none bg-white dark:bg-neutral-900 rounded-[2rem]">
                    <CardContent className="p-8 md:p-10">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wider font-semibold">Product Specification</Label>
                          <Input 
                            name="itemNeeded"
                            value={formData.itemNeeded}
                            onChange={handleInputChange}
                            placeholder="e.g., Ergonomic Office Chairs" 
                            className="border-neutral-200 dark:border-neutral-800 bg-transparent h-14 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-0"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wider font-semibold">Volume / Quantity</Label>
                            <Input 
                              name="quantity"
                              type="number"
                              value={formData.quantity}
                              onChange={handleInputChange}
                              placeholder="Min. 50 units" 
                              className="border-neutral-200 dark:border-neutral-800 bg-transparent h-14 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-0"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wider font-semibold">Target Timeline</Label>
                            <Input 
                              placeholder="e.g., Q3 2026" 
                              className="border-neutral-200 dark:border-neutral-800 bg-transparent h-14 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-0"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-600 dark:text-neutral-400 text-xs uppercase tracking-wider font-semibold">Project Details</Label>
                            <Textarea 
                              name="details"
                              value={formData.details}
                              onChange={handleInputChange}
                              placeholder="Describe materials, branding requirements, or shipping destinations..."
                              className="border-neutral-200 dark:border-neutral-800 bg-transparent min-h-[120px] rounded-xl resize-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-0"
                              required
                            />
                         </div>
                        <Button type="submit" disabled={loading} className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-medium text-base rounded-xl transition-all mt-4">
                          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : <Send className="w-4 h-4 mr-2"/>}
                          {loading ? "Processing..." : "Submit Inquiry"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <FooterWithSitemap />
    </div>
  );
}

// --- SUB COMPONENTS ---

function SectionHeader({ title, subtitle, link, icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h2>
        </div>
        {subtitle && <p className="text-neutral-500 dark:text-neutral-400 text-lg">{subtitle}</p>}
      </div>
      {link && (
        <Button variant="link" asChild className="p-0 h-auto text-neutral-900 dark:text-white font-medium hover:no-underline group">
          <Link href={link} className="inline-flex items-center">
            View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
    </div>
  );
}

function LoadingGrid({ count = 4, height = "h-[450px]" }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`w-full ${height} rounded-[2rem] bg-neutral-100 dark:bg-neutral-900`} />
      ))}
    </>
  );
}

// --- MODERN PRODUCT CARD ---
function ModernProductCard({ product }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [cartUser, setCartUser] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  // API Logics Unchanged
  useEffect(() => {
    const fetchCart = async () => {
      if(!session?.accessToken) return;
      try {
        const response = await axios.get(`/api/cart/`, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        });
        const foundCart = response?.data?.results?.find((cart) => cart.user === session?.user?.id);
        setCartUser(foundCart);
      } catch (error) {
        console.error("Cart fetch error:", error);
      }
    };
    fetchCart();
  }, [session]);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    if (!session?.user?.id) {
      router.push("/form/login");
      return;
    }
    
    setIsAddingToCart(true);
    try {
      const formData = new FormData();
      formData.append("cart", Number(cartUser?.id)); 
      formData.append("product", product?.id);
      formData.append("color", product?.product?.default_color || "black");
      formData.append("size", product?.product?.default_size || "M");
      formData.append("image", product?.image);
      formData.append("quantity", 1);

      if (!cartUser) {
        const response = await axios.post(`/api/cart/`, { user: session?.user?.id });
        formData.set("cart", Number(cartUser?.id) || response.data?.id);
      }
      
      const res = await axios.post(`/api/cartItems/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (res.data) toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async (e, product) => {
    e.preventDefault();
    if (!session?.user?.id) {
        router.push("/form/login");
        return;
    }

    setIsWishlistLoading(true);
    try {
      const formData = new FormData();
      formData.append("cart", Number(cartUser?.id));
      formData.append("product", product?.id);
      formData.append("name", product?.name || product?.title);
      formData.append("color", product?.default_color || "black");
      formData.append("price", product?.price);
      formData.append("user", Number(session?.user?.id));
      formData.append("size", product?.product?.default_size || "M");
      formData.append("image", product?.image);
      formData.append("quantity", 1);
  
      const response = await axios.post(`/api/wishlist/`, formData);
      if (response.data) toast.success("Saved to wishlist");
    } catch (error) {
      toast.error("Failed to add");
    } finally {
      setIsWishlistLoading(false);
    }
  };
  
  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link href={`/product/${product.id}`} className="group block h-full">
        <div className="h-full flex flex-col gap-4">
          
          {/* Minimalist Image Container */}
          <div className="relative aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 rounded-[2rem] overflow-hidden flex items-center justify-center p-8 transition-colors group-hover:bg-neutral-200/50 dark:group-hover:bg-neutral-800/50">
            
            {/* Minimal Discount Badge */}
            {product.discount_percentage && (
              <div className="absolute top-5 left-5 z-10 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                -{product.discount_percentage}%
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-5 right-5 z-20 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <button 
                onClick={(e) => handleWishlist(e, product)}
                disabled={isWishlistLoading}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:scale-105 shadow-sm transition-transform"
              >
                {isWishlistLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
              </button>
            </div>

            <img 
              src={product.image} 
              alt={product.title} 
              className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700 ease-[0.22,1,0.36,1]" 
            />
            
            {/* Quick Add To Cart Overlay Button */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
               <Button 
                 onClick={(e) => handleAddToCart(e, product)}
                 disabled={isAddingToCart}
                 className="w-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 text-neutral-900 dark:text-white backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl h-12 font-medium"
               >
                 {isAddingToCart ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
                 Add to Cart
               </Button>
            </div>
          </div>

          {/* Clean Typography Content */}
          <div className="px-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                 {product.search_categories || "Collection"}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-neutral-900 text-neutral-900 dark:fill-white dark:text-white" />
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">4.8</span>
              </div>
            </div>
            <h3 className="text-base font-medium text-neutral-900 dark:text-white leading-snug line-clamp-1 mb-1">
              {product.title}
            </h3>
            <div className="text-lg font-semibold text-neutral-900 dark:text-white">
              ${product.price}
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}