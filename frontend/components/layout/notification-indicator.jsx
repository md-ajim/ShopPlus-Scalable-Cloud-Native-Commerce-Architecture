"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NotificationList } from "../notifications/notification-list"
import { useEffect, useState } from "react"
import { getNotifications } from "@/actions/notifications"

export function NotificationIndicator() {
  const [notifications, setNotifications] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true)
      try {
        const data = await getNotifications()
        setNotifications(data)
      } catch (error) {
        console.error("Failed to load notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const unreadCount = notifications?.filter(n => !n.read).length || 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : (
            <NotificationList notifications={notifications} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}