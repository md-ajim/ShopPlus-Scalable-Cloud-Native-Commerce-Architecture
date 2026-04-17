"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from 'next/link'
import { Separator } from "@/components/ui/separator";

import {
  Copy,
  Heart,
  Share2,
  ShoppingCart,
  ShieldCheck,
  Percent,
  Truck,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import ProductTabs from "@/components/product/ProductTabs";
import { reviews, reviewStats ,  } from "@/data/reviews";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,

} from "@/components/ui/carousel";
import {  useReview  } from "@/data/reviews";


import Navbar from "@/components/layout/navbar";
import FooterWithSitemap from "@/components/layout/footer";

const OFFERS = [
  "Get 10% off on your first purchase",
  "Buy 2 and get 20% off on the second item",
  "Free shipping on orders above $150",
];

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProduct , setRelatedProduct] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const router = useRouter();


  
const review_data = useReview()



  const  id  = useParams();

  useEffect(() => {
    if (!id.slug) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const [ ProductVariantData , ProductData ] = await Promise.all([
          axios.get("/api/productvariant/"),
          axios.get( "/api/product/")
        ]) 

    
      
        const productData = ProductVariantData?.data?.results.find(
          (item) => item.product.id === Number(id.slug)
        );
          const RelatedData = ProductData?.data?.results.filter((item) => item?.search_categories===productData?.product?.search_categories) 
          const relatedProducts = RelatedData.filter((item)=> item.id !== productData?.product?.id )
          setRelatedProduct(relatedProducts)   
        if (productData) {
          setProduct(productData.product);
          setVariants(productData.quality);
          
        }
  
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id.slug]);





  const handleQuantityChange = (value) => {
    if (value < 1) return;
    setQuantity(value);
  };

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


