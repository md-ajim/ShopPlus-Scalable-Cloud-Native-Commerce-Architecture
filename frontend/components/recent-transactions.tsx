"use client"

import { ArrowDownRight, ArrowUpRight, CreditCard, Wallet, ShoppingBag, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

type Transaction = {
  id: string
  amount: number
  type: "credit" | "debit"
  method: "card" | "wallet" | "transfer"
  description: string
  date: string
  status: "completed" | "pending" | "failed"
}

export function RecentTransactions() {
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "failed">("all")

  const transactions: Transaction[] = [
    {
      id: "1",
      amount: 250.0,
      type: "credit",
      method: "card",
      description: "Wallet Top-up",
      date: "2023-11-15",
      status: "completed",
    },
    {
      id: "2",
      amount: 49.99,
      type: "debit",
      method: "wallet",
      description: "Order #12345",
      date: "2023-11-14",
      status: "completed",
    },
    {
      id: "3",
      amount: 125.0,
      type: "credit",
      method: "transfer",
      description: "Bank Transfer",
      date: "2023-11-12",
      status: "pending",
    },
    {
      id: "4",
      amount: 89.99,
      type: "debit",
      method: "wallet",
      description: "Order #12344",
      date: "2023-11-10",
      status: "completed",
    },
    {
      id: "5",
      amount: 50.0,
      type: "credit",
      method: "card",
      description: "Wallet Top-up",
      date: "2023-11-08",
      status: "failed",
    },
  ]

  const filteredTransactions = transactions.filter(
    (transaction) => filter === "all" || transaction.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "failed":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Recent Transactions</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="gap-1">
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("failed")}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                {transaction.type === "credit" ? (
                  <ArrowDownRight className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  <span>•</span>
                  {transaction.method === "card" ? (
                    <span className="inline-flex items-center">
                      <CreditCard className="mr-1 h-3 w-3" />
                      Card
                    </span>
                  ) : transaction.method === "wallet" ? (
                    <span className="inline-flex items-center">
                      <Wallet className="mr-1 h-3 w-3" />
                      Wallet
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      <ShoppingBag className="mr-1 h-3 w-3" />
                      Purchase
                    </span>
                  )}
                  <span>•</span>
                  <span className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`font-medium ${
                transaction.type === "credit" ? "text-green-500" : "text-red-500"
              }`}
            >
              {transaction.type === "credit" ? "+" : "-"}$
              {transaction.amount.toFixed(2)}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No transactions found</p>
          <p className="text-sm text-muted-foreground">
            Try changing your filters
          </p>
        </div>
      )}
    </div>
  )
}