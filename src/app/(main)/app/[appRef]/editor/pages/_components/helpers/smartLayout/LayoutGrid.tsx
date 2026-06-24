// File: src/components/SmartLayout/LayoutGrid.tsx
"use client";

import React, { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

import { SmartLayoutItem } from "./SmartLayoutItem";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

/**
 * Props for LayoutGrid component
 */
interface LayoutGridProps {
  section: ElementNode;
  content: ElementNode[] | any;
  isEditMode: boolean;
  activeElementId: string | null;
  onAddItem: () => void;
}

/**
 * Helper to generate flex basis classes based on column count
 * Assumes a gap-6 (1.5rem) as per the requested flex design
 */
const getFlexItemClasses = (columns: number = 3): string => {
  const baseClasses = "grow basis-full";

  // If 1 column, just full width
  if (columns === 1) return baseClasses;

  // For 2 columns: (100% - 1 gap) / 2
  if (columns === 2) {
    return cn(baseClasses, "md:basis-[calc((100%-1.5rem)/2)]");
  }

  // For 4 columns: Tablet 2 cols, Desktop 4 cols
  if (columns === 4) {
    return cn(
      baseClasses,
      "md:basis-[calc((100%-1.5rem)/2)]", // 2 cols on tablet
      "lg:basis-[calc((100%-4.5rem)/4)]" // 4 cols on desktop (3 gaps = 4.5rem)
    );
  }

  // Default to 3 columns: Tablet 2 cols, Desktop 3 cols
  return cn(
    baseClasses,
    "md:basis-[calc((100%-1.5rem)/2)]", // 2 cols on tablet
    "lg:basis-[calc((100%-3rem)/3)]" // 3 cols on desktop (2 gaps = 3rem)
  );
};

/**
 * LayoutGrid - Renders the grid/list of layout items
 * Handles switching between CSS Grid and Flexbox layouts
 */
export const LayoutGrid: React.FC<LayoutGridProps> = React.memo(
  ({ section, content, isEditMode, activeElementId, onAddItem }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { livemode, previewMode } = usePageBuilderStore();
    const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(
      null
    );

    // Early return if content is not an array
    if (!Array.isArray(content)) return null;

    const { settings } = section;
    const layoutMode = settings?.layout ? settings?.layout : "grid";
    const columns = settings?.grid_columns || 3;

    // Stable hover handlers
    const handleItemMouseEnter = useCallback(
      (index: number) => {
        if (isEditMode) setHoveredItemIndex(index);
      },
      [isEditMode]
    );

    const handleItemMouseLeave = useCallback(() => {
      if (isEditMode) setHoveredItemIndex(null);
    }, [isEditMode]);

    // 1. Compute Container Classes
    const containerClasses = useMemo(() => {
      const base = isEditMode ? "py-4" : "";

      if (layoutMode === "flex") {
        return cn(
          "flex flex-wrap gap-6 justify-start items-stretch", // Flex container styles
          base
        );
      }

      // Default Grid Implementation
      const gridCols =
        columns === 1
          ? "md:grid-cols-1"
          : columns === 2
            ? "md:grid-cols-2"
            : columns === 4
              ? "md:grid-cols-4"
              : "md:grid-cols-3";

      return cn("grid grid-cols-1 gap-8 md:gap-3 lg:gap-8", gridCols, base);
    }, [layoutMode, columns, isEditMode]);

    // 2. Compute Item Classes (Only needed for Flex mode)
    const flexItemClasses = useMemo(() => {
      if (layoutMode !== "flex") return "";
      return getFlexItemClasses(columns);
    }, [layoutMode, columns]);

    return (
      <ol className={containerClasses}>
        {content.map((item, index) => {
          const isItemActive = isEditMode && activeElementId === item.id;
          const isItemHovered = isEditMode && hoveredItemIndex === index;
          const isLastItem = index === content.length - 1;

          // If in flex mode, we merge the calculation classes into the item's className
          // This allows SmartLayoutItem to render the sizing correctly without modifying its source
          const renderedItem =
            layoutMode === "flex"
              ? { ...item, className: cn(item.className, flexItemClasses) }
              : item;

          return (
            <SmartLayoutItem
              key={item.id}
              item={renderedItem}
              index={index}
              section={section}
              isEditMode={isEditMode}
              isItemActive={isItemActive}
              isItemHovered={isItemHovered}
              isLastItem={isLastItem}
              onMouseEnter={handleItemMouseEnter}
              onMouseLeave={handleItemMouseLeave}
              onAddItem={onAddItem}
            />
          );
        })}
      </ol>
    );
  }
);

LayoutGrid.displayName = "LayoutGrid";
