"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { v4 } from "uuid";

import { Cog, Copy, Eye, Palette, Plus, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { debounce } from "lodash";
import ButtonStylist from "./elementUtils/buttonStylist";
import ButtonLayoutStylist from "./elementUtils/buttonLayoutStylist";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { THEME_CLASSES } from "@/lib/constants/theme";
import { ButtonWrapper } from "./scopes/btnWrapper";

type Props = { section: ElementNode };

const ButtonItem: React.FC<Props> = ({ section }: Props) => {
  const {
    livemode,
    sections,
    theme,
    activeElementId,
    addLayoutItem,
    setActiveElementId,
    addBtnItem,
    updateElementProperty,
    previewMode,
    selectedSectionId,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const { id, content, name, styles, className, type, settings } = section;
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);

  const handleAddItem = useCallback(() => {
    if (livemode || previewMode) return;
    const newNode: ElementNode = {
      id: v4(),
      styles: {},
      className:
        " inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
      name: "",
      type: "button_item",
      isHidden: false,
      settings: {
        btn_action: "go_to_questions",
        btn_style: "default",
      },
      content: {
        href: "/questions",
        innerText: "Button Text",
      },
    };
    addLayoutItem(section.id, newNode);
  }, [section.id, selectedSectionId, addBtnItem, previewMode]);

  const handleBtnTextUpdate = debounce((btn_Id: string, value: string) => {
    if (selectedSectionId && btn_Id && !previewMode) {
      updateElementProperty(
        selectedSectionId,
        btn_Id,
        "content.innerText",
        value
      );
    }
    return;
  }, 300);

  const handleBtnClick = useCallback(
    (e: React.MouseEvent, itemId: string) => {
      e.stopPropagation(); // Prevent bubbling
      if (!livemode && !previewMode) {
        setActiveElementId(itemId); // Set this element as active
      }
    },
    [livemode, previewMode, setActiveElementId, id]
  );

  const handleBtnMouseEnter = useCallback(
    (index: number) => {
      if (!livemode && !previewMode) {
        setIsBtnHovered(true);
        setHoveredItemIndex(index);
      }
    },
    [livemode, setActiveElementId, previewMode]
  );

  const handleBtnMouseLeave = useCallback(() => {
    if (!livemode && !previewMode) {
      setIsBtnHovered(false);
      setHoveredItemIndex(null);
    }
  }, [livemode, previewMode]);

  // --- State Checks ---

  if (!Array.isArray(section.content)) return null;

  return (
    <>
      {section.content.map((btn_item, index) => {
        const isSelectedBtn = !livemode && activeElementId === btn_item.id;
        const isItemHovered = !livemode && hoveredItemIndex === index;
        const showBtnEditorUI = !livemode && (isItemHovered || isSelectedBtn);
        // Logic: Use element override -> fallback to global primary -> fallback to black (safety)
        // We need the raw HEX string for the contrast math to work.
        const isOutline = btn_item.settings?.btn_style === "outline";

        const effectiveBgColor =
          btn_item.styles?.backgroundColor ||
          theme.colors?.palette?.primary ||
          "#000000";

        // For outline buttons, the "background" that determines text contrast
        // is actually the PAGE background (or card background), not the button's border.
        // So for outline, we might want to skip defining a new scope or set it to transparent.
        const scopeBg = isOutline ? undefined : effectiveBgColor;

        return (
          <div
            key={btn_item.id}
            className={cn("relative", {
              "outline-transparent": !showBtnEditorUI && !isSelectedBtn, // Fully transparent when not hovered or selected
              "outline-dashed outline-indigo-400":
                showBtnEditorUI && !isSelectedBtn, // Lighter solid indigo on hover (but not selected)
              " outline-indigo-600": isSelectedBtn, // Darker solid indigo when selected
            })}
            onClick={(e) => handleBtnClick(e, btn_item.id)}
            onMouseEnter={() => handleBtnMouseEnter(index)}
            onMouseLeave={handleBtnMouseLeave}
            style={{
              pointerEvents: previewMode ? "none" : "auto",
            }}
          >
            {showBtnEditorUI && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      //onClick={(e) => e.stopPropagation()} // Prevent badge click from deselecting
                      className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                      aria-label="Edit Layout"
                    >
                      <Cog className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <ButtonStylist
                      section={section}
                      btn={btn_item}
                      index={index}
                    />
                  </PopoverContent>
                </Popover>
                {/* <PopoverProvider
                  trigger={
                    <button
                      
                      className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                      aria-label="Edit Layout"
                    >
                      <Cog className="w-4 h-4" />
                    </button>
                  }
                  className="w-auto bg-transparent p-0 z-[50]  absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none "
                >
                  <ButtonLayoutStylist section={section} />
                </PopoverProvider> */}
              </Badge>
            )}
            <ButtonWrapper
              as={Button} // Render as the Shadcn Button
              bgColor={scopeBg}
              className={cn(
                btn_item.className,
                "w-fit h-8 px-4 py-2 tracking-[0.025em] leading-[1.5em]  inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                {
                  [THEME_CLASSES.button]: !isOutline,
                  [THEME_CLASSES.buttonOutline]: isOutline,
                }
              )}
              style={{
                ...btn_item.styles,
                color: btn_item.styles?.color || "var(--theme-heading-color)",
                // Allow ThemeScope to handle background for solid buttons
                backgroundColor: isOutline ? "transparent" : undefined,
              }}
            >
              <span
                style={{
                  color: btn_item.styles?.color || "inherit",
                }}
                className="cursor-text"
                contentEditable={!livemode && !previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const spanElement = e.target as HTMLSpanElement;
                  handleBtnTextUpdate(btn_item.id, spanElement.innerText);
                }}
              >
                {!Array.isArray(btn_item.content) && btn_item.content.innerText}
              </span>
            </ButtonWrapper>
          </div>
        );
      })}
    </>
  );
};

