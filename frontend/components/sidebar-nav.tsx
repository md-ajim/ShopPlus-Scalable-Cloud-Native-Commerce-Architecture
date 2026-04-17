"use client" // Add this directive at the top

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-4 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent",
            pathname === item.href
              ? "bg-accent font-medium text-accent-foreground"
              : "text-muted-foreground",
            "justify-start rounded-md text-sm transition-colors"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}