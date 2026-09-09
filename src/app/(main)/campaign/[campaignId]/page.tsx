// path: src/app/(main)/workspace/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { resolveWorkspaceContext } from "@/lib/workspace/resolve-workspace-context";
import type { CampaignStatus } from "@/types/workspace";
import { listCampaigns } from "@/lib/querries/campaigns";
import { Button } from "@/components/ui/button";

type SearchParams = {
  status?: string;
  cursor?: string;
};

export default async function CampaignMainPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolution = await resolveWorkspaceContext();
  if (resolution.kind === "redirect") {
    redirect(resolution.to);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Campaign overview
          </h3>
        </div>
      </div>
    </div>
  );
}
