

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, User, MapPin, Bell, Camera, Mail, 
  Smartphone, Building, Flag, CheckCircle2, ChevronRight, Sparkles 
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Types
interface AddressType {
  id: number;
  name: string;
  phone: string;
  user: { id: number; email: string };
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  isDefault: boolean;
  newsletter: boolean;
  emailMarketing: boolean;
  smsMarketing: boolean;
}

// Validation Schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, "Name too short"),
  lastName: z.string().min(2, "Name too short"),
  email: z.string().email(),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(5, "Address too short"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  zipCode: z.string().min(4, "Zip required"),
  country: z.string().min(2, "Country required"),
  isDefault: z.boolean().default(true),
  preferences: z.object({
    newsletter: z.boolean(),
    smsMarketing: z.boolean(),
    emailMarketing: z.boolean(),
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfilePage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Initialize Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      address: "", city: "", state: "", zipCode: "", country: "US",
      isDefault: true,
      preferences: { newsletter: true, smsMarketing: false, emailMarketing: true },
    },
  });

  // Fetch Data Logic
  useEffect(() => {
    const fetchAddress = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/addressInfo/`, {
          headers: { Authorization: `Bearer ${session.accessToken || ''}` }
        });

        if (res.data?.results) {
          const userAddresses = res.data.results.filter(
            (item: AddressType) => item?.user?.id === session.user.id
          );
          
          const currentData = userAddresses.at(-1);

          if (currentData) {
            const [first, ...last] = currentData.name ? currentData.name.split(" ") : ["", ""];
            
            form.reset({
              firstName: first || "",
              lastName: last.join(" ") || "",
              email: currentData.user.email || session.user.email || "",
              phone: currentData.phone || "",
              address: currentData.address || "",
              city: currentData.city || "",
              state: currentData.state || "",
              zipCode: currentData.zip || "",
              country: currentData.country || "US",
              isDefault: currentData.isDefault,
              preferences: {
                newsletter: currentData.newsletter ?? true,
                smsMarketing: currentData.smsMarketing ?? false,
                emailMarketing: currentData.emailMarketing ?? true,
              }
            });
          } else {
             form.setValue("email", session.user.email || "");
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Could not load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") fetchAddress();
  }, [session, status, form]);

  // Submit Logic
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        user: session?.user?.id,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zipCode,
        country: data.country,
        isDefault: data.isDefault,
        newsletter: data.preferences.newsletter,
        smsMarketing: data.preferences.smsMarketing,
        emailMarketing: data.preferences.emailMarketing,
      };

      await axios.post("/api/api/addressInfo/", payload);
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved to our secure servers.",
        // icon: <Sparkles className="h-4 w-4 text-amber-400" />
      });
    } catch (error) {
      console.error(error);
      toast.error("Update failed", { description: "Please check your connection." });
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: "profile", label: "General", icon: User },
    { id: "shipping", label: "Shipping", icon: MapPin },
    { id: "preferences", label: "Notifications", icon: Bell },
  ];

  if (status === "loading" || isLoading) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-20">
      
      {/* 1. Immersive Header */}
      <div className="h-64 w-full bg-zinc-900 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0" />
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-end gap-6"
          >
             <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl rounded-2xl">
                  <AvatarImage src="/avatars/user.jpg" className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-zinc-100 text-zinc-900 rounded-2xl">
                      {form.getValues("firstName")?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <button type="button" className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105">
                  <Camera className="h-4 w-4" />
                </button>
             </div>
             <div className="mb-4 space-y-1">
                <h1 className="text-3xl font-bold  text-white  tracking-tight">
                  {form.watch("firstName")} {form.watch("lastName")}
                </h1>
                <div className="flex items-center gap-2 text-white  dark:text-zinc-400">
                  {/* <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                    Premium Member
                  </Badge> */}
                  <span className="text-sm">{form.watch("email")}</span>
                </div>
             </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 2. Modern Navigation Pill */}
          <nav className="w-full lg:w-64 shrink-0 lg:sticky lg:top-8 h-fit">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-2 shadow-sm border border-zinc-200 dark:border-zinc-800 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full whitespace-nowrap lg:whitespace-normal z-10 ${
                    activeTab === item.id 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* 3. Main Form Area */}
          <div className="flex-1 max-w-3xl">
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AnimatePresence mode="wait">
                  
                  {activeTab === "profile" && (
                    <motion.div 
                      key="profile" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <CardHeader>
                          <CardTitle>Personal Information</CardTitle>
                          <CardDescription>Update your personal details and contact info.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="p-6 grid gap-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl><Input className="h-11 bg-zinc-50 dark:bg-zinc-900" placeholder="John" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl><Input className="h-11 bg-zinc-50 dark:bg-zinc-900" placeholder="Doe" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                                    <FormControl><Input disabled className="pl-10 h-11 bg-zinc-100 dark:bg-zinc-800 text-zinc-500" {...field} /></FormControl>
                                  </div>
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <div className="relative">
                                    <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                                    <FormControl><Input className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-900" placeholder="+1 (555) 000-0000" {...field} /></FormControl>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )} />
                           </div>
                        </CardContent>
                        <CardFooterAction isSaving={isSaving} onNext={() => setActiveTab("shipping")} />
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === "shipping" && (
                     <motion.div 
                     key="shipping" 
                     initial={{ opacity: 0, x: 20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                   >
                      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <CardHeader>
                          <CardTitle>Shipping Address</CardTitle>
                          <CardDescription>Where should we send your orders?</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="p-6 grid gap-6">
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Street Address</FormLabel>
                                  <FormControl><Input className="h-11 bg-zinc-50 dark:bg-zinc-900" placeholder="123 Main St" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-6">
                                <FormField control={form.control} name="city" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <div className="relative">
                                      <Building className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                                      <FormControl><Input className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-900" placeholder="City" {...field} /></FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="state" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl><Input className="h-11 bg-zinc-50 dark:bg-zinc-900" placeholder="State" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <FormField control={form.control} name="zipCode" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl><Input className="h-11 bg-zinc-50 dark:bg-zinc-900" placeholder="Zip" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="country" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="h-11 bg-zinc-50 dark:bg-zinc-900">
                                            <div className="flex items-center gap-2">
                                                <Flag className="h-4 w-4 text-zinc-500" />
                                                <SelectValue placeholder="Select country" />
                                            </div>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="US">United States</SelectItem>
                                        <SelectItem value="UK">United Kingdom</SelectItem>
                                        <SelectItem value="CA">Canada</SelectItem>
                                        <SelectItem value="BD">Bangladesh</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                            </div>
                        </CardContent>
                        <CardFooterAction isSaving={isSaving} onNext={() => setActiveTab("preferences")} />
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === "preferences" && (
                     <motion.div 
                     key="preferences" 
                     initial={{ opacity: 0, x: 20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                   >
                      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <CardHeader>
                          <CardTitle>Notifications</CardTitle>
                          <CardDescription>Manage how we communicate with you.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="p-0">
                          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                             {[
                                { name: "preferences.newsletter", title: "Newsletter", desc: "Weekly drops and design news." },
                                { name: "preferences.emailMarketing", title: "Promotions", desc: "Sales and exclusive offers." },
                                { name: "preferences.smsMarketing", title: "SMS Updates", desc: "Order status via text message." }
                             ].map((pref, i) => (
                                <FormField
                                  key={i}
                                  control={form.control}
                                  name={pref.name as any}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base font-semibold">{pref.title}</FormLabel>
                                        <FormDescription>{pref.desc}</FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                             ))}
                          </div>
                        </CardContent>
                        <CardFooterAction isSaving={isSaving} isLastStep />
                      </Card>
                    </motion.div>
                  )}

                </AnimatePresence>
              </form>
             </Form>
          </div>

        </div>
      </div>
    </div>
  );
}

// ----------------------
// Helper Components
// ----------------------

function CardFooterAction({ isSaving, onNext, isLastStep = false }: { isSaving: boolean, onNext?: () => void, isLastStep?: boolean }) {
    return (
        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" className="text-zinc-500 hover:text-zinc-900">Cancel</Button>
            <div className="flex gap-3">
              {!isLastStep && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onNext}
                  className="hidden sm:flex"
                >
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button type="submit" disabled={isSaving} className="min-w-[140px] bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-md hover:shadow-lg">
                  {isSaving ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                      <>{isLastStep ? "Finish & Save" : "Save Changes"}</>
                  )}
              </Button>
            </div>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950">
             <Skeleton className="h-64 w-full" />
             <div className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
                <Skeleton className="w-full lg:w-64 h-48 rounded-2xl" />
                <div className="flex-1 space-y-6">
                   <Skeleton className="h-12 w-1/3 rounded-lg" />
                   <Skeleton className="h-96 w-full rounded-xl" />
                </div>
             </div>
        </div>
    )
}