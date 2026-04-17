"use client"

import { useQuery } from "@tanstack/react-query"
import { getNotifications } from "@/actions/notifications"

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    // Optional: add staleTime to prevent refetching too often
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}