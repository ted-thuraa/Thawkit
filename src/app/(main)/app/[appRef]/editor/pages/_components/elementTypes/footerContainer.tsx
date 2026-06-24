"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import {
  Copy,
  Eye,
  GitFork,
  Palette,
  Plus,
  Settings,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { DialogProvider } from "@/providers/dialog-provider";
import Switcher from "../recursiveComponent";
import SectionStylist from "./elementUtils/sectionContainerUtil";
import VisibilityLogicEditor from "../helpers/resultPageSectionVisibilityLogic";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DialogWrapper from "@/wrappers/dialog-wrapper";

type Props = { section: ElementNode };

const FooterContainer = ({ section }: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    livemode,
    selectedSectionId,
    activeElementId,
    theme,
    setEditingElementId,
    removeSection,
    setSelectedSectionId,
    setActiveElementId,
    duplicateSection,
    toggleSectionVisibility,
    previewMode,
  } = usePageBuilderStore();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isRowHovered, setRowIsHovered] = useState<boolean>(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const { id, content, name, styles, className, type, settings } = section;

  const isSelected = !livemode && !previewMode && selectedSectionId === id;
  const showEditorUI = !livemode && !previewMode && (isHovered || isSelected);

  useEffect(() => {
    if (
      selectedSectionId === section.id &&
      sectionRef.current &&
      !previewMode
    ) {
      // Use requestAnimationFrame to ensure the calculations happen after any pending renders
      requestAnimationFrame(() => {
        if (sectionRef.current) {
          // Double-check ref inside rAF
          const NAVBAR_HEIGHT = 72; // Height of the navbar (4.5rem)
          const PADDING_TOP = 16; // Additional padding desired below the navbar (1rem)

          // Get the iframe's window object. sectionRef.current is an element within the iframe.
          const iframeWindow = sectionRef.current.ownerDocument.defaultView;

          if (iframeWindow) {
            const elementRect = sectionRef.current.getBoundingClientRect();
            const currentScrollY = iframeWindow.scrollY;

            // Calculate the element's absolute top position within the iframe's document
            const elementAbsoluteTop = currentScrollY + elementRect.top;

            // Calculate the target scroll position for the iframe window.
            // We want the element's top to be visible at NAVBAR_HEIGHT + PADDING_TOP from the viewport's top.
            const targetScrollY =
              elementAbsoluteTop - NAVBAR_HEIGHT - PADDING_TOP;

            iframeWindow.scrollTo({
              top: targetScrollY,
              behavior: "smooth",
            });
          }
        }
      });
    }
  }, [selectedSectionId, section.id, previewMode]);

  const handleRemoveSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewMode) {
      removeSection(section.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!livemode && !previewMode) {
      setSelectedSectionId(id);
      setActiveElementId(null);
      setEditingElementId(null);
    }
  };

  const handleMouseEnter = useCallback(() => {
    if (!livemode && !previewMode) {
      setIsHovered(true);
    }
  }, [livemode, previewMode]);

  const handleMouseLeave = useCallback(() => {
    if (!livemode && !previewMode) {
      setIsHovered(false);
    }
  }, [livemode, previewMode]);

  const isSectionSelected =
    !livemode && !previewMode && selectedSectionId === section.id;
  // Determine if a direct child element is active (adjust selector if needed)
  const isChildActive =
    !livemode &&
    !previewMode &&
    activeElementId !== null &&
    sectionRef.current?.querySelector(`[id="${activeElementId}"]`);

  // --- Determine Background Properties ---
  const backgroundType = settings?.backgroundType ?? "color"; // Default to color
  const backgroundValue = settings?.backgroundValue;
  const defaultBackgroundColor = theme.colors.background.page; // Get default from theme
  const overlayColor = settings?.overlayColor;
  const overlayEffect = settings?.overlayEffect ?? "none";
  const bgIsMedia =
    section.settings?.backgroundType === "image" ||
    section.settings?.backgroundType === "video";

  const showOverlay = bgIsMedia && overlayColor && overlayEffect !== "none";
  // Determine the actual color to apply if type is 'color'
  const effectiveBackgroundColor =
    backgroundType === "color" && backgroundValue
      ? backgroundValue
      : defaultBackgroundColor;

  return (
    <>
      {section.isHidden !== true && (
        <footer
          ref={sectionRef}
          className={cn("relative   w-full", "focus:outline-none", {
            "outline-transparent": !showEditorUI && !isSelected, // Fully transparent when not hovered or selected
            "outline-dashed outline-2  outline-gray-400 rounded-sm":
              showEditorUI && !isSelected, // Lighter solid indigo on hover (but not selected)
            " outline outline-2  outline-indigo-600 rounded-sm": isSelected, // Darker solid indigo when selected
          })}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{
            pointerEvents: previewMode ? "none" : "auto",
          }}
        >
          {showEditorUI && (
            <div
              className={cn(
                "absolute z-40 right-2 top-3 left-2 -translate-y-1/3 tr transition-opacity",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="flex flex-row flex-nowrap justify-between text-black">
                <div className="flex flex-row flex-nowrap space-x-1.5 bg-card shadow-md rounded-md">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-md hover:bg-muted">
                        <Palette className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[18rem] p-2 absolute -left-4">
                      <SectionStylist section={section} />
                    </PopoverContent>
                  </Popover>

                  <DialogWrapper
                    trigger={
                      <button className="p-2 rounded-md hover:bg-muted">
                        <Settings className="h-4 w-4" />
                      </button>
                    }
                    title="Section Visibility "
                    description="Edit section visibility Logic"
                    // icon={<GitFork className="text-purple-600" size={20} />}
                    className=" min-w-[50vw] max-w-md w-fit h-fit bg-editor-component text-editor-foreground border-b border-editor-border  rounded-xl shadow-md border border-slate-200"
                  >
                    {/* Add page settings content here */}
                    <VisibilityLogicEditor section={section} />
                  </DialogWrapper>
                </div>
                <div className="flex flex-row flex-nowrap space-x-1.5 bg-card shadow-md rounded-md">
                  <button
                    className="p-2 rounded-md hover:bg-muted"
                    onClick={() => duplicateSection(section.id)}
                    title="Duplicate section"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-md hover:bg-muted"
                    onClick={() => toggleSectionVisibility(section.id)}
                    title={
                      section.isHidden === false
                        ? "Show section"
                        : "Hide section"
                    }
                  >
                    <Eye className={cn("w-4 h-4")} />
                  </button>
                  <button
                    className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-md"
                    onClick={handleRemoveSection}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* content container */}
          <div
            className={cn(
              "relative z-10 mx-auto flex flex-col  py-14   max-w-6xl"

              // {
              //   "max-w-7xl ": settings?.section_full_bleed,
              // }
            )}
            style={
              {
                ...styles,
                justifyContent:
                  settings?.itemsVerticalAlignment ?? "flex-start",
              } as React.CSSProperties
            }
          >
            {Array.isArray(content) &&
              content.map((childsection) => (
                <Switcher key={childsection.id} section={childsection} />
              ))}
          </div>
        </footer>
      )}
    </>
  );
};

export default FooterContainer;
