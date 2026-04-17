// "use client";
// import { Input } from "@/components/ui/input";
// import {
//   Sheet,
//   SheetContent,
//   SheetTitle,
//   SheetTrigger,
//   SheetHeader,
// } from "@/components/ui/sheet";
// import Image from "next/image";
// import * as React from "react";
// import { useState, useEffect } from "react";
// // import LanguageOption from "../shadcn-ui/language selector";
// import axios from "axios";
// import { cn } from "@/lib/utils";
// import { Search } from "lucide-react";

// import { Button } from "@/components/ui/button";
// // import NavbarWithMegaMenu from "@/components/shadcn-ui/Mega-Menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { signOut, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   ShoppingCart,
//   LayoutGrid,
//   ChevronDown,
//   User,
//   Package,
//   Minus,
//   Plus,
//   X,
//   Loader2,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";
// import { UserNav } from "./user-nav";
// import { Separator } from "@/components/ui/separator";

// // import { useCart } from "@/hooks/use-cart" // Assuming you have a cart context/hook

// export default function Navbar() {
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("ALL");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState([]);
//   const [error, setError] = useState(null);
//   const [updatingItems, setUpdatingItems] = useState({});
//   const { data: session, status } = useSession();


//   // Fetch cart items from API
//   const fetchCartItems = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/cartitem/");
//       console.log(response.data, "data");
//       // Process API response to combine duplicate products
//       const uniqueCartItems = response.data.reduce((acc, item) => {
//         const existingItem = acc.find((i) => i.product.id === item.product.id);
//         if (existingItem) {
//           existingItem.quantity += item.quantity;
//         } else {
//           acc.push({ ...item });
//         }
//         return acc;
//       }, []);

//       setCartItems(uniqueCartItems);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load cart items");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add item to cart
//   const addItem = async (productId, quantity = 1) => {
//     try {
//       setUpdatingItems((prev) => ({ ...prev, [productId]: true }));
//       await axios.post("/api/cartitem/", {
//         product: productId,
//         quantity,
//       });
//       await fetchCartItems(); // Refresh cart after adding
//     } catch (err) {
//       console.error("Error adding to cart:", err);
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
//     }
//   };

//   // Update item quantity
//   const updateItem = async (itemId, newQuantity) => {
//     try {
//       setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
//       await axios.patch(`/api/cartitem/${itemId}/`, {
//         quantity: newQuantity,
//       });
//       await fetchCartItems(); // Refresh cart after updating
//     } catch (err) {
//       console.error("Error updating cart item:", err);
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   // Remove item from cart
//   const removeItem = async (itemId) => {
//     try {
//       setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
//       await axios.delete(`/api/cartitem/${itemId}/`);
//       await fetchCartItems(); // Refresh cart after removing
//     } catch (err) {
//       console.error("Error removing from cart:", err);
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   // Clear entire cart
//   const clearCart = async () => {
//     try {
//       setLoading(true);
//       // Delete all items one by one (assuming your API doesn't support bulk delete)
//       await Promise.all(
//         cartItems.map((item) =>
//           axios.delete(`/api/cartitem/${item.id}/`)
//         )
//       );
//       setCartItems([]);
//     } catch (err) {
//       console.error("Error clearing cart:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate cart totals
//   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
//   const subtotal = cartItems.reduce(
//     (total, item) => total + parseFloat(item.product.price) * item.quantity,
//     0
//   );
//   const tax = subtotal * 0.08; // Example 8% tax
//   const total = subtotal + tax;

//   // Fetch cart items on component mount
//   useEffect(() => {
//    fetchCartItems();
//   }, []);

//   const handleCategoryChange = (category) => {
//     let change;

//     switch (category) {
//       case "All Categories":
//         change = "ALL";
//         break;
//       case "Clothes and Wear":
//         change = "CLOTHES";
//         break;
//       case "Home Interiors":
//         change = "HOME";
//         break;
//       case "Electronics":
//         change = "ELECTRONICS";
//         break;
//       case "Beauty & Health":
//         change = "BEAUTY";
//         break;
//       default:
//         change = "SPORTS"; // Default category
//     }

//     // return change; // Ensure the mapped value is returned
//     setSelectedCategory(change);
//   };

//   const getSearchProduct = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("/api/productimage/", {
//         params: {
//           category: "",
//           search: search,
//           search_category: selectedCategory,
//           min_price: "",
//           max_price: "",
//           min_rating: "",
//           max_rating: "",
//           rating: "",
//         },
//       });

//       setLoading(false);
//       return response.data.results; // ✅ Returning the search results
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setSearch(e.target.value);
//     // getSearchProduct();

