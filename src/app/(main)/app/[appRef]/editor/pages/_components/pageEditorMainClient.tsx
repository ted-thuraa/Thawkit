"use client";
import { BookIcon, Loader2Icon, Plus, RouteIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { cn } from "@/lib/utils";
import Frame from "react-frame-component";
import React, { useEffect, useState } from "react";
import { DialogProvider } from "@/providers/dialog-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FetchEditorDataResponse } from "@/lib/querries/project";
import {
  EditorConfig,
  usePageBuilderStore,
} from "@/stores/pageEditorStore/store";
import LeftToolbar from "./editorLeftBar";
import RightToolbar from "./editorRightBar";
import { IframeContent } from "./iframeCanvas";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SectionTemplatesDialog from "./helpers/templatesDialog";

//import EditorCanvas from "./editorCanvas";

type Props = {
  editorData: FetchEditorDataResponse;
  appRef: string;
  editorConfig: EditorConfig;
};

const PageEditorMain = ({ editorData, appRef, editorConfig }: Props) => {
  const {
    livemode,
    projectData,
    isEditorLoading,
    sections,
    previewMode,
    reset,
    setLiveMode,
    setPageType,
    initialize,
    setSelectedSectionId,
    setActiveElementId,
    setEditingElementId,
  } = usePageBuilderStore();
  const [activeDevice, setActiveDevice] = useState<
    "Desktop" | "Tablet" | "Mobile"
  >("Desktop");
  const [zoom, setZoom] = useState<number>(100);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [currentPageUrl, setCurrentPageUrl] = useState("");
  const [currentPageId, setCurrentPageId] = useState("");
  const router = useRouter();

  const isMobile = useIsMobile();

  useEffect(() => {
    reset();
    setLiveMode(false);
    setPageType(editorConfig.pageType);

    if (editorData) {
      initialize(editorConfig, editorData);
    }
    if (editorConfig.pageType === "Result_Page") {
      //handleRunSimulation();
      //initialize(editorConfig, funnelPageDetails, toolDetails);
    }
  }, [editorData, setLiveMode, setPageType]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!livemode && !previewMode) {
      setSelectedSectionId(null);
      setActiveElementId(null);
      setEditingElementId(null);
    }
  };

  return (
    <>
      {isEditorLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center h-screen bg-gray-50">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        <div
          className="relative h-screen flex flex-1 flex-col gap-4 p-4"
          onClick={handleClick}
        >
          <div className="">
            {/* Left Toolbar */}
            <div className=" ">
              <LeftToolbar />
            </div>

            {/* Main Canvas Area */}
            <div className="relative flex items-center justify-center flex-1">
              <div className="relative w-[65rem] h-[90vh] mx-auto">
                {sections.length > 0 ? (
                  <>
                    <IframeContent />
                  </>
                ) : (
                  <div className="w-full h-full ">
                    <Empty className="max-w-4xl m-auto mt-14 bg-white border border-dashed">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <RouteIcon />
                        </EmptyMedia>
                        <EmptyTitle>No content on your page yet</EmptyTitle>
                        <EmptyDescription>
                          Add content to get started.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <div className="flex gap-2">
                          <Popover
                            open={isAddSectionOpen}
                            onOpenChange={setIsAddSectionOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                size="sm"
                                className="flex flex-row items-center"
                                onClick={() => setIsAddSectionOpen(true)}
                              >
                                <Plus />
                                Add content
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-96 absolute -top-[12rem] right-2 bg-white text-editor-foreground border-b border-editor-border shadow-md"
                              side="left"
                            >
                              <SectionTemplatesDialog
                                onCancel={() => setIsAddSectionOpen(false)}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </EmptyContent>
                    </Empty>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className=" ">
              <RightToolbar />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageEditorMain;
