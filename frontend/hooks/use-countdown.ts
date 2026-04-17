// hooks/use-countdown.ts
import { useState, useEffect } from "react"

export const useCountdown = (targetDate: string) => {
  const [countdown, setCountdown] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const end = new Date(targetDate)
      const diff = end.getTime() - now.getTime()

      if (diff <= 0) {
        clearInterval(interval)
        setCountdown("Expired")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return countdown
}