//     // Just navigate to the category page with the search query
//     router.push(`/category-sidebar/?search=${search}`);
//   };
//   const CreateOrderItem = async () => {
//     setLoading(true);
 
//     const uid = () => {
//       const timestamp = Date().toString().slice(-5)
//       const randomNumber = Math.floor(Math.random() * 1000)
//       return 'ORD' + String( randomNumber).padStart( 4,'0')

//     }
//     try {
//       const response = await axios.post(`/api/api/order`, {
//         uniqId : uid(),
//         status: "processing",
//         total_price: total.toFixed(),
//         tax: tax.toFixed(),
//         shipping_cost: 5.99.toFixed(),
//         payment_status: false,
//         user: Number(session?.user?.id),
//       });

//       if (response.data) {
//         // router.push("/checkout/shipping");
//         return;
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//       router.push("/checkout/shipping");
//     }
//   };

//   return (
//     <>
//       <nav className="border-b   shadow-sm backdrop-filter backdrop-blur-lg hidden md:block top-0 left-0 right-0 p-3">
//         <div className="container px-4 mx-auto flex items-center gap-4">
//           <h1 className="text-xl font-bold mr-4">
//             <Link href="/">ShopLentic</Link>
//           </h1>

//           <div className="md:flex items-center gap-4 relative flex-1">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button className="shadow-none border" variant="ghost">
//                   <LayoutGrid size={20} /> {selectedCategory}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56">
//                 <DropdownMenuLabel>Select Category</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 {[
//                   "All Categories",
//                   "Clothes and Wear",
//                   "Home Interiors",
//                   "Electronics",
//                   "Beauty & Health",
//                   "Sports & Outdoors",
//                 ].map((category) => (
//                   <DropdownMenuItem
//                     key={category}
//                     onClick={() => handleCategoryChange(category)}
//                   >
//                     {category}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             <form
//               onSubmit={handleSearch}
//               className={cn(
//                 "relative flex w-full max-w-md items-center"
//                 // className
//               )}
//             >
//               <Input
//                 placeholder={`Search in ${selectedCategory}...`}
//                 value={search || ""}
//                 type="text"
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="h-10 rounded-lg pe-12 shadow-sm transition-all hover:shadow-md focus:shadow-lg"
//               />
//               <Button
//                 type="submit"
//                 size="icon"
//                 variant="ghost"
//                 className="absolute right-1 h-9 w-9  hover:bg-transparent"
//               >
//                 <Search className="h-4 w-4 text-muted-foreground" />
//               </Button>
//             </form>
//           </div>

//           <div className="flex items-center gap-4 ml-auto">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" className="relative px-3 border gap-2">
//                   <ShoppingCart className="h-5 w-5" />
//                   <span className="hidden lg:inline">Cart</span>
//                   {itemCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs h-5 w-5 rounded-full flex items-center justify-center">
//                       {itemCount}
//                     </span>
//                   )}
//                 </Button>
//               </SheetTrigger>

//               <SheetContent className="flex flex-col p-0 sm:max-w-lg">
//                 <SheetHeader className="border-b p-6">
//                   <SheetTitle className="text-2xl font-bold">
//                     Your Cart
//                   </SheetTitle>
//                 </SheetHeader>

