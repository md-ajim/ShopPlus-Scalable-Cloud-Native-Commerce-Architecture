"use client";

import * as React from "react";
import { IconMoon, IconSun, type Icon } from "@tabler/icons-react";
import { useTheme } from "next-themes";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
    badge?: string;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => router.push(item.url)}
                asChild
                className="hover:bg-accent/50"
              >
                <a href={item.url} className="flex items-center gap-3">
                  <item.icon className="size-5" />
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-accent/50">
              <label className="flex cursor-pointer items-center gap-3">
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <IconMoon className="size-5" />
                  ) : (
                    <IconSun className="size-5" />
                  )
                ) : (
                  <Skeleton className="size-5 rounded-full" />
                )}
                <span className="text-sm font-medium">Dark Mode</span>
                {mounted ? (
                  <Switch
                    className="ml-auto"
                    checked={resolvedTheme === "dark"}
                    onCheckedChange={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                  />
                ) : (
                  <Skeleton className="h-4 w-8 rounded-full" />
                )}
              </label>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Quick Actions Section */}
        <div className="mt-4 border-t pt-3">
       
     
          
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
