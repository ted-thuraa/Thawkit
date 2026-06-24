"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "@/app/(main)/workspace/_components/nav-user";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type SidebarInnerLayoutProps = {
  children: React.ReactNode;
  user: {
    email: string;
    name: string;
    image?: string | null | undefined;
  };
  appRef: string;
  iseditorroute: boolean;
};

const SidebarInnerLayout = ({
  children,
  user,
  appRef,
  iseditorroute,
}: SidebarInnerLayoutProps) => {
  const { open, setOpen } = useSidebar();

  //   useEffect(() => {
  //     if (iseditorroute) {
  //       // Force collapse
  //       if (open) setOpen(false);
  //     } else {
  //       // Force expand
  //       if (!open) setOpen(true);
  //     }
  //   }, [iseditorroute]);

  return (
    <>
      <AppSidebar appref={appRef} iseditorroute={iseditorroute} />

      <SidebarInset className="overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
          </div>

          <div className="ml-auto px-3 flex items-center gap-x-2">
            <NavUser user={user} />
          </div>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </>
  );
};

export default SidebarInnerLayout;
