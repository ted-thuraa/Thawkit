"use client";

import React, { useState, useEffect } from "react";
import { AppWindow, ChevronDown, Cog, MoreHorizontal } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { HiMiniArrowTurnDownRight } from "react-icons/hi2";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  FetchProjectPagesDataResponse,
  getProjectPages,
} from "@/lib/querries/project";
import { MinimalFunnelPage } from "@/lib/types/project";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePage } from "@/actions/project/project";
import { useAlertDialog } from "@/providers/alert-dialog-provider";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import QuizEndLogicEditor from "./helpers/quizEndLogic";

type PageGroup = {
  title: string;
  mappings: MinimalFunnelPage[];
};

type PagesObject = {
  main: PageGroup;
  quiz: PageGroup;
  result: PageGroup;
};

export function EditorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { projectData, page, isEditorLoading } = usePageBuilderStore();
  const [pages, setPages] = useState<PagesObject | null>(null);
  const [isPagesLoading, setIsPagesLoading] = useState(false);
  const { showAlertDialog } = useAlertDialog();
  const router = useRouter();

  const isLoading = isEditorLoading || isPagesLoading;

  useEffect(() => {
    if (!projectData?.ref && !projectData?.id) return;

    const load = async () => {
      setIsPagesLoading(true);
      try {
        const data: FetchProjectPagesDataResponse = await getProjectPages(
          projectData.id as string
        );

        const pagesData: PagesObject = {
          main: {
            title: "Landing page",
            mappings: data.funnelPages.filter((p) => p.type === "Landing_Page"),
          },
          quiz: {
            title: "Questions page",
            mappings: data.funnelPages.filter((p) => p.type === "Quiz_Page"),
          },
          result: {
            title: "Outcome page",
            mappings: data.funnelPages.filter((p) => p.type === "Result_Page"),
          },
        };

        setPages(pagesData);
      } catch (err) {
        console.error("Failed to load pages:", err);
      } finally {
        // Clear loading state after fetch (success or failure)
        setIsPagesLoading(false);
      }
    };

    load();
  }, [projectData?.ref, projectData?.id]);

  const handleDeletePage = async (pageId: string) => {
    const confirmed = await showAlertDialog({
      title: `Delete page"?`,
      description:
        "Are you sure you want to delete this page? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      danger: true,
    });

    if (confirmed) {
      // Add your actual deletion logic here
      const isDeleted = await deletePage(pageId);
      if (isDeleted.success === true) {
        toast.success("Page deleted successfully");
        router.refresh();
      }
      if (isDeleted.success === false) {
        toast.error(isDeleted.error);
      }
      // You might want to refetch the tools list or update the UI optimistically
    } else {
      console.log(`User cancelled deletion for tool ID: ${pageId}`);
    }
  };

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <div className="h-full">
          <div className="w-full h-full flex items-start justify-center space-y-4">
            <div className="w-full h-full p-4 flex flex-col justify-between items-stretch gap-4">
              {isLoading ? (
                // Insert the skeleton code here
                <LoadingSuspense />
              ) : pages ? (
                // Original logic from the prompt
                <div className="w-full h-full flex flex-col justify-between items-stretch gap-4">
                  <div className="w-full ">
                    <div className="min-h-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-gray-900 ">
                        <div className="flex items-center gap-2">
                          <AppWindow className="h-4 w-4 text-gray-500" />
                          <p className="font-semibold">
                            {pages.main.title ?? "Unknown Tier"}
                          </p>
                        </div>
                        {/* <ChevronDown className="h-4 w-4 text-gray-500" /> */}
                      </div>

                      <div className="border-t border-gray-200" />
                      <div className="flex flex-col items-center gap-2 px-2 py-1">
                        {pages.main.mappings.map((page) => (
                          <div
                            key={page.id}
                            className="w-full flex items-center justify-between px-1 py-0.5 text-left text-sm font-medium text-gray-900 border hover:bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  background:
                                    page.status === "Published"
                                      ? "#22C55E" // green
                                      : "#9CA3AF", // gray
                                }}
                              ></div>
                              <span className="text-xs">
                                {page.title ?? "Select page"}
                              </span>
                            </div>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-slate-500"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-40" align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      router.push(
                                        `/app/${projectData?.ref}/editor/pages/landing/${page.id}`
                                      )
                                    }
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Open live page
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Share</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={() => handleDeletePage(page.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 py-3 flex justify-center">
                    <IoIosArrowDown className="w-4 h-4  rounded-full" />
                  </div>

                  <div className="w-full">
                    <div className="min-h-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-gray-900 ">
                        <div className="flex items-center gap-2">
                          <AppWindow className="h-4 w-4 text-gray-500" />
                          <p className="font-semibold">
                            {pages.quiz.title ?? "Unknown Tier"}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200" />
                      <div className="flex flex-col items-center gap-2 px-2 py-1">
                        {pages.quiz.mappings.map((page) => (
                          <div
                            key={page.id}
                            className="w-full flex items-center justify-between px-1 py-0.5 text-left text-sm font-medium text-gray-900 border hover:bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  background:
                                    page.status === "Published"
                                      ? "#22C55E" // green
                                      : "#9CA3AF", // gray
                                }}
                              ></div>
                              <span className="text-xs">
                                {page.title ?? "Select page"}
                              </span>
                            </div>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-slate-500"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-40" align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      router.push(
                                        `/app/${projectData?.ref}/editor/pages/quiz`
                                      )
                                    }
                                  >
                                    Edit
                                  </DropdownMenuItem>

                                  {/* <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={() => handleDeletePage(page.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem> */}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <DialogWrapper
                      trigger={
                        <div className=" cursor-pointer text-primary flex-shrink-0 py-3 flex justify-center gap-x-2 hover:text-primary">
                          <Cog className="w-4 h-4  rounded-full" />
                          <span className="text-xs font-medium">
                            Result logic
                          </span>
                        </div>
                      }
                      title="End logic"
                      description="Configure quiz end logic"
                      // icon={
                      //   <FaArrowsSplitUpAndLeft
                      //     className="text-purple-600"
                      //     size={20}
                      //   />
                      // }
                      className="max-w-[100vw] md:max-w-[50vw] w-full  md:max-h-[95vh] bg-white text-editor-foreground border-b border-editor-border shadow-md"
                    >
                      {/* Add page settings content here */}
                      <QuizEndLogicEditor resultPages={pages.result.mappings} />
                    </DialogWrapper>
                  </div>

                  <div className="w-full">
                    <div className="min-h-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-gray-900 ">
                        <div className="flex items-center gap-2">
                          <AppWindow className="h-4 w-4 text-gray-500" />
                          <p className="font-semibold">
                            {pages.result.title ?? "Unknown Tier"}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200" />
                      <div className="flex flex-col items-center gap-2 px-3 py-1">
                        {pages.result.mappings.map((page) => (
                          <div
                            key={page.id}
                            className="w-full flex items-center justify-between px-1 py-0.5 text-left text-sm font-medium text-gray-900 border hover:bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  background:
                                    page.status === "Published"
                                      ? "#22C55E" // green
                                      : "#9CA3AF", // gray
                                }}
                              ></div>
                              <span className="text-xs">
                                {page.title ?? "Select page"}
                              </span>
                            </div>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-slate-500"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-40" align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      router.push(
                                        `/app/${projectData?.ref}/editor/pages/result/${page.id}`
                                      )
                                    }
                                  >
                                    Edit
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={() => handleDeletePage(page.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Optionally, a message if not loading and no pages found (e.g., empty state)
                <div className="text-center text-sm text-gray-500 p-4">
                  No project pages found.
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}

function LoadingSuspense() {
  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch gap-4 animate-pulse">
      {/* Landing Page Group Skeleton */}
      <div className="w-full">
        <div className="min-h-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex w-full items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded-sm" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="border-t border-gray-200" />
          {/* Page Items */}
          <div className="flex flex-col items-center gap-2 px-3 py-1">
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300" />
                <div className="h-3 w-20 bg-gray-300 rounded" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-300" />
            </div>
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300" />
                <div className="h-3 w-24 bg-gray-300 rounded" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Arrow Down Separator Skeleton */}
      <div className="flex-shrink-0 py-3 flex justify-center">
        <div className="w-4 h-4 rounded-full bg-gray-200" />
      </div>

      {/* Questions Page Group Skeleton */}
      <div className="w-full">
        <div className="min-h-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex w-full items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded-sm" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="border-t border-gray-200" />
          {/* Page Items */}
          <div className="flex flex-col items-center gap-2 px-3 py-1">
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300" />
                <div className="h-3 w-28 bg-gray-300 rounded" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Result Logic Link Skeleton */}
      <div className="flex items-center justify-center">
        <div className="py-3 flex justify-center gap-x-2">
          <div className="h-4 w-4 rounded-full bg-primary/50" />
          <div className="h-3 w-20 bg-primary/50 rounded" />
        </div>
      </div>

      {/* Outcome Page Group Skeleton */}
      <div className="w-full">
        <div className="min-h-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex w-full items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded-sm" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="border-t border-gray-200" />
          {/* Page Items */}
          <div className="flex flex-col items-center gap-2 px-3 py-1">
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300" />
                <div className="h-3 w-24 bg-gray-300 rounded" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-300" />
            </div>
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300" />
                <div className="h-3 w-20 bg-gray-300 rounded" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
