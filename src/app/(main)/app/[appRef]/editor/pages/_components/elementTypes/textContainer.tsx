"use client";
import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { ElementNode, MetaDynamicData } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AdvancedTextEditor from "../helpers/TextEditor/richTextEditor";
import { HtmlParser } from "@/components/global/html-parser";
import TextStylist from "./elementUtils/textStylist";

type Props = { section: ElementNode };

const TextComponent = ({ section }: Props) => {
  const {
    livemode,
    scoretiers,
    selectedSectionId,
    activeElementId,
    setActiveElementId,
    updateElementProperty,
    previewMode,
  } = usePageBuilderStore();

  // Lifted State: This component owns the currently selected tier
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const { id, content, settings, className, styles } = section;
  const uniqueTextId = `text-element-${id}`;
  const contentCanBeDynamic = settings?.contentCanBeDynamic
    ? settings?.contentCanBeDynamic
    : false;

  const isEditable = !livemode && !previewMode;
  const isEditing = isEditable && activeElementId === uniqueTextId;
  const isHovered = isEditable && hoveredItemId === uniqueTextId;

  // 1. Safety Check: Ensure selectedTierId is valid if dynamic is on
  useEffect(() => {
    if (
      settings?.contentCanBeDynamic &&
      !selectedTierId &&
      scoretiers.length > 0
    ) {
      // Default to the first tier (usually 'weakest' or 'low')
      setSelectedTierId(scoretiers[0].id);
    } else if (!settings?.contentCanBeDynamic && selectedTierId) {
      // Cleanup state if dynamic is turned off externally
      setSelectedTierId(null);
    }
  }, [settings?.contentCanBeDynamic, scoretiers, selectedTierId]);

  // 2. Calculate Display Content
  const displayContent = useMemo(() => {
    // Case A: Static Content
    if (!settings?.contentCanBeDynamic) {
      return !Array.isArray(content) ? content.innerText : "";
    }

    // Case B: Dynamic Content
    // We must find the specific content for the selected tier
    if (!Array.isArray(content) && Array.isArray(content.metaDynamic)) {
      const tierData = content.metaDynamic.find(
        (item) => item.score_tier_id === selectedTierId
      );

      // Fallback: If specific tier content is empty, use the main innerText or empty string
      return tierData?.content.innerText ?? content.innerText ?? "";
    }

    return "";
  }, [content, settings?.contentCanBeDynamic, selectedTierId]);

  // 3. Handle Content Updates (Typing in the Editor)
  const handleContentUpdate = useCallback(
    (newHtml: string) => {
      if (!id) return;

      if (settings?.contentCanBeDynamic && selectedTierId) {
        // Dynamic Update Strategy:
        // 1. Clone existing metaDynamic array
        // 2. Update specific index
        // 3. Push entire array back to store

        const currentMeta =
          !Array.isArray(content) && content.metaDynamic
            ? [...content.metaDynamic]
            : [];

        const tierIndex = currentMeta.findIndex(
          (m) => m.score_tier_id === selectedTierId
        );

        if (tierIndex >= 0) {
          // Update existing tier
          currentMeta[tierIndex] = {
            ...currentMeta[tierIndex],
            content: {
              ...currentMeta[tierIndex].content,
              innerText: newHtml,
            },
          };
        } else {
          // Edge Case: Tier missing in data? Add it.
          const tierName = scoretiers.find(
            (t) => t.id === selectedTierId
          )?.name;
          currentMeta.push({
            score_tier_id: selectedTierId,
            tierName: tierName,
            content: { innerText: newHtml },
          });
        }

        updateElementProperty(
          id,
          "content.metaDynamic",
          currentMeta,
          selectedSectionId as string
        );
      } else {
        // Static Update Strategy
        updateElementProperty(
          id,
          "content.innerText",
          newHtml,
          selectedSectionId as string
        );
      }
    },
    [
      id,
      selectedSectionId as string,
      selectedTierId,
      settings?.contentCanBeDynamic,
      content,
      scoretiers,
      updateElementProperty,
    ]
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditable || isEditing) return;
    setActiveElementId(uniqueTextId);
  };

  return (
    <div
      ref={componentRef}
      className={cn(
        "relative min-h-[1em] transition-all duration-200 cursor-text rounded-sm"
      )}
      onMouseEnter={() => isEditable && setHoveredItemId(uniqueTextId)}
      onMouseLeave={() => isEditable && setHoveredItemId(null)}
      onClick={handleClick}
    >
      <div
        className={cn(
          "absolute inset-0 h-full w-full rounded-md pointer-events-none",
          isEditing && "border-2 border-indigo-600",
          !isEditing &&
            isHovered &&
            isEditable &&
            "border-dashed border-2 border-gray-400"
        )}
      />

      {/* Settings Toolbar */}
      {(isEditing || isHovered) && isEditable && contentCanBeDynamic && (
        <div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <Badge className="rounded-none rounded-t-lg bg-transparent hover:bg-transparent p-0">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-center w-6 h-4 rounded-md bg-gray-800 border border-gray-600 text-gray-100 hover:bg-gray-700 shadow-sm">
                  <Ellipsis className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-none bg-transparent flex flex-col  items-center justify-center"
                side="top"
              >
                <TextStylist
                  element={section}
                  // Pass controlled state down
                  selectedTierId={selectedTierId}
                  onTierChange={setSelectedTierId}
                />
              </PopoverContent>
            </Popover>
          </Badge>
        </div>
      )}

      <div className={cn("w-full relative z-10", className)}>
        {isEditing ? (
          <AdvancedTextEditor
            // Key forces re-mount if we switch tiers, ensuring editor content refreshes immediately
            key={
              settings?.contentCanBeDynamic
                ? `dynamic-${selectedTierId}`
                : `static`
            }
            initialHtml={displayContent as string}
            onUpdate={handleContentUpdate}
            className={className}
            styles={styles}
          />
        ) : (
          <HtmlParser
            html={displayContent as string}
            isLive={false}
            editorContentClasses={className}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(TextComponent);
