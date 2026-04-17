import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  YoutubeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";

const footerSections = [
  {
    title: "Shop",
    links: [
      {
        title: "All Products",
        href: "/category-sidebar",
      },
      {
        title: "Home Page",
        href: "/",
      },
      {
        title: "Beauty Products",
        href: "/category-sidebar?category=BEAUTY",
      },
      {
        title: "Electronis Products",
        href: "/category-sidebar?category=ELECTRONICS",
      },
      // {
      //   title: "Gift Cards",
      //   href: "/gift-cards",
      // },
    ],
  },
  {
    title: "Customer Service",
    links: [
      {
        title: "Contact Us",
        href: "/contact",
      },
      {
        title: "FAQs",
        href: "/faq",
      },
      {
        title: "Shipping Info",
        href: "/shipping",
      },
      {
        title: "Returns & Exchanges",
        href: "/returns",
      },
      {
        title: "Size Guide",
        href: "/size-guide",
      },
    ],
  },
  // {
  //   title: "About Us",
  //   links: [
  //     {
  //       title: "Our Story",
  //       href: "/about",
  //     },
  //     {
  //       title: "Sustainability",
  //       href: "/sustainability",
  //     },
  //     {
  //       title: "Careers",
  //       href: "/careers",
  //     },
  //     {
  //       title: "Blog",
  //       href: "/blog",
  //     },
  //   ],
  // },
];

const Footer03Page = () => {
  return (
    <div className="flex flex-col">
      <div className="grow bg-muted" />
      <footer className="">
        <div className="max-w-screen-xl mx-auto">
          {/* Trust badges */}
          <div className="py-6 px-6 xl:px-0 flex flex-wrap items-center justify-center  gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>1-year warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Easy returns</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full xl:col-span-2">
              {/* Logo */}
              <div className="text-2xl font-bold">ShopLentic</div>
              <p className="mt-4 text-muted-foreground">
                Your one-stop shop for quality products at affordable prices. 
                We&apos;re committed to providing exceptional customer service and 
                a seamless shopping experience.
              </p>
            </div>
            
            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h6 className="font-semibold">{title}</h6>
                <ul className="mt-6 space-y-4">
                  {links.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Newsletter */}
            <div className="col-span-2">
              <h6 className="font-semibold">Join Our Newsletter</h6>
              <p className="mt-2 text-muted-foreground text-sm">
                Get 10% off your first order and updates on new arrivals
              </p>
              <form className="mt-6 flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="grow max-w-64"
                />
                <Button>Subscribe</Button>
              </form>
            </div>
          </div>
          
          <Separator />
          
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" className="hover:text-foreground">
  ShopLentic
              </Link>
              . All rights reserved.
            </span>
            
            <div className="flex items-center gap-5 text-muted-foreground">
              <Link href="#" target="_blank" className="hover:text-foreground">
                <FacebookIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank" className="hover:text-foreground">
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank" className="hover:text-foreground">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank" className="hover:text-foreground">
                <YoutubeIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer03Page;