const useCart = () => {
  const [cartUser, setCartUser] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchCart = async () => {
      try {
        const { data } = await axios.get("/api/cart/", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const foundCart = data.results.find(
          (cart) => cart.user === session.user.id
        );
        setCartUser(foundCart);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [session]);

  return { cartUser, session };
};

  const { cartUser, session } = useCart();







  const handleAddToCart = async () => {
    if (!session?.user?.id) {
    router.push("/form/login");
    return;
  }
    setCartLoading(true);
    const selected = variants.find(
      (_, index) => index === selectedImageIndex
    );

    console.log(selected.image, "selected image")
    const imageFile = await uploadImage(selected.image);

    const formData = new FormData();
    formData.append("cart", cartUser?.id);
    formData.append("product", String(product?.id ?? ""));
    formData.append("color", selected?.color);
    formData.append('size', selected?.size);
    formData.append("image",selected?.image);
    formData.append("quantity", String(quantity));



    try {
       
        if (!cartUser) {
          const response = await axios.post("/api/cart/", {
               user: session.user.id,
             });

             formData.append('cart', response?.data?.id)
          }
      const response = await axios.post(
        `/api/cartItems/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Added to cart successfully!", {
          description: `${product?.name} has been added to your cart`,
        });
      }
    } catch (error) {
      console.error("Add to Cart Error:", error);
      toast.error("Failed to add to cart", {
        description: error.response?.data?.message || "Please try again later",
      });
    } finally {
      setCartLoading(false);
      // window.location.reload()
    }
  };


const handleWishlist = async () => {
  setWishlistLoading(true);

  // ... (Your existing FormData construction logic remains the same) ...
  // const imageFile = await urlToFile(variants[selectedImageIndex].image);
  const formData = new FormData();
  formData.append("user", String(session.user.id));
  formData.append("name", product?.name);
  formData.append("price", product?.price);
  formData.append("quantity", String(quantity));
  formData.append("size", selectedSize);
  formData.append("color", variants[selectedImageIndex].color);
  formData.append("image", variants[selectedImageIndex].image);
  formData.append("product", (product?.id ?? ""));

  try {
    // CORRECTED: Pass formData directly, not inside { }
    const response = await axios.post(`/api/wishlist/`, formData, {
        headers: {
            // Optional: Axios usually sets this automatically for FormData, 
            // but explicit is safe.
            "Content-Type": "multipart/form-data", 
        }
    });
    
    console.log(response.data, 'data');
     
    if (response.status === 201) {
      toast.success("Added to wishlist!", {
        description: `${product?.name} has been saved to your wishlist`,
      });
    }
  } catch (error) {

    toast.error("Failed to add to wishlist", {
      description: error.response?.data?.message || "Please try again later",
    });
  } finally {
    setWishlistLoading(false);
  }
};


  if (isLoading) {
    return (
      <>
        <Navbar />
        <ProductSkeleton />
        <FooterWithSitemap />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container h-screen py-12 text-center items-center justify-center flex flex-col">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <p className="text-muted-foreground mt-2">
              The product you're looking for doesn't exist or may have been
              removed.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <FooterWithSitemap />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground mb-6">
          <span className="hover:text-primary cursor-pointer"> { product.search_categories} </span> /
  
          <span className="text-foreground"> { product.title} </span>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Gallery */}
          <ProductGallery
            variants={variants}
            selectedImageIndex={selectedImageIndex}
            onSelectImage={setSelectedImageIndex}
           
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                New Arrival
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="mt-3 text-muted-foreground">
                {product.description || "Premium quality product"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold">${product.price}</p>
              {product.originalPrice && (
                <>
                  <p className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </p>
                  <Badge variant="destructive" className="text-sm">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )}
                    % OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Offers */}
            <div className="rounded-lg border bg-accent/50 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Percent className="h-5 w-5" />
                <h3 className="font-semibold">Special Offers</h3>
              </div>
              <ul className="mt-2 space-y-1.5 pl-7 text-sm [&>li]:marker:text-primary">
                {OFFERS.map((offer, i) => (
                  <li key={i}>{offer}</li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Color Selection */}
            <div>
              <Label className="mb-3 block text-base">Color</Label>
              <div className="flex gap-3">
                {variants.map((variant, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className={`h-12 w-12 rounded-full p-1 ${
                            selectedImageIndex === index
                              ? "ring-2 ring-primary ring-offset-2"
                              : ""
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={variant.image}
                            alt={`${variant.color} variant`}
                            className="rounded-full h-full w-full object-cover"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{variant.color || variant.custom_color } </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <Label className="mb-3 block">Size</Label>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <Button
                    key={`${variant.id}-${variant.size}`}
                    variant={
                      selectedSize === variant.size ? "default" : "outline"
                    }
                    onClick={() => setSelectedSize(variant.size)}
                    className="min-w-[60px]"
                  >
                    {variant.size || variant.custom_size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <Label className="mb-2 block">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  min="1"
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                className="h-12 text-lg "
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {cartLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-14  size-12"
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  {wishlistLoading ? "Saving..." : "Wishlist"}
                </Button>
                <ShareDialog productName={product.name} />
              </div>
            </div>

            {/* Product Policies */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">
                    On orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <RefreshCw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">
                    100% protected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Warranty</p>
                  <p className="text-xs text-muted-foreground">
                    1-year coverage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <ProductTabs
            product={product}
            reviews={reviews}
            reviewStats={reviewStats}
            review_data = {review_data}


          />
   
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProduct.map((item , index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-muted">
               <Link href={`/product/${item.id}`} >  <img src={item.image} alt={item.name} className="object-cover w-full h-full" /> </Link>
                </div>
                <div className="p-4">
                  <Link href={`/product/${item.id}`}> <h3 className="font-medium">Related Product {item.name}</h3></Link>
                 <Link href={`/product/${item.id}`}>  <p className="text-muted-foreground text-sm">${item.price}</p></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterWithSitemap />
    </>
  );
}


// Updated Product Gallery Component
function ProductGallery({ variants, selectedImageIndex, onSelectImage }) {
  const [ api , setApi] = useState(null)
  useEffect(()=>{
    if(api){
      api.on("select",() => {
          onSelectImage(api.selectedScrollSnap())
      })
    }
  },[api])


  
  return (
    <div className="space-y-4">
      {/* Main Image Carousel */}
      <Carousel className="w-full"  setApi={setApi}>
        <CarouselContent>
          {variants.map((variant, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={variants[selectedImageIndex].image || variant.image }
                  alt={`Product image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                {index === 0 && (
                  <Badge variant="secondary" className="absolute top-4 left-4">
                    New
                  </Badge>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
    
        <CarouselNext className="right-4"     />
        <CarouselPrevious className="left-4"  />
     
   
  
    
        
      </Carousel>

      {/* Thumbnail Navigation */}
      <div className="grid grid-cols-4 gap-2">
        {variants.map((variant, index) => (
          <button
            key={index}
            onClick={() => onSelectImage(index)}
            className={`aspect-square overflow-hidden rounded-lg border-2 ${
              selectedImageIndex === index
                ? "border-primary"
                : "border-transparent"
            }`}
          >
            <img
              src={variant.image}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Share Dialog Component
function ShareDialog({ productName }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `/api/products/${productName
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1  size-12">
          <Share2 className="mr-2 h-5 w-5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {productName}</DialogTitle>
          <DialogDescription>
            Share this product with friends and family
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 py-4">
          <Input
            value={`http://13.60.44.216:3000/products/${productName
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            readOnly
          />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center gap-4 py-4">
          {/* Social Share Buttons */}
          <Button variant="outline" size="icon">
            <span className="sr-only">Facebook</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">Twitter</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">Instagram</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Skeleton Loader
function ProductSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16 ml-2" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-8 w-32" />

          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}