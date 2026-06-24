"use client";
import { SubscriptionPlans } from "@/components/billing/subscription-management";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarInput } from "@/components/ui/sidebar";
import { useAlertDialog } from "@/providers/alert-dialog-provider";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import { Loader2, Plus, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateProjectDialog from "./renderCreateProjectDialog";

export function NewProjectButton() {
  const [isOpen, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCreateToolDialog, setShowCreateToolDialog] = useState(false);
  const router = useRouter();
  const { showAlertDialog } = useAlertDialog();

  const handleCreateProject = async () => {
    setIsCreating(true);
    try {
      setShowCreateToolDialog(true);
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          disabled={isCreating}
          onClick={handleCreateProject}
        >
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="mr-2 h-4 w-4" />
          )}
          <span className="hidden lg:inline">New project</span>
        </Button>

        <AlertDialog
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
              <AlertDialogDescription>
                You have reached the maximum number of tools for the free plan.
                Please upgrade to create more.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Upgrade</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog
          open={showCreateToolDialog}
          onOpenChange={setShowCreateToolDialog}
        >
          {/* <DialogTrigger asChild>
          <Button variant="outline">Scrollable (custom scrollbar)</Button>
        </DialogTrigger> */}
          <DialogContent className="flex flex-col gap-0 p-0 max-w-full w-[100vw] h-[100vh] ">
            <DialogTitle className="sr-only">Create New Project</DialogTitle>
            <ScrollArea className="flex max-h-full flex-col overflow-hidden">
              <div>
                <CreateProjectDialog />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
