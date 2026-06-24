"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import React, { useState } from "react";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";
import MediaStylist from "./elementUtils/mediaStylist";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Props = { section: ElementNode };

const VideoComponent = ({ section }: Props) => {
  const { livemode, selectedSectionId, activeElementId, setActiveElementId } =
    usePageBuilderStore();
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const { id, content, styles, className } = section;

  return (
    <div
      className={cn("relative")}
      onMouseEnter={() => setHoveredElementId(id)}
      onMouseLeave={() => setHoveredElementId(null)}
    >
      {(hoveredElementId === id || activeElementId === id) && (
        <Badge className="absolute top-[0px] left-1/2 rounded-none rounded-t-lg ">
          <Popover>
            <PopoverTrigger asChild>
              <button
                onClick={() => setActiveElementId(id)}
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
              >
                <Ellipsis className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-2 absolute -left-12 -top-16">
              <MediaStylist section={section} />
            </PopoverContent>
          </Popover>
        </Badge>
      )}
      {!Array.isArray(content) && (
        <div className={cn("aspect-video w-full", className)} style={styles}>
          <ReactPlayer
            url={content.src}
            width="100%"
            height="100%"
            controls={true}
            light={content.src} // Optional thumbnail
            playing={false} // Don't autoplay by default
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
              vimeo: {
                playerOptions: { title: true },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoComponent);
