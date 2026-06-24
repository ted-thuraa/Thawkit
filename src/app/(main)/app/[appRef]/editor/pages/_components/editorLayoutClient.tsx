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
import { EditorLayoutHeader } from "./editorSidebarHeader";
import { EditorSidebar } from "./editorSidebar";

type Props = {
  children: React.ReactNode;
  user: {
    email: string;
    name: string;
    image?: string | null | undefined;
  };
  appRef: string;
};

const EditorDashLayout: React.FC<Props> = ({ children, user, appRef }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <EditorLayoutHeader user={user} />
        <div className="flex flex-1">
          <EditorSidebar />
          <SidebarInset className="overflow-hidden h-full w-full bg-[#fbfbfb] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default EditorDashLayout;

// <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
