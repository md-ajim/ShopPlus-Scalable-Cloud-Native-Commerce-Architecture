"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
// ShadCN UI Components
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Icons
import {
  Heart,
  ShoppingCart,
  Flame,
  Eye,
  Filter,
  ListFilter,
  Search,
  Star,
  ChevronDown,
} from "lucide-react";

// Custom Components
import Navbar from "@/components/layout/navbar";
import FooterWithSitemap from "@/components/layout/footer";



export default function ProductListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    priceRange: null,
    minRating: null,
    sort: "created_at",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { session: data } = useSession();
  const productsPerPage = 8;

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: productsPerPage,
          search: filters.search || searchParams.get("search"),
          search_category:
            filters.categories && filters.categories.length > 0
              ? filters.categories.join(",")
              : searchParams.get("category"),

          min_price: filters.priceRange?.min,
          max_price: filters.priceRange?.max,
          min_rating: filters.minRating?.min,
          max_rating: filters.minRating?.max,
          
          ordering: filters.sort,
        };

        const response = await axios.get(
          "/api/product/",
          { params }
        ); 
        console.log(response, 'response')
        setProducts(response.data.results);
        setTotalPages(Math.ceil(response.data.count / productsPerPage));
      } catch (error) {
        toast.error("Failed to load products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, filters, searchParams]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Toggle category selection
  const toggleCategory = (category) => {
    router.push(
      `/category-sidebar?category=${
        (category,
        filters.categories.includes(category)
          ? filters.categories.filter((c) => c !== category).join("+")
          : [...filters.categories, category].join("+"))
      }`
    );

    setFilters((prev) => ({
      ...prev,
      categories: filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };



  // Price range options
  const priceRanges = [
    { label: "Under $50", value: { min: 0, max: 50 } },
    { label: "$50 - $100", value: { min: 50, max: 100 } },
    { label: "$100 - $200", value: { min: 100, max: 200 } },
    { label: "Over $200", value: { min: 200, max: null } },
  ];

  // Rating options
  const ratingOptions = [
    { label: "4+ Stars - 5 Stars", value: { min: 4, max: 6 }},
    { label: "3+ Stars - 4 Stars", value: { min: 3 , max : 4}},
    { label: "2+ Stars - 3 Stars", value:  {min : 2, max : 3}},
    { label: "0+ Stars - 2 Stars", value: { min :0, max : 2}},
  ];

  // Sort options
  const sortOptions = [
    { label: "Newest", value: "-created_at" },
    { label: "Price: Low to High", value: "price" },
    { label: "Price: High to Low", value: "-price" },
    { label: "Rating", value: "-rating" },
  ];


  

  return (
    <Suspense>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">All Products</h1>

            {/* Search and Filter Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Mobile Filters Button */}
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
                
              >
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className=" w-75">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <MobileFilters
                    filters={filters}
                    priceRanges={priceRanges}
                    ratingOptions={ratingOptions}
                    toggleCategory={toggleCategory}
                    handleFilterChange={handleFilterChange}
                  />
                </SheetContent>
              </Sheet>

              {/* Desktop Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden md:flex">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Sort
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup
                    value={filters.sort}
                    onValueChange={(value) => handleFilterChange("sort", value)}
                  >
                    {sortOptions.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid md:grid-cols-[250px_1fr] gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block space-y-6">
              <Suspense>
                <FilterSection title="Categories">
                  {["CLOTHES", "ELECTRONICS", "HOME", "BEAUTY", "SPORTS"].map(
                    (category) => (
                      <div key={category} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={`cat-${category}`}>{category}</Label>
                      </div>
                    )
                  )}
                </FilterSection>
              </Suspense>

              <Suspense>
                <FilterSection title="Price Range">

                  <Select
                    value={filters.priceRange?.label}
                    onValueChange={(value) => {
                      const range = priceRanges.find((r) => r.label === value);
                      handleFilterChange("priceRange", range?.value || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                </FilterSection>
              </Suspense>

              <FilterSection title="Rating">

              
                <Select
                  value={filters.minRating?.label}
                  onValueChange={(value) =>{

                   const rating = ratingOptions.find((r)=> r.label === value);

                    handleFilterChange("minRating",rating?.value  || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((option) => (
                      <SelectItem
                        key={option.label}
                        value={option.label}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSection>
            </aside>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your filters or search term
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <PaginationUI
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>

        <FooterWithSitemap />
      </div>
    </Suspense>
  );
}

// Mobile Filters Component
function MobileFilters({
  filters,
  priceRanges,
  ratingOptions,
  toggleCategory,
  handleFilterChange,
}) {
  return (
    <div className="space-y-6 ml-4 overflow-auto py-4 mt-4">
      <FilterSection title="Categories">
        {["CLOTHES", "Electronics", "Home", "Beauty", "SPORTS"].map(
          (category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`mob-cat-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`mob-cat-${category}`}>{category}</Label>
            </div>
          )
        )}
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.label} className="flex items-center gap-2">
              <Checkbox
                id={`mob-price-${range.label}`}
                checked={
                  filters.priceRange?.min === range.value.min &&
                  filters.priceRange?.max === range.value.max
                }


                onCheckedChange={() =>
                  handleFilterChange(
                    "priceRange",
                    filters.priceRange?.min === range.value.min
                      ? null
                      : range.value
                  )
                }


              />
              <Label htmlFor={`mob-price-${range.label}`}>{range.label}</Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <div key={option.label} className="flex items-center gap-2">
              <Checkbox
                id={`mob-rating-${option.label}`}
                checked={
                  filters.minRating?.min === option.value.min &&
                  filters.minRating?.min === option.value.min


                }


                onCheckedChange={() =>
                  handleFilterChange(
                    "minRating",
                    filters.minRating?.min === option.value.min ? null : option.value
                  )
                }


                
              />
              <Label htmlFor={`mob-rating-${option.value}`}>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);

  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartUser, setCartUser] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();





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





  const handleAddToCart = async () => {
    if (!session?.user?.id) {
      router.push("/form/login");
      return;
    }
    setIsAddingToCart(true);
    try {
      const image = await uploadImage(product?.image);
   
      const formData = new FormData();
      formData.append("cart", Number(cartUser?.id)); // fallback ID
      formData.append("product", product?.id);
      formData.append("color", product?.product?.default_color || "black");
      formData.append("size", product?.product?.default_size || "M");
      formData.append("image", product?.image);
      formData.append("quantity", quantity);
   

      if (session?.user?.id) {
        if (!cartUser) {
          const response = axios.post(`https://airfm9n2a7.execute-api.us-east-1.amazonaws.com/dev/api/cart/`, {
            user: session?.user?.id,
          });
          formData.append(
            "cart",
            Number(cartUser?.id) || (await response).data?.id
          ); // fallback ID
        }
        
        const res = await axios.post(
          `https://airfm9n2a7.execute-api.us-east-1.amazonaws.com/dev/api/api/cartItems/`,
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
    formData.append("quantity", quantity);


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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img
            src={product.image}
            alt={product?.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {product?.category.name && (
            <Badge className="absolute top-2 right-2">
              {product.category.name}
            </Badge>
          )}
        </div>
      </Link>
      {product?.discount_percentage ? (
        <Badge
          variant="destructive"
          className="absolute top-3 left-3 z-10 animate-pulse"
        >
          <Flame className="h-3 w-3 mr-1" />
          {product?.discount_percentage} OFF
        </Badge>
      ) : null}

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-2">
            <Link href={`/product/${product.id}/`} className="hover:underline">
              {product?.name}
            </Link>
          </h3>
          <div className="text-lg font-semibold">${product?.price}</div>
        </div>

        {/* Rating  */}
        <div className="flex   justify-between gap-1 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium">
              {product?.average_ratings}
            </span>
          </div>

          <div className="flex items-center gap-2 ">
            {product?.discount_percentage && (
              <span className="text-sm text-muted-foreground line-through">
                ${product?.discount_percentage}
              </span>
            )}
            {product.discount && (
              <Badge variant="secondary" className="text-xs">
                Save ${product?.discount}
              </Badge>
            )}
          </div>
        </div>

        {product.sold > 0 && (
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Sold: {product.sold}</span>
            <span>Available: {200 - product.sold}</span>
          </div>
        )}

        {/* Actions */}
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 h-9"
            />
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1"
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleWishlist (product)}
              disabled={isWishlistLoading}
            >
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/product/${product.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton Loader for Product Card
function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

// Reusable Filter Section Component
function FilterSection({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{title}</h3>
      {children}
    </div>
  );
}

// Custom Pagination Component
function PaginationUI({ currentPage, totalPages, onPageChange }) {




  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const page = i + 1;
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      {totalPages > 5 && (
        <>
          <span className="px-2">...</span>
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