//                 <div className="flex flex-col   h-[800px]">
//                   {/* Cart Items Section */}
//                   <div className="flex-1 overflow-auto p-6">
//                     {loading ? (
//                       <div className="space-y-4">
//                         {[...Array(3)].map((_, i) => (
//                           <div key={i} className="flex gap-4">
//                             <Skeleton className="h-20 w-20 rounded-lg" />
//                             <div className="flex-1 space-y-2">
//                               <Skeleton className="h-4 w-3/4" />
//                               <Skeleton className="h-4 w-1/2" />
//                               <Skeleton className="h-4 w-1/4" />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : error ? (
//                       <div className="flex flex-col items-center justify-center h-full text-destructive">
//                         <p className="text-lg">{error}</p>
//                         <Button
//                           variant="outline"
//                           className="mt-4"
//                           onClick={fetchCartItems}
//                         >
//                           Retry
//                         </Button>
//                       </div>
//                     ) : cartItems.length === 0 ? (
//                       <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                         <ShoppingCart className="h-12 w-12 mb-4" />
//                         <p className="text-lg">Your cart is empty</p>
//                         <p className="text-sm">Start shopping to add items</p>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="flex items-center justify-between mb-6">
//                           <h3 className="text-lg font-semibold">
//                             {itemCount} {itemCount === 1 ? "Item" : "Items"}
//                           </h3>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={clearCart}
//                             className="text-destructive hover:text-destructive"
//                             disabled={loading}
//                           >
//                             {loading ? (
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : (
//                               "Clear All"
//                             )}
//                           </Button>
//                         </div>

//                         <div className="space-y-6">
//                           {cartItems.map((item) => (
//                             <div key={item.id} className="flex gap-4">
//                               <div className="relative aspect-square h-20 w-20 min-w-fit overflow-hidden rounded-lg">
//                                 {item.product.image ? (
//                                   <Image
//                                     src={item.image}
//                                     alt={item.product.name}
//                                     width={100}
//                                     height={100}
//                                     className="object-cover"
//                                     unoptimized // Remove if you have proper image optimization setup
//                                   />
//                                 ) : (
//                                   <div className="bg-gray-100 h-full w-full flex items-center justify-center">
//                                     <ShoppingCart className="h-6 w-6 text-gray-400" />
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex flex-1 flex-col gap-1">
//                                 <div className="flex justify-between">
//                                   <h3 className="font-medium">
//                                     {item.product.name}
//                                   </h3>
//                                   <p className="font-medium">
//                                     $
//                                     {(
//                                       parseFloat(item.product.price) *
//                                       item.quantity
//                                     ).toFixed(2)}
//                                   </p>
//                                 </div>
//                                 <p className="text-sm text-muted-foreground">
//                                   ${parseFloat(item.product.price).toFixed(2)}{" "}
//                                   each
//                                 </p>
//                                 <div className="flex items-center justify-between text-sm">
//                                   <div className="flex items-center gap-3">
//                                     <Button
//                                       variant="outline"
//                                       size="icon"
//                                       className="h-6 w-6"
//                                       onClick={() =>
//                                         updateItem(item.id, item.quantity - 1)
//                                       }
//                                       disabled={
//                                         updatingItems[item.id] ||
//                                         item.quantity <= 1
//                                       }
//                                     >
//                                       {updatingItems[item.id] ? (
//                                         <Loader2 className="h-3 w-3 animate-spin" />
//                                       ) : (
//                                         <Minus className="h-3 w-3" />
//                                       )}
//                                     </Button>
//                                     <span>{item.quantity}</span>
//                                     <Button
//                                       variant="outline"
//                                       size="icon"
//                                       className="h-6 w-6"
//                                       onClick={() =>
//                                         updateItem(item.id, item.quantity + 1)
//                                       }
//                                       disabled={updatingItems[item.id]}
//                                     >
//                                       {updatingItems[item.id] ? (
//                                         <Loader2 className="h-3 w-3 animate-spin" />
//                                       ) : (
//                                         <Plus className="h-3 w-3" />
//                                       )}
//                                     </Button>

//                                     <Button
//                                       variant={"outline"}
//                                       className="h-6 "
//                                     >
//                                       <span> {item.size}</span>{" "}
//                                     </Button>
//                                     <Button
//                                       variant={"outline"}
//                                       className="h-6 "
//                                     >
//                                       {" "}
//                                       <span> {item.color}</span>
//                                     </Button>
//                                   </div>
//                                   <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     className="h-6 w-6 text-muted-foreground"
//                                     onClick={() => removeItem(item.id)}
//                                     disabled={updatingItems[item.id]}
//                                   >
//                                     {updatingItems[item.id] ? (
//                                       <Loader2 className="h-4 w-4 animate-spin" />
//                                     ) : (
//                                       <X className="h-4 w-4" />
//                                     )}
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {/* Checkout Section */}
//                   {!loading && !error && cartItems.length > 0 && (
//                     <div className="border-t p-6">
//                       <div className="space-y-3">
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">
//                             Subtotal
//                           </span>
//                           <span className="font-medium">
//                             ${subtotal.toFixed(2)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Tax</span>
//                           <span className="font-medium">${tax.toFixed(2)}</span>
//                         </div>
//                         <Separator />
//                         <div className="flex justify-between">
//                           <span className="text-lg font-bold">Total</span>
//                           <span className="text-lg font-bold">
//                             ${total.toFixed(2)}
//                           </span>
//                         </div>
//                         <Button
//                           size="lg"
//                           onClick={CreateOrderItem}
//                           className="w-full mt-4"
//                         >
//                           Proceed to Checkout
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>

//           {session ? (
//             <UserNav />
//           ) : (
//             <Button onClick={() => router.push("/form/login")}>
//               {" "}
//               Sing Up{" "}
//             </Button>
//           )}
//         </div>
//       </nav>
//     </>
//   );
// }



"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, LayoutGrid, Loader2, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Hooks & Types
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { UserNav } from "./user-nav";

const CATEGORIES = [
 "CLOTHES", "Electronics", "Home", "Beauty", "SPORTS"
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");
  
  const { items: cartItems, updateItem, removeItem, cartTotal, itemCount, createOrder, isLoading } = useCart();
  console.log(cartItems, 'cartItems')
  const { data: session } = useSession();
  const router = useRouter();

  // Calculations
  const taxAmount = cartTotal * 0.08;
  const grandTotal = cartTotal + taxAmount;
  const isCartEmpty = cartItems.length === 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/category-sidebar/?search=${searchQuery}&category=${selectedCategory}`);
  };

  const handleCheckout = async () => {
   const data = await createOrder();
    router.push("/checkout/shipping");
    console.log(data , 'data');
  };

  console.log(cartItems, 'cartItem')

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            ShopLentic
            </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl items-center gap-2 relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[180px] justify-between hidden lg:flex">
                        <span className="truncate">{selectedCategory}</span>
                        <LayoutGrid className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                    {CATEGORIES.map((cat) => (
                        <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
                            {cat}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <form onSubmit={handleSearch} className="flex-1 relative">
                <Input 
                    placeholder="Search for products..." 
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
            </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
            
            {/* --- CART SHEET START --- */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <motion.span 
                                key={itemCount}
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold"
                            >
                                {itemCount}
                            </motion.span>
                        )}
                    </Button>
                </SheetTrigger>
                
                {/* UPDATED SHEET CONTENT STRUCTURE:
                   h-[100dvh] ensures it fits mobile viewports perfectly.
                   flex-col allows us to stack Header, List, and Footer.
                */}
                <SheetContent className="w-full sm:max-w-md flex flex-col h-[100dvh] p-0 gap-0">
                    
                    {/* 1. Header (Fixed at top) */}
                    <SheetHeader className="px-6 py-4 border-b shrink-0">
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            Your Cart ({itemCount})
                        </SheetTitle>
                    </SheetHeader>
                    
                    {/* 2. Scrollable Content Area (Takes remaining space) */}
                    {/* flex-1 and min-h-0 are critical to force scrolling inside this div */}
                    <div className="flex-1 min-h-0 relative">
                        <ScrollArea className="h-full w-full">
                             <div className="px-6 py-4">
                                {isCartEmpty ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                        <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                                        <p>Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <AnimatePresence initial={false}>
                                            {cartItems.map((item) => (
                                                <motion.div 
                                                    layout
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                    key={item.id} 
                                                    className="flex gap-4 border-b pb-4 last:border-0"
                                                >
                                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                                                        {item.product.image && (
                                                            <img
                                                                src={item.product.image} alt={item.product.name}
                                                                className="object-cover" 
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                                                        <p className="text-sm font-bold text-primary">${parseFloat(item.product.price).toFixed(2)}</p>
                                                        
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="flex items-center border rounded-md h-7">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => updateItem(item.id, item.quantity - 1)}>-</Button>
                                                                <span className="text-xs w-8 text-center">{item.quantity}</span>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => updateItem(item.id, item.quantity + 1)}>+</Button>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* 3. Footer (Fixed at bottom) */}
                    {cartItems.length > 0 && (
                        <div className="border-t bg-background p-6 space-y-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>${taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span>${grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Proceed to Checkout
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
            {/* --- CART SHEET END --- */}

            {/* Auth Menu */}
            {session ? (
                // <DropdownMenu>
                //     <DropdownMenuTrigger asChild>
                //         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                //             <Avatar className="h-8 w-8">
                //                 <AvatarImage src={session.user?.image || ""} />
                //                 <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                //             </Avatar>
                //         </Button>
                //     </DropdownMenuTrigger>
                //     <DropdownMenuContent align="end">
                //          <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                //          <DropdownMenuItem onClick={() => router.push('/api/auth/signout')}>Log out</DropdownMenuItem>
                //     </DropdownMenuContent>
                // </DropdownMenu>
                <UserNav/>
            ) : (
                <Button size="sm" onClick={() => router.push("/form/login")}>Sign In</Button>
            )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                className="md:hidden border-b bg-background overflow-hidden"
            >
                <div className="p-4 space-y-4">
                     <form onSubmit={handleSearch}>
                        <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                     </form>
                     <div className="grid gap-2">
                        {CATEGORIES.map(cat => (
                            <Link key={cat} href={`/category-sidebar?category=${cat}`} className="text-sm font-medium py-2 border-b">
                                {cat}
                            </Link>
                        ))}
                     </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );    
}