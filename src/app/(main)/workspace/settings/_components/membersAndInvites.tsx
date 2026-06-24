"use client";
import * as React from "react";
// Re-import toast for user feedback
import { toast } from "sonner";
import { Toaster } from "sonner"; // Toaster component to render the toasts
import { BsPeopleFill } from "react-icons/bs";
import { RiPassPendingFill } from "react-icons/ri";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader, // Kept for loading states
  Plus,
  Ellipsis,
  Columns,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  RowData, // Import RowData
  SortingState,
  TableMeta, // Import TableMeta
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

// --- Kept ShadCN UI Imports ---
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { authClient } from "@/lib/auth/auth-client";
import { memberSchema, MembersInviteTable } from "./memberInvitesTable";
import { MembersTable } from "./membersTable";
import { InvitesTable } from "./invitesTable";
import { CreateInviteButton } from "./createInviteButton";

export function MembersAndInvitesEditor() {
  const {
    data: activeOrganization,
    error: getActiveOrgError,
    isPending: isActiveOrgLoading,
  } = authClient.useActiveOrganization();
  const {
    data: session,
    error: getSessionError,
    isPending: isGetSessionLoading,
  } = authClient.useSession();

  const pendingInvites = activeOrganization?.invitations?.filter(
    (invite) => invite.status === "pending"
  );

  // Add state to track which member is being removed
  const [isRemovingMemberId, setIsRemovingMemberId] = React.useState<
    string | null
  >(null);

  // Define the remove member function
  const handleRemoveMember = async (memberId: string) => {
    // Prevent double-clicks
    if (isRemovingMemberId) return;

    // cannot remove yourself
    if (memberId === session?.user.id) return;

    // Production Safeguard: Check if this is the last owner
    if (activeOrganization?.members) {
      const memberToRemove = activeOrganization.members.find(
        (m) => m.id === memberId
      );
      const ownerCount = activeOrganization.members.filter(
        (m) => m.role === "owner"
      ).length;

      if (memberToRemove?.role === "owner" && ownerCount <= 1) {
        toast.error("Cannot remove the last owner.");
        return;
      }
    }

    setIsRemovingMemberId(memberId);
    toast.loading("Removing member...");

    try {
      // This is the function you provided
      await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
      });

      // The useActiveOrganization hook will hopefully refetch or update its cache.
      // If it doesn't, a manual refetch call would be needed here.
      toast.success("Member removed successfully.");
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member.");
    } finally {
      setIsRemovingMemberId(null);
      // Dismiss the loading toast
      toast.dismiss();
    }
  };

  // Handle Loading State
  if (isActiveOrgLoading || isGetSessionLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading members...</span>
      </div>
    );
  }

  // Handle Error State
  if (getActiveOrgError || getSessionError) {
    return (
      <div className="p-10 text-center text-red-500">
        <p>Error loading organization data.</p>
        <p>Please refresh the page or try again later.</p>
      </div>
    );
  }

  // Handle no organization
  if (!activeOrganization) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        No active organization found.
      </div>
    );
  }

  // Pass the real members data to the table
  const membersData = activeOrganization.members || [];

  return (
    <div className="font-sa">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 mb-5">
          Manage members and invitations
        </h3>
      </div>
      <Tabs
        defaultValue="active-members"
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between ">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="outline">
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="past-performance">Past Performance</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem>
            </SelectContent>
          </Select>

          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="active-members" className="text-sm ">
              <BsPeopleFill
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Active members{" "}
              <Badge variant="secondary">{membersData.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending-invites" className="text-sm ">
              <RiPassPendingFill
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Pending invititations{" "}
              <Badge variant="secondary">
                {pendingInvites ? pendingInvites.length : 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <CreateInviteButton />
          </div>
        </div>
        <TabsContent
          value="active-members"
          className="relative flex flex-col gap-4 overflow-auto"
        >
          <MembersTable
            data={membersData as any}
            sessionUserId={session?.user.id as string}
            onRemoveMember={handleRemoveMember}
            isRemovingMemberId={isRemovingMemberId}
          />
        </TabsContent>
        <TabsContent
          value="pending-invites"
          className="relative flex flex-col gap-4 "
        >
          <InvitesTable
            data={pendingInvites as any}
            sessionUserId={session?.user.id as string}
            onRemoveMember={handleRemoveMember}
            isRemovingMemberId={isRemovingMemberId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
