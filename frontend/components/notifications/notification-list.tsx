import { Notification } from "@/types"
import { NotificationItem } from "./notification-item"
import { EmptyState } from "./empty-state"

interface NotificationListProps {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  if (notifications.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}