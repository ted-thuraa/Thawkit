// components/editor/question/MediaRenderer.tsx
"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import MediaPicker from "../mediaEditor";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { QuestionField } from "@/stores/pageEditorStore/types";
import { authClient } from "@/lib/auth/auth-client";
import { LoadingSuspense } from "@/components/global/loadingSuspense";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { LoadingSpin } from "@/components/global/loadingSpin";

// Dynamically import ReactPlayer to prevent it from being included in the main bundle.
// This is crucial for performance as it's a large library.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const useMediaRendererState = () =>
  usePageBuilderStore(
    useShallow((state) => ({
      livemode: state.livemode,
      previewMode: state.previewMode,
    }))
  );

type Props = {
  settings: QuestionField["settings"];
  onMediaChange: (newSrc: string) => void;
};

const MediaRenderer = ({ settings, onMediaChange }: Props) => {
  const {
    data: activeOrganization,
    error: getActiveOrgError,
    isPending: isActiveOrgLoading,
  } = authClient.useActiveOrganization();

  // Handle Loading State
  if (isActiveOrgLoading) {
    return (
      <div className="w-full h-full">
        <LoadingSpin />
      </div>
    );
  }

  if (getActiveOrgError) {
    return (
      <div className="p-10 text-center text-red-500">
        <p>An error ocurred.</p>
        <p>Please refresh the page or try again later.</p>
      </div>
    );
  }

  if (!activeOrganization) return null;

  const { livemode, previewMode } = useMediaRendererState();
  const { media_type, media_url } = settings || {};

  if (!media_type) return null;

  const isEditorMode = !livemode && !previewMode;

  const editorTrigger = (content: React.ReactNode) => (
    <div className="group/questionMedia relative">
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/questionMedia:opacity-100 rounded-md z-10">
        <Pencil className="h-4 w-4 text-white" />
      </div>
      {content}
    </div>
  );

  const renderImage = () => (
    <Image
      src={media_url || "/assets/imageplaceholder.svg"}
      alt="Question media"
      className="w-full h-[420px] rounded-sm object-cover"
      width={400}
      height={400}
    />
  );

  const renderVideo = () => (
    <div className="aspect-video w-full">
      <ReactPlayer
        url={media_url}
        width="100%"
        height="100%"
        controls={true}
        light={true}
        playing={false}
        config={{
          youtube: { playerVars: { showinfo: 1 } },
          vimeo: { playerOptions: { title: true } },
        }}
      />
    </div>
  );

  if (isEditorMode) {
    return (
      <div className="w-full block items-center justify-center">
        <MediaPicker
          organizationId={activeOrganization.id}
          mediaType={media_type}
          mediaSource={media_type === "image" ? "upload" : "url"}
          mediaSrc={media_url as string}
          mediaOptions={media_type === "image" ? "image_only" : "video_only"}
          onMediaChange={onMediaChange}
          editorTrigger={editorTrigger(
            media_type === "image" ? renderImage() : renderVideo()
          )}
        />
      </div>
    );
  }

  // Render for live/preview mode
  return (
    <div className="relative w-full block items-center justify-center">
      {media_type === "image" ? renderImage() : renderVideo()}
    </div>
  );
};

export default React.memo(MediaRenderer);
