"use client";

import React, { useEffect } from "react";
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
  useSidebar,
} from "@/components/ui/sidebar";

import { usePathname, useRouter } from "next/navigation";
import { useCurrentSession } from "@/hooks/sessionClient";
import { NavUser } from "@/app/(main)/workspace/_components/nav-user";
import { AppSidebar } from "./app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import SidebarInnerLayout from "./sidebarContent";

type Props = {
  children: React.ReactNode;
  user: {
    email: string;
    name: string;
    image?: string | null | undefined;
  };
  appRef: string;
};

const AppDashboardLayout = ({ children, user, appRef }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const editorRoot = `/app/${appRef}/editor`;
  const isEditorRoute = pathname.startsWith(editorRoot);
  return (
    <>
      {isEditorRoute ? (
        <div>{children}</div>
      ) : (
        <SidebarProvider className="overflow-hidden">
          <SidebarInnerLayout
            user={user}
            appRef={appRef}
            iseditorroute={isEditorRoute}
          >
            {children}
          </SidebarInnerLayout>
        </SidebarProvider>
      )}
    </>
  );
};

export default AppDashboardLayout;
