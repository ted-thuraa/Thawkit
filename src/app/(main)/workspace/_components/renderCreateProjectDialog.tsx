"use client";
import useCreateProjectPage from "@/stores/createProjectStore/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ProjectCreatePage from "./createProjectTab";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, PlusIcon } from "lucide-react";
import NewProject from "@/components/forms/create-project";
import { authClient } from "@/lib/auth/auth-client";

type createProjectsPageProps = {};

const CreateProjectDialog: React.FC<createProjectsPageProps> = ({}) => {
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [useTemplatesDialogOpen, setUseTemplatesDialogOpen] = useState(false);
  const [isAiWizardDialogOpen, setUseAiWizardDialogOpen] = useState(false);
  const { page, setPage } = useCreateProjectPage();
  const router = useRouter();

  const {
    data: activeOrganization,
    error,
    isPending,
  } = authClient.useActiveOrganization();

  // --- Loading State ---
  if (isPending || !activeOrganization) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader2 className="animate-spin text-gray-500" size={22} />
      </div>
    );
  }

  const handleSelectOption = (option: string) => {
    if (option === "create-template") {
      setUseTemplatesDialogOpen(true);
    } else if (option === "create-scratch") {
      setPage("create-scratch");
      setIsAddProjectDialogOpen(true);
    } else {
      //setUseAiWizardDialogOpen(true);
      setPage("create-Ai");
    }
  };

  const handleOnBack = () => {
    setPage("create-scratch");
  };

  const handleOnCreateSuccess = () => {
    //setPage("create-scratch");
    setIsAddProjectDialogOpen(false);
  };

  const handleCancelUseTemplates = () => {
    setUseTemplatesDialogOpen(false);
  };

  const handleCancelAddProject = () => {
    setIsAddProjectDialogOpen(false);
  };

  const renderStep = () => {
    switch (page) {
      case "create-scratch":
        return (
          <>
            <ProjectCreatePage onSelectOption={handleSelectOption} />
          </>
        );
      case "create-template":
        return <></>;
      case "create-Ai":
        return (
          <>
            {/* todo */}
            {/* <WizardPage onBack={handleOnBack} /> */}
            <div className="relative">
              <Button
                variant={"outline"}
                onClick={handleOnBack}
                className="absolute right-0 top-0 rounded-lg hover:bg-transparent"
              >
                <ChevronLeft className="mr-2 h-4 w-4 " />
                Back
              </Button>
              <div>To duh</div>
            </div>
          </>
        );

      default:
        break;
    }
  };
  return (
    <div>
      {renderStep()}
      <Dialog
        open={isAiWizardDialogOpen}
        onOpenChange={setUseAiWizardDialogOpen}
      >
        {/* <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">Add Tool</span>
          </Button>
        </DialogTrigger> */}
        <DialogContent className="max-w-[100vw] w-[100vw] max-h-[100vh] h-[98vh] bg-white overflow-hidden p-0">
          {/* <WizardPage /> */}
          <div>To duh</div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isAddProjectDialogOpen}
        onOpenChange={setIsAddProjectDialogOpen}
      >
        {/* <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">Add Tool</span>
          </Button>
        </DialogTrigger> */}
        <DialogContent className="p-0 max-w-xl bg-transparent border-none">
          <DialogTitle className="sr-only">New Project</DialogTitle>
          <NewProject
            onSuccess={handleOnCreateSuccess}
            organizationId={activeOrganization.id}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={useTemplatesDialogOpen}
        onOpenChange={setUseTemplatesDialogOpen}
      >
        {/* <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">Add Tool</span>
          </Button>
        </DialogTrigger> */}
        <DialogContent className="p-0">
          <DialogTitle className="sr-only">Use templates</DialogTitle>
          <div>Use templates</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProjectDialog;
