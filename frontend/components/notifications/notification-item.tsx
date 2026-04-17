"use client"

import { Notification } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <Card
      className={cn(
        "border-0 rounded-none shadow-none",
        !notification.read && "bg-blue-50/50"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">
            {notification.title}
          </CardTitle>
          <CardDescription className="text-xs">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </CardDescription>
        </div>
        {!notification.read && (
          <Badge variant="outline" className="h-5">
            New
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm">{notification.message}</p>
        {notification.actionUrl && (
          <Button variant="link" size="sm" className="px-0 mt-2 h-auto">
            View details
          </Button>
        )}
      </CardContent>
    </Card>
  )
}