// path: src/app/(main)/workspace/campaigns/new/page.tsx

import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resolveWorkspaceContext } from "@/lib/workspace/resolve-workspace-context";
import { CreateCampaignForm } from "../../_components/create-project";

// Full-page fallback for direct nav, hard refresh, or a shared link — the
// create flow is never modal-only/unshareable. Same form component and
// schema as the intercepted modal.
export default async function NewCampaignPage() {
  const resolution = await resolveWorkspaceContext();
  if (resolution.kind === "redirect") {
    redirect(resolution.to);
  }

  return (
    <div className="mx-auto w-full max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>New campaign</CardTitle>
          <CardDescription>
            Give your campaign a name — you can add funnels and steps once it's
            created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCampaignForm
            organizationId={resolution.context.organizationId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
