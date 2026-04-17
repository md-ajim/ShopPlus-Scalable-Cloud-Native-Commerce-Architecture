"use client"

import { 
  User,

  Heart,
  LogOut,

  Package,
  Bell,
  HelpCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { useEffect } from "react"
import { api} from "@/lib/axios";
import { useSession } from "next-auth/react"
import { SessionData } from "@/types/sessionType"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { UserType } from "@/types/address";

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
export function UserNav() {
  // const [balance, setBalance] = useState(1250.75) // Replace with your data fetching
 const router = useRouter()

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
    <div className="flex items-center gap-3">
      {/* Notification Badge */}
      {/* <Button variant="ghost" onClick={()=> router.push('/dashboard/notifications')} size="icon" className="relative  border rounded-full">
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
          3
        </span>
      </Button> */}

      {/* Currency Balance - Minimal */}
      {/* <Button variant="ghost" onClick={()=> router.push('/dashboard/balance')} className="hidden md:flex border items-center gap-1.5 rounded-full px-3 py-1.5  transition-colors">
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          ${balance.toFixed(2)}
        </span>
      </Button> */}
      
      {/* Profile Dropdown - Clean Design */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative rounded-full p-0 h-9 w-9">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback className="bg-transparent border">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 rounded-lg p-1 shadow-lg border" 
          align="end" 
          forceMount
        >
          {/* Profile Summary */}
          <DropdownMenuLabel className="px-2 py-3">
            <div className="flex items-center gap-3">
              <Avatar onClick={()=> router.push('/dashboard/account/settings')} className="h-10 w-10">
                <AvatarImage src="/avatars/01.png" alt="User" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentUser?.username} </p>
                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1" />

          {/* Quick Balance Overview */}
          {/* <div className="px-3 py-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Balance</span>
              <span className="font-medium">${balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-muted-foreground">Reward Points</span>
              <span className="font-medium">1,250</span>
            </div>
          </div> */}

          <DropdownMenuSeparator className="my-1" />

          {/* Navigation Groups */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="px-2 py-2 rounded">
              <Link href="/dashboard/account/settings" className="w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-2 py-2 rounded">
              <Link href="/dashboard/orders" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                <span>Orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-2 py-2 rounded">
              <Link href="/dashboard/wishlists" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                <span>Wishlist</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuGroup>

            <DropdownMenuItem asChild className="px-2 py-2 rounded">
              <Link href="/support" className="w-full">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help Center</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem className="px-2 py-2 rounded text-destructive focus:text-destructive" onClick={()=> signOut()} >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}