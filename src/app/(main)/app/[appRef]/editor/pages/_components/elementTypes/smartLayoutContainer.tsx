// File: src/components/SmartLayoutContainer.tsx
"use client";

import React, { useCallback, useMemo, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import dynamic from "next/dynamic";
import { createNewLayoutItem } from "../helpers/smartLayout/layoutHelpers";
import { LayoutGrid } from "../helpers/smartLayout/LayoutGrid";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Lazy-load heavy editor components
const SmartLayoutStylist = dynamic(
  () => import("./elementUtils/smartLayoutStylist"),
  { ssr: false }
);

// Import subcomponents

/**
 * Props for SmartLayoutContainer component
 */
interface SmartLayoutContainerProps {
  section: ElementNode;
}

/**
 * Theme configuration for layout styling
 */
export interface LayoutTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export const theme: LayoutTheme = {
  primary: "bg-indigo-600",
  secondary: "bg-indigo-500",
  background: "bg-navy-900",
  text: "text-white",
  accent: "bg-indigo-400",
};

/**
 * SmartLayoutContainer - Main container component for smart layouts
 * Renders a configurable grid/list of layout items with editor controls
 *
 * @param {SmartLayoutContainerProps} props - Component props
 * @returns {JSX.Element} Rendered smart layout container
 */
const SmartLayoutContainer: React.FC<SmartLayoutContainerProps> = ({
  section,
}) => {
  // Extract store actions and state
  const {
    livemode,
    previewMode,
    activeElementId,
    setActiveElementId,
    addLayoutItem,
  } = usePageBuilderStore();

  // Destructure section properties
  const { id, content, className, styles, settings } = section;

  // Local hover state
  const [isLayoutHovered, setIsLayoutHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute derived state with useMemo
  const isEditMode = useMemo(
    () => !livemode && !previewMode,
    [livemode, previewMode]
  );
  const isLayoutActive = useMemo(
    () => isEditMode && activeElementId === id,
    [isEditMode, activeElementId, id]
  );

  const isChildActive = useMemo(() => {
    if (!isEditMode || !activeElementId || !Array.isArray(content))
      return false;
    return content.some((item) => item.id === activeElementId);
  }, [isEditMode, activeElementId, content]);

  const showLayoutEditorUI = useMemo(
    () => isEditMode && (isLayoutHovered || isLayoutActive),
    [isEditMode, isLayoutHovered, isLayoutActive]
  );

  // Stable event handlers
  const handleLayoutClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isEditMode) {
        setActiveElementId(id);
      }
    },
    [isEditMode, setActiveElementId, id]
  );

  const handleAddItem = useCallback(() => {
    if (!isEditMode || !id) return;
    const newNode = createNewLayoutItem();
    addLayoutItem(id, newNode);
  }, [isEditMode, id, addLayoutItem]);

  const handleLayoutMouseEnter = useCallback(() => {
    if (isEditMode) setIsLayoutHovered(true);
  }, [isEditMode]);

  const handleLayoutMouseLeave = useCallback(() => {
    if (isEditMode) setIsLayoutHovered(false);
  }, [isEditMode]);

  // Memoize container classes
  const containerClasses = useMemo(
    () =>
      cn(
        "relative min-w-full",
        className,
        isLayoutActive &&
          "outline-1 outline outline-indigo-600 outline-offset-2",
        isChildActive &&
          "outline-1 outline-dashed outline-indigo-400 outline-offset-2",
        isLayoutHovered &&
          !isLayoutActive &&
          !isChildActive &&
          "outline-1 outline-dashed outline-indigo-400 outline-offset-2",
        isEditMode && "cursor-pointer"
      ),
    [className, isLayoutActive, isChildActive, isLayoutHovered, isEditMode]
  );

  return (
    <div
      ref={containerRef}
      id={id}
      className={containerClasses}
      style={styles}
      onClick={handleLayoutClick}
      onMouseEnter={handleLayoutMouseEnter}
      onMouseLeave={handleLayoutMouseLeave}
    >
      {/* Layout Editor Badge */}
      {showLayoutEditorUI && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                aria-label="Edit Layout"
              >
                <Ellipsis className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-transparent p-0 z-[50] absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none">
              <SmartLayoutStylist section={section} />
            </PopoverContent>
          </Popover>
        </Badge>
      )}

      {/* Grid of layout items */}
      <LayoutGrid
        section={section}
        content={content}
        isEditMode={isEditMode}
        activeElementId={activeElementId}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(SmartLayoutContainer);
