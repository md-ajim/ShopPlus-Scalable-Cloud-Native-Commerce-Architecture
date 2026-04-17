"use client";

import * as React from "react";
import {
  IconHome,

  IconHeart,
  IconHistory,
  IconSettings,
  IconCoin,
  IconHelp,
  IconCategory,

  IconBell,

} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { useEffect } from "react";
import { api} from "@/lib/axios";
import { UserType } from "@/types/address";
import { SessionData } from "@/types/sessionType";
import { useSession } from "next-auth/react";




const data = {
  user: {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/avatars/default.jpg",
    cartItems: 0,
    notifications: 0,
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Shop",
      url: "/category-sidebar",
      icon: IconCategory,
    },

    {
      title: "Wishlist",
      url: "/dashboard/wishlists",
      icon: IconHeart,
      badge: "",
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: IconHistory,
    },

  ],
  navAccount: [
    // {
    //   title: "Notifications",
    //   url: "/dashboard/notifications",
    //   icon: IconBell,
    //   badge: "",
    // },
   {
      title: "Account Settings",
      url: "/dashboard/account/settings",
      icon: IconSettings,
    },
  ],
  navSecondary: [
   
    {
      title: "Help Center",
      url: "/support",
      icon: IconHelp,
    },

    {
      title: "Referral Program",
      url: "/dashboard/referrals",
      icon: IconCoin,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [currentUser , setCurrentUser] = React.useState<UserType | null>(null)
  const { data: session} = useSession () as { data : SessionData | null}
  const [loading , setLoading] = React.useState(true)
  

  const getUser =  async ()=> {
      const { data }  =  await api.get(`/users/${session?.user.id}`)
      setCurrentUser(data)
      setLoading(false)
  }





  useEffect(()=>{
    if(session){
      getUser()
    }

  },[session])





  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">ShopLentic</span>
              </Link>
           
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />

        <div className="mt-4 border-t pt-4">
          <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
            My Account
          </h3>
          <NavMain items={data.navAccount} />

           {/* <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
            My Account
          </h3> */}
              <NavSecondary items={data.navSecondary} className="mt-auto" />
        </div>

    
      </SidebarContent>

      <SidebarFooter>
        <NavUser user = { currentUser } />
      </SidebarFooter>
    </Sidebar>
  );
}