const ButtonComponent: React.FC<Props> = ({ section }: Props) => {
  const {
    livemode,
    sections,
    activeElementId,
    addLayoutItem,
    setActiveElementId,
    addBtnItem,
    updateElementProperty,
    previewMode,
    selectedSectionId,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const { id, content, name, styles, className, type, settings } = section;
  const [isHovered, setIsHovered] = useState(false);
  const [isLayoutHovered, setIsLayoutHovered] = useState(false);

  const handleBtnTextUpdate = debounce((btn_Id: string, value: string) => {
    if (selectedSectionId && btn_Id && !previewMode) {
      updateElementProperty(
        selectedSectionId,
        btn_Id,
        "content.innerText",
        value
      );
    }
    return;
  }, 300);

  const handleLayoutClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent bubbling
      if (!livemode && !previewMode) {
        setActiveElementId(id); // Set this element as active
      }
    },
    [livemode, previewMode, setActiveElementId, id]
  );

  const handleLayoutMouseEnter = useCallback(() => {
    if (!livemode && !previewMode) {
      setIsHovered(true);
    }
  }, [livemode, setActiveElementId, previewMode]);

  const handleLayoutMouseLeave = useCallback(() => {
    if (!livemode && !previewMode) {
      setIsHovered(false);
    }
  }, [livemode, previewMode]);

  // --- State Checks ---
  const isSelectedLayout = !livemode && activeElementId === id;
  const showLayoutEditorUI = !livemode && (isLayoutHovered || isSelectedLayout);
  return (
    <>
      <div
        //ref={containerRef}
        className={cn(
          "relative  flex flex-col md:flex-row  sm:items-stretch gap-4 md:gap-[12px]  ",
          " outline-1",
          className,
          {
            "items-center justify-start":
              section.settings?.itemsHorizontalAlignment === "flex-start",
            "items-center justify-center":
              section.settings?.itemsHorizontalAlignment === "center",
            "items-center justify-end":
              section.settings?.itemsHorizontalAlignment === "flex-end",
          },
          {
            "outline-transparent": !showLayoutEditorUI && !isSelectedLayout, // Fully transparent when not hovered or selected
            "outline-dashed outline-indigo-400":
              showLayoutEditorUI && !isSelectedLayout, // Lighter solid indigo on hover (but not selected)
            " outline-indigo-600": isSelectedLayout, // Darker solid indigo when selected
          }
        )}
        onClick={handleLayoutClick}
        onMouseEnter={handleLayoutMouseEnter}
        onMouseLeave={handleLayoutMouseLeave}
        style={{
          pointerEvents: previewMode ? "none" : "auto",
        }}
      >
        {showLayoutEditorUI && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  //onClick={(e) => e.stopPropagation()} // Prevent badge click from deselecting
                  className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                  aria-label="Edit Layout"
                >
                  <Cog className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-transparent p-0 z-[50]  absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none ">
                <ButtonLayoutStylist section={section} />
              </PopoverContent>
            </Popover>
          </Badge>
        )}
        <ButtonItem section={section} />
      </div>
    </>
  );
};

export default React.memo(ButtonComponent);
