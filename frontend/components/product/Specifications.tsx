import { Product } from "@/types/product";

interface ProductSpecificationsProps {
  product: Product;
}

export default function Specifications({
  product,
}: ProductSpecificationsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
        <div className="space-y-4">
          {product.details.length > 0 &&
            Object.entries(product.details[0]).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium capitalize">{key}:</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Size Guide</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Size</th>
                <th className="text-left py-2">Chest (in)</th>
                <th className="text-left py-2">Length (in)</th>
                <th className="text-left py-2">Sleeve (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">S</td>
                <td className="py-2">36-38</td>
                <td className="py-2">26</td>
                <td className="py-2">24.5</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">M</td>
                <td className="py-2">38-40</td>
                <td className="py-2">27</td>
                <td className="py-2">25.5</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">L</td>
                <td className="py-2">40-42</td>
                <td className="py-2">28</td>
                <td className="py-2">26.5</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">XL</td>
                <td className="py-2">42-44</td>
                <td className="py-2">29</td>
                <td className="py-2">27.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
