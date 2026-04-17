"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Package, 
  Tag, 
  Info, 
  CheckCheck, 
  Clock, 
  MoreVertical,
  Trash2,
  ShoppingBag
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types based on Django/FCM Data Structure ---
type NotificationType = "order" | "promo" | "system" | "alert";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string from Django
  isRead: boolean;
  image?: string; // Optional product image or icon
  actionUrl?: string; // Deep link from FCM data payload
}

// --- Mock Data (Replace with API call to Django DRF) ---
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Order Shipped!",
    message: "Your order #12345 has been shipped and is on its way.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
  },
  {
    id: "2",
    type: "promo",
    title: "Flash Sale: 50% Off",
    message: "Get 50% off on all electronics for the next 2 hours only!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
  },
  {
    id: "3",
    type: "system",
    title: "Security Alert",
    message: "A new login was detected from a device in Barisal, Bangladesh.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
  },
  {
    id: "4",
    type: "order",
    title: "Order Delivered",
    message: "Package #98765 was left at your front door.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
  },
];

// --- Helper Components ---

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "order": return <Package className="h-5 w-5 text-blue-500" />;
    case "promo": return <Tag className="h-5 w-5 text-purple-500" />;
    case "alert": return <Info className="h-5 w-5 text-red-500" />;
    default: return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const NotificationItem = ({ 
  notification, 
  onMarkRead, 
  onDelete 
}: { 
  notification: Notification; 
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "group relative flex gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors",
        !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : "bg-card"
      )}
    >
      {/* Icon Wrapper */}
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border shadow-sm",
        !notification.isRead && "ring-2 ring-blue-500 ring-offset-2 ring-offset-card"
      )}>
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <p className={cn("text-sm font-medium leading-none", !notification.isRead && "font-bold text-foreground")}>
            {notification.title}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
        {!notification.isRead && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-blue-500" 
            onClick={() => onMarkRead(notification.id)}
            title="Mark as read"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="sr-only">Mark as read</span>
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onMarkRead(notification.id)}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark as read
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(notification.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  // Handlers
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    // TODO: Send batch update to Django Backend
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => 
      prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
    );
    // TODO: Send PATCH request to `/api/notifications/${id}/`
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // TODO: Send DELETE request
  };

  // Filter Logic
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.isRead;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-muted/20 p-4 ">
      <div className=" space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              You have {unreadCount} unread messages
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        </div>

        {/* Tabs & Content */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-1.5 w-1.5 rounded-full p-0" />
              )}
            </TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="promo">Offers</TabsTrigger>
          </TabsList>

          <div className="mt-4 rounded-xl border bg-card shadow-sm overflow-hidden">
            <ScrollArea className="h-[600px]">
              <div className="flex flex-col">
                <AnimatePresence initial={false} mode="popLayout">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={handleMarkRead}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground"
                    >
                      <div className="bg-muted p-4 rounded-full mb-4">
                        <ShoppingBag className="h-8 w-8 opacity-50" />
                      </div>
                      <p>No notifications found.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </Tabs>

      </div>
    </div>
  );
}