import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";
import AdvancedTextEditor from "../helpers/TextEditor/richTextEditor";
import { HtmlParser } from "@/components/global/html-parser";

type Props = { element: ElementNode };

const StatsWithTextElement = ({ element }: Props) => {
  const {
    livemode,
    previewMode,
    categories,
    scoretiers,
    activeElementId,
    selectedSectionId,
    editingElementId,
    setEditingElementId,
    updateElementProperty,
    setActiveElementId,
  } = usePageBuilderStore();
  const { id, content, name, styles, className, type, layoutType, settings } =
    element;
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  const containerId = `statsbox-${id}`;
  const statsId = `statsbox-stat-${id}`;
  const titleId = `statsbox-title-${id}`;
  const descriptionId = `statsbox-description-${id}`;
  const isEditable = !livemode && !previewMode;
  // Container states
  const isContainerActive = isEditable && activeElementId === containerId;
  const isContainerHovered = isEditable && hoveredElementId === containerId;
  // stats states
  const isStatActive = isEditable && activeElementId === statsId;
  const isStatHovered = isEditable && hoveredElementId === statsId;
  // Title states
  const isTitleActive = isEditable && activeElementId === titleId;
  const isTitleHovered = isEditable && hoveredElementId === titleId;
  // Description states
  const isDescriptionActive = isEditable && activeElementId === descriptionId;
  const isDescriptionHovered = isEditable && hoveredElementId === descriptionId;

  const handleClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (isEditable) {
      setActiveElementId(elementId);
    }
  };

  // Generic mouse enter handler to update the local hover state.
  const handleMouseEnter = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (isEditable) {
      setHoveredElementId(elementId);
    }
  };

  // Generic mouse leave handler to clear the local hover state.
  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditable) {
      setHoveredElementId(null);
    }
  };

  // Debounced functions for updating content (logic remains the same).
  const createDebouncedPropertyUpdater = useCallback(
    (elementId: string, path: string) =>
      debounce((newValue: string) => {
        updateElementProperty(
          elementId,
          path,
          newValue,
          selectedSectionId as string
        );
      }, 500),
    [selectedSectionId, updateElementProperty]
  );

  const debouncedUpdateStat = useCallback(
    (newValue: string) => {
      createDebouncedPropertyUpdater(id, "content.innerText")(newValue);
    },
    [id, createDebouncedPropertyUpdater]
  );
  const debouncedUpdateTitle = useCallback(
    (newValue: string) => {
      createDebouncedPropertyUpdater(id, "content.title")(newValue);
    },
    [id, createDebouncedPropertyUpdater]
  );

  const debouncedUpdateDescription = useCallback(
    (newValue: string) => {
      createDebouncedPropertyUpdater(id, "content.description")(newValue);
    },
    [id, createDebouncedPropertyUpdater]
  );

  // Extract content safely
  const stat =
    !Array.isArray(content) && content.innerText ? content.innerText : "100%";
  const title =
    !Array.isArray(content) && content.title ? content.title : "Add text here";
  const description =
    !Array.isArray(content) && content.description
      ? content.description
      : "Add text here";

  return (
    <>
      {!Array.isArray(content) && (
        <div>
          <div
            className={cn(
              "focus:outline-none",
              isEditable &&
                "cursor-text transition-all duration-150 ease-in-out p-1", // Edit mode styles
              // Hover vs. Active styling logic is identical to the container's.
              isStatActive && "outline outline-2 outline-indigo-600 rounded-sm",
              isStatHovered &&
                !isStatActive &&
                "outline-dashed outline-1 outline-indigo-600 rounded-sm"
            )}
            onMouseEnter={(e) => handleMouseEnter(e, statsId)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(e, statsId)}
          >
            {isStatActive ? (
              <AdvancedTextEditor
                initialHtml={stat}
                onUpdate={(val) => {
                  if (!livemode) {
                    debouncedUpdateStat(val);
                  }
                }}
                className="block font-bold text-[48px] tracking-[-0.025em] leading-[1.1] "
              />
            ) : (
              <HtmlParser
                html={stat as string}
                isLive={false}
                editorContentClasses="block font-bold text-[48px] tracking-[-0.025em] leading-[1.1]"
              />
            )}
          </div>
          <div
            className={cn(
              "focus:outline-none",
              isEditable &&
                "cursor-text transition-all duration-150 ease-in-out p-1", // Edit mode styles
              // Hover vs. Active styling logic is identical to the container's.
              isTitleActive &&
                "outline outline-2 outline-indigo-600 rounded-sm",
              isTitleHovered &&
                !isTitleActive &&
                "outline-dashed outline-1 outline-indigo-600 rounded-sm"
            )}
            onMouseEnter={(e) => handleMouseEnter(e, titleId)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(e, titleId)}
          >
            {isTitleActive ? (
              <AdvancedTextEditor
                initialHtml={title}
                onUpdate={(val) => {
                  if (!livemode) {
                    debouncedUpdateTitle(val);
                  }
                }}
                className="block font-semibold text-[16px] text-left "
              />
            ) : (
              <HtmlParser
                html={title as string}
                isLive={false}
                editorContentClasses="block font-semibold text-[16px] text-left"
              />
            )}
          </div>
          <div
            className={cn(
              "focus:outline-none",
              isEditable &&
                "cursor-text transition-all duration-150 ease-in-out p-1", // Edit mode styles
              // Hover vs. Active styling logic is identical to the container's.
              isDescriptionActive &&
                "outline outline-2 outline-indigo-600 rounded-sm",
              isDescriptionHovered &&
                !isDescriptionActive &&
                "outline-dashed outline-1 outline-indigo-600 rounded-sm"
            )}
            onMouseEnter={(e) => handleMouseEnter(e, descriptionId)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(e, descriptionId)}
          >
            {isDescriptionActive ? (
              <AdvancedTextEditor
                initialHtml={description}
                onUpdate={(val) => {
                  if (!livemode) {
                    debouncedUpdateDescription(val);
                  }
                }}
                className="text-[14px] text-left "
              />
            ) : (
              <HtmlParser
                html={description as string}
                isLive={false}
                editorContentClasses="text-[14px] text-left"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StatsWithTextElement;
