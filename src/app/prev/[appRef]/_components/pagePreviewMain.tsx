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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IframeContent } from "@/app/(main)/app/[appRef]/editor/pages/_components/iframeCanvas";

//import EditorCanvas from "./editorCanvas";

type Props = {
  editorData: FetchEditorDataResponse;
  appRef: string;
  editorConfig: EditorConfig;
};

const PagePreviewMain = ({ editorData, appRef, editorConfig }: Props) => {
  const {
    livemode,
    projectData,
    isEditorLoading,
    sections,
    previewMode,
    reset,
    setLiveMode,
    setPreviewMode,
    setPageType,
    initialize,
    setSelectedSectionId,
    setActiveElementId,
    setEditingElementId,
  } = usePageBuilderStore();

  useEffect(() => {
    reset();
    setLiveMode(true);
    setPreviewMode(true);
    setPageType(editorConfig.pageType);

    if (editorData) {
      initialize(editorConfig, editorData);
    }
  }, [editorData, setLiveMode, setPageType]);

  return (
    <>
      <IframeContent />
    </>
  );
};

export default PagePreviewMain;
