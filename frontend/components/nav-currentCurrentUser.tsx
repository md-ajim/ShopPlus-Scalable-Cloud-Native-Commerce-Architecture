"use client"
import { signOut } from "next-auth/react"

import { useRouter } from "next/navigation"
import {

  IconHeart,
  IconHistory,
  IconLogout,

  IconSettings,
  IconShoppingCart,
  IconCurrentUserCircle,
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

export function NavCurrentUser({
  currentCurrentUser,
}: {
  currentCurrentUser? : {
    name: string
    email: string
    profile_pic?: string
    cartItems?: number
    notifications?: number
  }
}) {
  const { isMobile } = useSidebar()
  const router  = useRouter()

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
                <AvatarImage src={currentCurrentUser.avatar} alt={currentCurrentUser.name} />
                <AvatarFallback className="rounded-lg">
                  {currentCurrentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentCurrentUser.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {currentCurrentUser.email}
                </span>
              </div>
              {currentCurrentUser.notifications ? (
                <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full p-0">
                  {currentCurrentUser.notifications}
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
                  <AvatarImage src={currentCurrentUser.avatar} alt={currentCurrentUser.name} />
                  <AvatarFallback className="rounded-lg">
                    {currentCurrentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{currentCurrentUser.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {currentCurrentUser.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconCurrentUserCircle className="mr-2 size-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconShoppingCart className="mr-2 size-4" />
                My Cart
                {currentCurrentUser.cartItems ? (
                  <Badge variant="outline" className="ml-auto">
                    {currentCurrentUser.cartItems}
                  </Badge>
                ) : null}
              </DropdownMenuItem>
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
            <DropdownMenuGroup>
              {/* <DropdownMenuItem onClick={()=> router.push('/dashboard/account/addresses')}>
                <IconMapPin className="mr-2 size-4" />
                Saved Addresses
              </DropdownMenuItem > */}
              {/* <DropdownMenuItem onClick={()=> router.push('/dashboard/balance')} >
                <IconCreditCard className="mr-2 size-4" />
                Payment Methods
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={()=> router.push('/dashboard/account/settings')}>
                <IconSettings className="mr-2 size-4" />
                Account Settings
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