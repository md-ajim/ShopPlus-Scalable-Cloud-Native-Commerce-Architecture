"use client"
import { Badge } from "@/components/ui/badge"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Icon } from "@tabler/icons-react"
import { useRouter } from 'next/navigation'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    badge?: string
  }[]
}) {

const router = useRouter()


  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                onClick={() => router.push(item.url) }
                className="hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <div className="relative">
                      <item.icon className="size-5" />
                      {item.badge && (
                        <Badge 
                          variant="secondary"
                          className="absolute -right-2 -top-2 size-5 rounded-full p-0 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      
      </SidebarGroupContent>
    </SidebarGroup>
  )
}