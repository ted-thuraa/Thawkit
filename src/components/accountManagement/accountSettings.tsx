"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Menu, Home, Loader2Icon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ProfileForm } from "./profileForm";
import { SecurityTab } from "./securityTab";
import { LinkedAccountsTab } from "./linkedAccounts";
import { ReactNode, Suspense } from "react";
import { useCurrentSession } from "@/hooks/sessionClient";
import { getServerSession } from "@/lib/sessionServer";
import { LoadingSuspense } from "../global/loadingSuspense";

export function AccountSettings({}) {
  const { data: session } = useCurrentSession();
  const { isMobile } = useSidebar();
  if (session == null) return;

  const items = [
    {
      value: "general",
      label: "General",
      icon: Bell,
      component: <ProfileForm user={session.user} />,
    },
    {
      value: "security",
      label: "Security",
      icon: Menu,
      component: (
        <SecurityTab
          email={session.user.email}
          isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
        />
      ),
    },

    {
      value: "accounts",
      label: "Accounts",
      icon: Home,
      component: <LinkedAccountsTab />,
    },
  ];

  return (
    <Tabs defaultValue="general" orientation="vertical" className="flex w-full">
      <SidebarProvider className="items-start">
        {/* Sidebar */}
        <Sidebar collapsible="none" className="hidden md:flex h-full">
          <SidebarContent>
            <SidebarGroup className="h-full">
              <SidebarGroupContent className="h-full">
                <TabsList
                  className={cn(
                    "flex flex-col justify-start w-56 border-r bg-white p-1 rounded-none h-full"
                  )}
                >
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.value}>
                        <TabsTrigger
                          value={item.value}
                          className={cn(
                            "flex items-center  gap-3 rounded-md p-0 text-sm font-medium text-sidebar-foreground transition-colors",
                            "hover:bg-white hover:text-sidebar-primary",
                            "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                          )}
                        >
                          <SidebarMenuButton className="px-2 py-1.5 h-full w-full flex items-center">
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </TabsTrigger>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </TabsList>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
          {items.map((item) => (
            <TabsContent
              key={item.value}
              value={item.value}
              className="flex flex-1 flex-col overflow-y-auto"
            >
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                <div className="flex items-center gap-2 px-4">
                  <h3 className="text-lg font-medium">{item.label}</h3>
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                <LoadingSuspense>{item.component}</LoadingSuspense>
              </div>
            </TabsContent>
          ))}
        </main>
      </SidebarProvider>
    </Tabs>
  );
}
