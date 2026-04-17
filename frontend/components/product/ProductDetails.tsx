// components/product/ProductDetails.tsx
import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  console.log(product, "product");

  function getYouTubeId(url: string): string | null {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // Provide default values if undefined
  const features = product.features || [];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Product Description</h3>
        <p className="text-muted-foreground">
          {product.description} This classic denim jacket is crafted from
          premium quality denim fabric that gets better with age. Featuring a
          slim fit design, it&apos;s perfect for layering over t-shirts or sweaters.
          The vintage washed look gives it a timeless appeal that never goes out
          of style.
        </p>

        <h3 className="text-lg font-medium mt-6 mb-4">Key Features</h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>{feature.feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {product.video_url && getYouTubeId(product.video_url) && (
        <div>
          <h3 className="text-lg font-medium mb-4">Product Video</h3>
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${getYouTubeId(
                product.video_url
              )}`}
              title="How to Style a Denim Jacket"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            How to Style a Denim Jacket for Men: A Complete Guide with Outfit
            Ideas
          </p>
        </div>
      )}
    </div>
  );
}
