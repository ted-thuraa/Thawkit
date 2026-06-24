"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";

import { Ellipsis, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import TextComponent from "./textContainer";
import ItemStylist from "./elementUtils/itemStylist";
import SmartLayoutStylist from "./elementUtils/smartLayoutStylist";
import { debounce } from "lodash";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = { section: ElementNode };

interface FaqItemProps {
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

const FaqItem: React.FC<FaqItemProps> = React.memo(
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
    const { id, content, styles, className, type, settings } = item;

    const faqTitle: ElementNode | undefined = Array.isArray(content)
      ? content.filter((s) => s.type === "faq_Item_Title")[0]
      : undefined;
    const faqDescription: ElementNode | undefined = Array.isArray(content)
      ? content.filter((s) => s.type === "faq_Item_Content")[0]
      : undefined;
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
          "relative rounded-2xl px-6 ",
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
      <AccordionItem
        id={item.id}
        value={`${item.type}-${index}`}
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

        <AccordionTrigger
          className={cn(
            "hover:no-underline  text-left py-5 text-sm md:text-base font-medium ",
            faqTitle?.className
          )}
        >
          <TextComponent section={faqTitle as ElementNode} />
        </AccordionTrigger>
        <AccordionContent
          className={cn(
            "pb-5 text-sm leading-relaxed",
            faqDescription?.className
          )}
        >
          <TextComponent section={faqDescription as ElementNode} />
        </AccordionContent>

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
      </AccordionItem>
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

const FaqLayoutContainer: React.FC<Props> = ({ section }: Props) => {
  const {
    livemode,
    previewMode,
    selectedSectionId,
    editingElementId,
    activeElementId, // <-- Get global active ID
    setEditingElementId,
    setActiveElementId,
    addLayoutItem,
    removeSection,
    duplicateSection,
    updateElementProperty,
    removeSmartLayoutItem,
  } = usePageBuilderStore();

  const { id, content, name, styles, className, type, layoutType, settings } =
    section;
  const [isLayoutHovered, setIsLayoutHovered] = useState(false);

  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);

  const faqContainerRef = useRef<HTMLDivElement>(null);

  //const isLayoutHovered = isEditable && hoveredElementId === layoutId;
  const columns = settings?.grid_columns || 3;
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
    //const newNode = createNewLayoutItem();
    //addLayoutItem(id, newNode);
  }, [isEditMode, id, addLayoutItem]);

  const handleLayoutMouseEnter = useCallback(() => {
    if (isEditMode) setIsLayoutHovered(true);
  }, [isEditMode]);

  const handleLayoutMouseLeave = useCallback(() => {
    if (isEditMode) setIsLayoutHovered(false);
  }, [isEditMode]);

  const handleItemMouseEnter = useCallback(
    (index: number) => {
      if (isEditMode) setHoveredItemIndex(index);
    },
    [isEditMode]
  );

  const handleItemMouseLeave = useCallback(() => {
    if (isEditMode) setHoveredItemIndex(null);
  }, [isEditMode]);

  const accordionClasses = useMemo(() => {
    const base = isEditMode ? "py-4" : "";

    // Default Grid Implementation
    const gridCols =
      columns === 1
        ? "md:grid-cols-1"
        : columns === 2
          ? "md:grid-cols-2"
          : columns === 4
            ? "md:grid-cols-4"
            : "md:grid-cols-3";

    return cn(
      "relative w-full  grid grid-cols-1 gap-2 md:gap-3 lg:gap-4",
      className,
      gridCols,
      isLayoutActive && "outline-1 outline outline-indigo-600 outline-offset-2",
      isChildActive &&
        "outline-1 outline-dashed outline-indigo-400 outline-offset-2",
      isLayoutHovered &&
        !isLayoutActive &&
        !isChildActive &&
        "outline-1 outline-dashed outline-indigo-400 outline-offset-2",
      isEditMode && "cursor-pointer",
      base
    );
  }, [
    className,
    isLayoutActive,
    isChildActive,
    isLayoutHovered,
    columns,
    isEditMode,
  ]);

  return (
    <Accordion
      type="single"
      collapsible
      className={accordionClasses}
      style={styles}
      defaultValue=""
      onClick={handleLayoutClick}
      onMouseEnter={handleLayoutMouseEnter}
      onMouseLeave={handleLayoutMouseLeave}
    >
      {/* Layout Editor Badge */}
      {showLayoutEditorUI && (
        <Badge className="absolute  -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
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
      {Array.isArray(content) &&
        content.map((item, index) => {
          const isItemActive = isEditMode && activeElementId === item.id;
          const isItemHovered = isEditMode && hoveredItemIndex === index;
          const isLastItem = index === content.length - 1;

          return (
            <FaqItem
              key={item.id}
              item={item}
              index={index}
              section={section}
              isEditMode={isEditMode}
              isItemActive={isItemActive}
              isItemHovered={isItemHovered}
              isLastItem={isLastItem}
              onMouseEnter={handleItemMouseEnter}
              onMouseLeave={handleItemMouseLeave}
              onAddItem={handleAddItem}
            />
          );
        })}
    </Accordion>
  );
};

export default React.memo(FaqLayoutContainer);
