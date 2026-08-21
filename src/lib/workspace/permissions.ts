// path: src/lib/workspace/permissions.ts

import "server-only";
import { OrgRole } from "@/types/workspace";

const ROLE_RANK: Record<OrgRole, number> = {
  member: 0,
  admin: 1,
  owner: 2,
};

export function hasAtLeastRole(role: OrgRole, minimum: OrgRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

/**
 * Single source of truth for "who can do what" in a workspace, mirroring
 * the RBAC matrix from the architecture design doc. Every Server Action and
 * authorization-gated query should reference this rather than hardcoding
 * role arrays inline, so the policy can be audited in one place.
 */
export const WORKSPACE_ROLE_MATRIX = {
  /** View campaigns, org overview, active members list. */
  viewWorkspace: ["owner", "admin", "member"],
  /** Edit org name/logo. */
  manageOverview: ["owner", "admin"],
  /** Invite, revoke invites, remove members, edit a member's display name. */
  manageTeam: ["owner", "admin"],
  /** Promote/demote roles — deliberately owner-only, admins cannot self-elevate. */
  manageRoles: ["owner"],
  /** Admin-initiated email change requests — owner-only given the account-takeover risk. */
  manageMemberEmail: ["owner"],
} as const satisfies Record<string, readonly OrgRole[]>;
