// path: src/app/(main)/workspace/_components/createCampaignModal.tsx

"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateCampaignForm } from "./create-project";

/**
 * Rendered by the intercepted route (@modal/(.)campaigns/new/page.tsx).
 * Closing the dialog (X, escape, outside click) calls router.back() —
 * this dismisses the intercepted route and returns to the underlying
 * /workspace page without a full reload, since the intercepted segment is
 * an overlay on top of it, not a replacement for it.
 */
export function CreateCampaignModal({
  organizationId,
}: {
  organizationId: string;
}) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New campaign</DialogTitle>
          <DialogDescription>
            Give your campaign a name — you can add funnels and steps once it's
            created.
          </DialogDescription>
        </DialogHeader>
        <CreateCampaignForm organizationId={organizationId} />
      </DialogContent>
    </Dialog>
  );
}
