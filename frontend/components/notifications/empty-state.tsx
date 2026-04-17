import { BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <BellOff className="w-12 h-12 text-muted-foreground" />
      <h3 className="text-lg font-medium">No notifications yet</h3>
      <p className="text-sm text-muted-foreground">
        We&apos;ll notify you when something arrives.
      </p>
      <Button variant="outline">Refresh</Button>
    </div>
  )
}