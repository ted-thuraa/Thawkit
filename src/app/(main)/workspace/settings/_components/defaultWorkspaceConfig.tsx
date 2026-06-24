"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutGrid,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users2,
} from "lucide-react";

import { NavMain } from "@/app/(main)/workspace/_components/nav-main";
import { NavProjects } from "@/app/(main)/workspace/_components/nav-projects";
import { NavUser } from "@/app/(main)/workspace/_components/nav-user";
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

// This is sample data.

export function OrganizationConfig() {
  const pathname = usePathname(); // Get the current path
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return <div>Team</div>;
}
