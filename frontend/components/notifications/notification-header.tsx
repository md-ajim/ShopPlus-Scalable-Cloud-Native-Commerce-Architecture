"use client"

import { Button } from "@/components/ui/button"
import { Bell, Check, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Notifications
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Mark all as read
          </DropdownMenuItem>
          <DropdownMenuItem>Notification settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}