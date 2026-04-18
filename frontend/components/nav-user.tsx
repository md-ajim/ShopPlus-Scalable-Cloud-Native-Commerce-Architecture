"use client"
import { signOut } from "next-auth/react"

import { useRouter } from "next/navigation"
import {

  IconHeart,
  IconHistory,
  IconLogout,

  IconSettings,
  IconShoppingCart,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user? : {
    name: string
    email: string
    username: string
    profile_pic?: string
    cartItems?: number
    notifications?: number
  }
}) {
  const { isMobile } = useSidebar()
  const router  = useRouter()

  console.log(user, 'user')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-accent/50 data-[state=open]:bg-accent"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={ user?.profile_pic || "https://www.pngaaa.com/detail/3043764"} alt={user?.username} />
                <AvatarFallback className="rounded-lg">
                  { user?.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.username}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              {user?.notifications ? (
                <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full p-0">
                  {user?.notifications }
                </Badge>
              ) : null}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={"/avatars/default.jpg"  } alt={user?.username} />
                  <AvatarFallback className="rounded-lg">
                    {user?.username && user?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.username && user?.username}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email && user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle onClick={()=> router.push('/dashboard/account/settings')} className="mr-2 size-4" />
                My Profile
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <IconShoppingCart className="mr-2 size-4" />
                My Cart
                {user && user.cartItems && user.cartItems ? (
                  <Badge variant="outline" className="ml-auto">
                    {user?.cartItems}
                  </Badge>
                ) : null}
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={()=> router.push('/dashboard/wishlists')}>
                <IconHeart className="mr-2 size-4" />
                Wishlist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=> router.push('/dashboard/orders')}>
                <IconHistory className="mr-2 size-4" />
                Order History
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
        
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
              <IconLogout className="mr-2 size-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}