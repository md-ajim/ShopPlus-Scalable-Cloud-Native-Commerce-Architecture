import { Product } from "@/types/product";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductFAQProps {
  product: Product;
}

export default function ProductFAQ({ product }: ProductFAQProps) {
  const faqs = [
    {
      question: "What materials are used in this product?",
      answer: product.materials || "Our product is made with high-quality, durable materials designed for longevity.",
    },
    {
      question: "How do I care for this product?",
      answer: product.care_instructions || "Follow the care instructions included with your purchase for best results.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused products in their original packaging.",
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Expedited options are available at checkout.",
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="rounded-lg bg-accent p-6">
        <h4 className="mb-4 font-medium">Still have questions?</h4>
        <p className="mb-4 text-muted-foreground">
          Our customer service team is happy to help with any other questions you
          might have.
        </p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </div>
  );
}