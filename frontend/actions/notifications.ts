"use server"

import { Notification } from "@/types"

export async function getNotifications(): Promise<Notification[]> {
  // In a real app, you would fetch from your database/API
  return [
    {
      id: 1,
      title: "Order Shipped",
      message: "Your order #12345 has been shipped and is on its way to you.",
      read: false,
      type: "order",
      actionUrl: "/orders/12345",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    {
      id: 2,
      title: "Summer Sale",
      message: "Get 20% off on all summer collections. Limited time offer!",
      read: true,
      type: "promotion",
      actionUrl: "/summer-sale",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 3,
      title: "Order Delivered",
      message: "Your order #12345 has been successfully delivered.",
      read: true,
      type: "order",
      actionUrl: "/orders/12345",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
  ]
}

export async function markAsRead(notificationId: number) {
  // Implement logic to mark notification as read in your database
}

export async function markAllAsRead() {
  // Implement logic to mark all notifications as read
}