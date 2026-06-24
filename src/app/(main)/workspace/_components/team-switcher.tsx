"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Prettify } from "better-auth";
import { Invitation, Member } from "better-auth/plugins/organization";

// --- Types ---

type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null;
  metadata?: any;
};

type OrganizationListItem = Organization;

type ActiveOrganization = Prettify<
  Organization & {
    members: (Member & {
      user: {
        id: string;
        name: string;
        email: string;
        image: string | undefined;
      };
    })[];
    invitations: Invitation[];
  }
> | null;

interface OrganisationsSwitcherProps {
  orgs: OrganizationListItem[] | null;
  activeOrg: ActiveOrganization;
}

// --- Helper Function ---

/**
 * Generates uppercase initials from a name.
 * "Workspace" -> "W"
 * "Johns Workspace" -> "JW"
 * "The Creative Studio" -> "TC"
 */
const getInitials = (name?: string | null): string => {
  if (!name) return "?";

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "?";

  const firstInitial = words[0][0] || "";
  const secondInitial = words[1]?.[0] || "";

  if (words.length >= 2) {
    return (firstInitial + secondInitial).toUpperCase();
  }

  return firstInitial.toUpperCase();
};

// --- Component ---

export function OrganisationsSwitcher({
  orgs,
  activeOrg,
}: OrganisationsSwitcherProps) {
  const { isMobile } = useSidebar();

  if (!activeOrg) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-full text-sm font-semibold uppercase">
                {getInitials(activeOrg.name)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrg.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {orgs?.map((org) => (
              <DropdownMenuItem
                key={org.id}
                // TODO: Implement organization switching logic
                // onClick={() => handleOrgSwitch(org)}
                className="gap-2 p-2"
              >
                <div className="p-1.5 bg-muted text-muted-foreground flex aspect-square size-7 items-center justify-center rounded-full border text-xs font-semibold uppercase">
                  {getInitials(org.name)}
                </div>
                <span className="truncate">{org.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add Workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
