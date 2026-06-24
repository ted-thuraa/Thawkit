// Use the same imports as the original file
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Cog, MoreHorizontal } from "lucide-react";
import MediaStylist from "./elementUtils/mediaStylist";
import React, { useCallback, useState } from "react";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = { section: ElementNode };

const ImageComponent = ({ section }: Props) => {
  const { livemode, activeElementId, setActiveElementId, previewMode } =
    usePageBuilderStore();

  // The 'section' prop is the parent div_block
  const { id, className: containerClassName, content } = section;

  // State for editor UI
  const [isHovered, setIsHovered] = useState(false);

  if (Array.isArray(content)) {
    console.log(content);
    if (!livemode) {
      return <div>Error: Invalid Image component data.</div>;
    }
    return null;
  }

  const handleElementClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!livemode && !previewMode) {
        setActiveElementId(id);
      }
    },
    [livemode, previewMode, setActiveElementId, id]
  );

  const handleMouseEnter = useCallback(() => {
    if (!livemode && !previewMode) setIsHovered(true);
  }, [livemode, previewMode]);

  const handleMouseLeave = useCallback(() => {
    if (!livemode && !previewMode) setIsHovered(false);
  }, [livemode, previewMode]);

  const isSelected = !livemode && !previewMode && activeElementId === id;
  const showEditorUI = !livemode && !previewMode && (isHovered || isSelected);
  const imageSrc =
    content.src === "" ? "/assets/imageplaceholder.svg" : content.src;

  // The component's outermost element is now the container from the JSON data.
  // The editor UI outline is applied directly to it.
  return (
    <div
      className={cn(
        "relative w-full h-full",
        // Editor-specific classes are applied conditionally
        !livemode && !previewMode && "outline outline-2",
        {
          "outline-transparent": !showEditorUI && !isSelected,
          "outline-dashed outline-gray-400": showEditorUI && !isSelected,
          "outline-indigo-600": isSelected,
        }
      )}
      onClick={handleElementClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        pointerEvents: previewMode ? "none" : "auto",
      }}
    >
      {/* Editor UI Popover */}
      {showEditorUI && (
        <Badge
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent"
          onClick={(e) => {
            // e.stopPropagation();
            handleElementClick(e);
          }}
        >
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 hover:bg-gray-800 text-gray-100"
                title="Image Settings"
              >
                <Cog className="w-4 h-4 text-gray-200" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit h-fit flex items-center p-1">
              <MediaStylist section={section} />
            </PopoverContent>
          </Popover>
        </Badge>
      )}

      {/* Correctly rendered Next.js Image */}
      <Image
        onClick={handleElementClick}
        src={
          imageSrc === ""
            ? "/assets/imageplaceholder.svg"
            : (imageSrc as string)
        }
        alt={content.innerText?.trim() || "App Image"}
        width={content.width}
        height={content.height}
        className={section.className}
        style={section.styles}
      />
    </div>
  );
};

export default React.memo(ImageComponent);
