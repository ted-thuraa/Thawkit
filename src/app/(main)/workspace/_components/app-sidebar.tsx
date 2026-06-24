"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Folders,
  Frame,
  Hexagon,
  House,
  LayoutGrid,
  LifeBuoy,
  Map,
  MessageSquare,
  PieChart,
  Settings2,
  SquareTerminal,
  SwatchBook,
  Users,
  Users2,
} from "lucide-react";

import { NavMain } from "@/app/(main)/workspace/_components/nav-main";
import { OrganisationsSwitcher } from "@/app/(main)/workspace/_components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { UpgradeCard } from "./upgradecard";
import { ThawkitLogo } from "@/components/global/appLogo";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {};

export function AppSidebar(props: AppSidebarProps) {
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
        title: "Projects",
        url: `/workspace`,
        icon: LayoutGrid,
        isActive: pathname === `/workspace`,
        items: [],
      },
      {
        title: "Templates",
        url: `/workspace/templates`,
        isActive: pathname === `/workspace/templates`,
        icon: Users2,
        items: [],
      },

      {
        title: "Settings",
        url: `/workspace/settings`,
        isActive: pathname === `/workspace/settings`,
        icon: Settings2,
        items: [],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="mb-4 flex items-center gap-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Hexagon className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
            Thawkit
          </span>
        </div>
        <OrganisationsSwitcher
          orgs={data.organisations}
          activeOrg={activeOrganization}
        />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter />

      <div className="p-1">
        <UpgradeCard />
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
