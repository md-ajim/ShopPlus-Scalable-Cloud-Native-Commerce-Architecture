import {
  Plus,
  Banknote,
  ArrowDownUp,
  Sparkles,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentTransactions } from "@/components/recent-transactions";

import { PaymentMethods } from "@/components/payment-methods";
import { BalanceChart } from "@/components/balance-chart";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function BalancePage() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Balance</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-6">
            {/* Header with quick actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Wallet Balance
                </h1>
                <p className="text-muted-foreground">
                  Manage your funds and transactions
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Gift className="h-4 w-4" />
                  Redeem Gift Card
                </Button>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Funds
                </Button>
              </div>
            </div>

            {/* Main grid layout */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left column - Balance overview */}
              <div className="space-y-6 lg:col-span-2">
                {/* Balance cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Available Balance</CardDescription>
                      <CardTitle className="text-3xl">$1,250.75</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <Button variant="link" className="h-auto p-0">
                        View details
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Pending</CardDescription>
                      <CardTitle className="text-2xl">$125.50</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <span className="text-sm text-muted-foreground">
                        2 transactions
                      </span>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Rewards</CardDescription>
                      <CardTitle className="text-2xl">1,250 pts</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <Button variant="link" className="h-auto p-0 gap-1">
                        <Sparkles className="h-3 w-3" />
                        Redeem
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Balance history chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Balance History</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <BalanceChart />
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Actions and recent activity */}
              <div className="space-y-6">
                {/* Quick actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Button
                      variant="outline"
                      className="h-12 justify-start gap-3"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Funds</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 justify-start gap-3"
                    >
                      <ArrowDownUp className="h-4 w-4" />
                      <span>Transfer Money</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 justify-start gap-3"
                    >
                      <Banknote className="h-4 w-4" />
                      <span>Withdraw to Bank</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* Payment methods */}
                <PaymentMethods />
              </div>
            </div>

            {/* Transaction tabs */}
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="deposits">Deposits</TabsTrigger>
                  <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                  <TabsTrigger value="purchases">Purchases</TabsTrigger>
                  <TabsTrigger value="refunds">Refunds</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                </div>
              </div>
              <TabsContent value="all" className="mt-4">
                <RecentTransactions />
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
