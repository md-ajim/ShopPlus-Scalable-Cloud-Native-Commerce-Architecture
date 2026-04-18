
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { Review, ReviewStats } from "@/types/review";
import ProductDetails from "./ProductDetails";
import ProductReviews from "./ProductReviews";
import ProductFAQ from "./ProductFAQ";
import ProductShipping from "./ProductShipping";
import Specifications from "./Specifications";

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
  reviewStats: ReviewStats;
  className?: string;
  review_data:any;
}

export default function ProductTabs({
  product,
  reviews,
  reviewStats,
  review_data 

  
}: ProductTabsProps) {
  return (
    <Tabs>
      <TabsList className="md:grid md:w-full md:grid-cols-5 lg:grid-cols-5 ">
        <TabsTrigger
          value="details"
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Details
        </TabsTrigger>

        <TabsTrigger  className="data-[state=active]:border-b-2 data-[state=active]:border-primary" value="specifications">Specifications</TabsTrigger>

        <TabsTrigger
          value="reviews"
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Reviews
        </TabsTrigger>
        <TabsTrigger
          value="faq"
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          FAQ
        </TabsTrigger>
        <TabsTrigger
          value="shipping"
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Shipping
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="pt-8">
        <ProductDetails product={product} />
      </TabsContent>

      <TabsContent value="specifications" className="pt-8">
        <Specifications product={product} />
      </TabsContent>

      <TabsContent value="reviews" className="pt-8">
        <ProductReviews reviews={reviews} stats={reviewStats} product={product}  review_data ={review_data} />
      </TabsContent>

      <TabsContent value="faq" className="pt-8">
        <ProductFAQ product={product} />
      </TabsContent>

      <TabsContent value="shipping" className="pt-8">
        <ProductShipping />
      </TabsContent>
    </Tabs>
  );
}
