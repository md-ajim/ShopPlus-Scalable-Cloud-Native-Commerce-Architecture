import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import  { Separator} from '@/components/ui/separator'

export default function ProductShipping() {
  const shippingOptions = [
    {
      name: "Standard Shipping",
      price: "$4.99",
      time: "3-5 business days",
      freeThreshold: "Free on orders over $50",
    },
    {
      name: "Express Shipping",
      price: "$9.99",
      time: "1-2 business days",
      freeThreshold: "Free on orders over $100",
    },
    {
      name: "Overnight Shipping",
      price: "$19.99",
      time: "Next business day",
      freeThreshold: "Not eligible for free shipping",
    },
  ];

  const returnPolicy = {
    period: "30 days",
    conditions: [
      "Product must be unused and in original packaging",
      "Original receipt or proof of purchase required",
      "Some exclusions may apply",
    ],
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Shipping Options</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {shippingOptions.map((option, index) => (
            <div
              key={index}
              className="rounded-lg border p-6 hover:border-primary"
            >
              <h4 className="mb-2 font-medium">{option.name}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Price: {option.price}</div>
                <div>Delivery: {option.time}</div>
                <div>{option.freeThreshold}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Returns & Exchanges</h3>
        <div className="rounded-lg border p-6">
          <h4 className="mb-4 font-medium">
            {returnPolicy.period} Return Policy
          </h4>
          <ul className="space-y-2">
            {returnPolicy.conditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-4">
            Start a Return
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">International Shipping</h3>
        <div className="prose max-w-none text-muted-foreground">
          <p>
            We ship to most countries worldwide. International shipping rates
            and delivery times vary by destination. Additional customs and taxes
            may apply upon delivery.
          </p>
          <p className="mt-2">
            For more information about shipping to your country, please contact
            our customer service team.
          </p>
        </div>
      </div>
    </div>
  );
}