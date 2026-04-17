import { CreditCard, Banknote, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddPaymentMethodForm } from "./add-payment-method-form"

export function PaymentMethods() {
  const methods = [
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiry: "12/25",
      primary: true,
    },
    {
      id: "2",
      type: "bank",
      last4: "7890",
      brand: "Chase",
      primary: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Methods</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <AddPaymentMethodForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              {method.type === "card" ? (
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Banknote className="h-6 w-6 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">
                  {method.type === "card" ? method.brand : "Bank Account"} •••• {method.last4}
                </p>
                <p className="text-sm text-muted-foreground">
                  {method.type === "card" ? `Expires ${method.expiry}` : "Checking Account"}
                </p>
              </div>
            </div>
            {method.primary && (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                Primary
              </span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}