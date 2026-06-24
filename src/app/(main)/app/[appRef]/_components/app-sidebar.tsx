"use client";

import * as React from "react";
import {
  ChartNoAxesCombined,
  SquarePen,
  Users,
  Cog,
  Share,
  Hexagon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { ThawkitLogo } from "@/components/global/appLogo";
import { NavMain } from "./nav-main";
import { UpgradeCard } from "@/app/(main)/workspace/_components/upgradecard";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  appref: string;
  iseditorroute: boolean;
};

export function AppSidebar({
  appref,
  iseditorroute,
  ...rest
}: AppSidebarProps) {
  const pathname = usePathname();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    organisations: organizations,
    navMain: [
      {
        title: "Overview",
        url: `/app/${appref}`,
        icon: ChartNoAxesCombined,
        isActive: pathname === `/app/${appref}`,
        requiredPermission: "view_analytics",
        description: "View app analytics and performance metrics",
      },
      {
        title: "Edit",
        url: `/app/${appref}/editor/pages`,
        icon: SquarePen,
        isActive: pathname === `/app/${appref}/editor/pages`,
        requiredPermission: "manage_apps",
        description: "Edit and configure app settings",
      },
      {
        title: "Leads",
        url: `/app/${appref}/leads`,
        icon: Users,
        isActive: pathname === `/app/${appref}/leads`,
        requiredPermission: "view_analytics",
        description: "View and manage captured leads",
      },
      {
        title: "Settings",
        url: `/app/${appref}/settings`,
        icon: Cog,
        isActive: pathname === `/app/${appref}/settings`,
        requiredPermission: "manage_apps",
        description: "Configure app settings and preferences",
      },
      {
        title: "Share",
        url: `/app/${appref}/share`,
        icon: Share,
        isActive: pathname === `/app/${appref}/share`,
        requiredPermission: "view_analytics",
        description: "Share app and manage access",
      },
    ],
  };

  return (
    <Sidebar collapsible={"icon"} {...rest}>
      <SidebarHeader>
        {/* <ThawkitLogo variant="light" size="lg" className="" /> */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Hexagon className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Thawkit
          </span>
        </div>
        {/* Todo projectswitcher */}
      </SidebarHeader>

      <SidebarContent className="">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter />

      {/* <div className="p-1">
        <UpgradeCard />
      </div> */}

      <SidebarRail />
    </Sidebar>
  );
}
