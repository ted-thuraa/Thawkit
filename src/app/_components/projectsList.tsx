"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowUpDown,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { LuFolders } from "react-icons/lu";
import Image from "next/image";
import React from "react";
import {
  BasicProjectListItem,
  OrganizationProjectsQueryResponse,
} from "@/lib/querries/project";
import { getRelativeTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAlertDialog } from "@/providers/alert-dialog-provider";
import { deleteProject } from "@/actions/project/project";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NewProjectButton } from "../(main)/workspace/_components/create-project";

type Props = {
  projects: BasicProjectListItem[];
};

const ProjectsList = ({ projects }: Props) => {
  const router = useRouter();
  const { showAlertDialog } = useAlertDialog();

  const handleDeleteProject = async (
    projectId: string,
    projectTitle: string
  ) => {
    const confirmed = await showAlertDialog({
      title: `Delete "${projectTitle}"?`,
      description:
        "Are you sure you want to delete this project? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      danger: true,
    });

    if (confirmed) {
      // Add your actual deletion logic here
      const isDeleted = await deleteProject(projectId);
      if (isDeleted.success === true) {
        toast.success("Tool deleted successfully");
        router.refresh();
      }
      if (isDeleted.success === false) {
        toast.error(isDeleted.error);
      }
      // You might want to refetch the tools list or update the UI optimistically
    } else {
      console.log(`User cancelled deletion for tool ID: ${projectId}`);
    }
  };

  return (
    <div className="">
      {/* <h2 className="mb-4 text-xl font-semibold text-slate-900">Scorecards</h2> */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              {/* Thumbnail */}
              <div className="aspect-video w-full border-b border-slate-200 bg-slate-50">
                <div className="flex h-full items-center justify-center p-4">
                  <Image
                    src={project.previewImage ?? "/assets/imageplaceholder.svg"}
                    alt="preview"
                    width={600}
                    height={400}
                    className="aspect-video rounded-sm object-cover"
                  />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="truncate text-lg font-semibold text-slate-900">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {getRelativeTime(project.updatedAt)}
                </p>

                {/* Card Footer */}
                <div className="mt-4 flex items-center justify-between">
                  {project.draftMode ? (
                    <Badge
                      variant="outline"
                      className="rounded-md border-orange-200 bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700"
                    >
                      Draft
                    </Badge>
                  ) : (
                    <Badge
                      variant="success"
                      className="rounded-md  px-2.5 py-0.5 text-xs font-semibold"
                    >
                      Live
                    </Badge>
                  )}

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onSelect={() => router.push(`/app/${project.ref}`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Open live page</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={() =>
                            handleDeleteProject(project.id, project.title)
                          }
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LuFolders />
            </EmptyMedia>
            <EmptyTitle>No Campaigns available</EmptyTitle>
            <EmptyDescription>Create a one to get started.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <NewProjectButton />
            </div>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
};

export default ProjectsList;
