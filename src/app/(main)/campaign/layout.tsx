import React from "react";
import { getServerSession } from "@/lib/sessionServer";
import { redirect } from "next/navigation";
import { resolveWorkspaceContext } from "@/lib/workspace/resolve-workspace-context";
import { getCampaignDetail } from "@/lib/querries/campaigns";
import CampaignLayout from "./[campaignId]/_components/campaignLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
