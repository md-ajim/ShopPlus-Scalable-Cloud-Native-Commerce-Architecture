"use client";
import { Share2, Gift, Users, Clipboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ReferralsPage() {
  const referralLink = "https://127.0.0.1:8000/ref/username123";

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=Join me on OurStore&body=Get 10% off your first purchase when you use my referral link: ${referralLink}`;
  };

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=Get 10% off your first purchase: ${referralLink}`
    );
  };

  const shareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink
      )}`
    );
  };
  const referrals = [
    {
      name: "Alex Johnson",
      email: "alex@example.com",
      status: "completed",
      reward: "$10.00",
    },
    {
      name: "Sam Wilson",
      email: "sam@example.com",
      status: "pending",
      reward: "$10.00",
    },
    {
      name: "Taylor Smith",
      email: "taylor@example.com",
      status: "completed",
      reward: "$10.00",
    },
  ];
  const earned = 20;
  const potential = 10;
  const progress = (earned / (earned + potential)) * 100;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
  };

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
                  <BreadcrumbPage>Referral Earn</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Referral Program
                </h1>
                <p className="text-muted-foreground">
                  Earn rewards by inviting friends to shop with us
                </p>
              </div>
              <Button>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Earned</CardDescription>
                  <CardTitle className="text-3xl">${earned}.00</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Gift className="mr-1 h-4 w-4" />
                    Available for withdrawal
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Potential</CardDescription>
                  <CardTitle className="text-3xl">${potential}.00</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    From pending referrals
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Progress</CardDescription>
                  <CardTitle className="text-3xl">2/5</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2" />
                  <div className="mt-2 text-sm text-muted-foreground">
                    Complete 5 referrals for a $50 bonus
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referral Link Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>
                  Share this link with friends and earn $10 for each completed
                  purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input value={referralLink} readOnly className="flex-1" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={copyToClipboard}>
                        <Clipboard className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy to clipboard</TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={shareViaEmail}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via Email
                </Button>
                <Button variant="outline" onClick={shareViaWhatsApp}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via WhatsApp
                </Button>
                <Button variant="outline" onClick={shareViaFacebook}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via Facebook
                </Button>
              </CardFooter>
            </Card>

            {/* How It Works Section */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-primary">1</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Share Your Link</h3>
                    <p className="text-sm text-muted-foreground">
                      Send your unique referral link to friends
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-primary">2</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">They Make a Purchase</h3>
                    <p className="text-sm text-muted-foreground">
                      Friends get 10% off their first order
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-primary">3</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">You Earn Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Get $10 credit when their order ships
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
                <CardDescription>
                  People you&#39;ve invited to the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {referrals.map((referral, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={`/avatars/${index + 1}.png`} />
                            <AvatarFallback>
                              {referral.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{referral.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {referral.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              referral.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {referral.status}
                          </Badge>
                          <div className="hidden sm:block font-medium">
                            {referral.reward}
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {index < referrals.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
