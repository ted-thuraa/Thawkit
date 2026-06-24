// File: src/components/SmartLayout/SmartLayoutItem.tsx
"use client";

import React, { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Ellipsis, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { LayoutRenderer } from "./LayoutRenderer";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Lazy-load ItemStylist (only used in edit mode)
const ItemStylist = dynamic(
  () => import("../../elementTypes/elementUtils/itemStylist"),
  {
    ssr: false,
  }
);

/**
 * Props for SmartLayoutItem component
 */
interface SmartLayoutItemProps {
  item: ElementNode;
  index: number;
  section: ElementNode;
  isEditMode: boolean;
  isItemActive: boolean;
  isItemHovered: boolean;
  isLastItem: boolean;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  onAddItem: () => void;
}

/**
 * SmartLayoutItem - Individual layout item with editor controls
 * Memoized to prevent unnecessary re-renders
 *
 * @param {SmartLayoutItemProps} props - Component props
 * @returns {JSX.Element} Rendered layout item
 */
export const SmartLayoutItem: React.FC<SmartLayoutItemProps> = React.memo(
  ({
    item,
    index,
    section,
    isEditMode,
    isItemActive,
    isItemHovered,
    isLastItem,
    onMouseEnter,
    onMouseLeave,
    onAddItem,
  }) => {
    const { setActiveElementId } = usePageBuilderStore();

    // Stable click handler
    const handleItemClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isEditMode) {
          setActiveElementId(item.id);
        }
      },
      [isEditMode, setActiveElementId, item.id]
    );

    // Stable mouse enter handler
    const handleMouseEnter = useCallback(() => {
      onMouseEnter(index);
    }, [onMouseEnter, index]);

    // Stable add item handler
    const handleAddClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddItem();
      },
      [onAddItem]
    );

    // Show editor UI when item is active or hovered
    const showItemEditorUI = isEditMode && (isItemHovered || isItemActive);

    // Memoize item classes
    const itemClasses = useMemo(
      () =>
        cn(
          "relative list-none",
          item.className,
          isItemActive &&
            "outline-1 outline outline-indigo-600 outline-offset-2",
          isItemHovered &&
            !isItemActive &&
            "outline-1 outline-dashed outline-indigo-400 outline-offset-2",
          isEditMode && "cursor-pointer"
        ),
      [item.className, isItemActive, isItemHovered, isEditMode]
    );

    // Memoize item styles
    const itemStyles = useMemo(() => item.styles, [item.styles]);

    return (
      <li
        id={item.id}
        className={itemClasses}
        style={itemStyles}
        onClick={handleItemClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Item Editor Badge */}
        {showItemEditorUI && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                  aria-label="Edit Item"
                >
                  <Ellipsis className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-transparent p-0 z-[50] absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none">
                <ItemStylist section={section} item={item} index={index} />
              </PopoverContent>
            </Popover>
          </Badge>
        )}

        {/* Render the actual layout content */}
        <LayoutRenderer item={item} index={index} section={section} />

        {/* Add Item Button - Show only on the last item in edit mode */}
        {isEditMode && isLastItem && (
          <button
            onClick={handleAddClick}
            className="absolute -right-3 -bottom-3 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 border border-gray-300"
            aria-label="Add Item"
            title="Add Item"
          >
            <Plus className="h-4 w-4 text-indigo-600" />
          </button>
        )}
      </li>
    );
  },
  // Custom comparison function for better memoization
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.isItemActive === nextProps.isItemActive &&
      prevProps.isItemHovered === nextProps.isItemHovered &&
      prevProps.isLastItem === nextProps.isLastItem &&
      prevProps.isEditMode === nextProps.isEditMode &&
      prevProps.index === nextProps.index &&
      prevProps.item.className === nextProps.item.className &&
      prevProps.item.styles === nextProps.item.styles
    );
  }
);

SmartLayoutItem.displayName = "SmartLayoutItem";
