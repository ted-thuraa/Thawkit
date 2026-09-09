// path: src/app/(main)/workspace/@modal/(.)campaigns/new/page.tsx

import { redirect } from "next/navigation";
import { resolveWorkspaceContext } from "@/lib/workspace/resolve-workspace-context";
import { CreateCampaignModal } from "../../../_components/createCampaignModal";

// Intercepts client-side navigation to /workspace/campaigns/new that
// originates from within /workspace (e.g. clicking "New Campaign" on the
// dashboard). Direct URL entry or a hard refresh bypasses this and hits
// the full-page fallback at campaigns/new/page.tsx instead.
export default async function InterceptedNewCampaignPage() {
  const resolution = await resolveWorkspaceContext();
  if (resolution.kind === "redirect") {
    redirect(resolution.to);
  }

  return (
    <CreateCampaignModal organizationId={resolution.context.organizationId} />
  );
}
