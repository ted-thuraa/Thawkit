"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";

import {
  Copy,
  Eye,
  GitFork,
  Palette,
  Plus,
  Settings,
  Settings2,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";

import Image from "next/image";
import { DialogProvider } from "@/providers/dialog-provider";
import { Button } from "@/components/ui/button";
import Switcher from "../recursiveComponent";
import SectionStylist from "./elementUtils/sectionContainerUtil";
import SectionTemplatesDialog from "../helpers/templatesDialog";
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

const SectionContainer = ({ section }: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    livemode,
    pageType,
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
    //e.stopPropagation();
    if (!livemode && !previewMode) {
      setSelectedSectionId(id);
      setActiveElementId(id);
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

  // This is the key part for recursion.
  // The `content` array's reference stability depends on how it was created
  // in the parent's data structure (your Zustand store).
  // If `content` were being created or modified here, you'd use useMemo.
  const childSections = useMemo(() => {
    if (Array.isArray(content)) {
      return content;
    }
    return [];
  }, [content]);

  return (
    <>
      {section.isHidden !== true && (
        <section
          ref={sectionRef}
          id={id}
          className={cn("relative  w-full")}
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
              <div className="flex flex-row flex-nowrap justify-between ">
                <div className="h-6 py-2 px-2 flex flex-row items-center justify-center flex-nowrap space-x-3 text-white bg-[#2463eb] hover:bg-[#2463eb] shadow-md rounded-md">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="p-0 rounded-md ">
                        <Settings2 className="w-4 h-4" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[18rem] p-2 absolute -left-4">
                      <SectionStylist section={section} />
                    </PopoverContent>
                  </Popover>

                  {pageType === "Result_Page" && (
                    <DialogWrapper
                      trigger={
                        <div className="p-0 rounded-md ">
                          <Settings className="h-4 w-4" />
                        </div>
                      }
                      title="Section Visibility "
                      description="Edit section visibility Logic"
                      // icon={<GitFork className="text-purple-600" size={20} />}
                      className=" min-w-[50vw] max-w-md w-fit h-fit bg-editor-component text-editor-foreground border-b border-editor-border  rounded-xl shadow-md border border-slate-200"
                    >
                      {/* Add page settings content here */}
                      <VisibilityLogicEditor section={section} />
                    </DialogWrapper>
                  )}
                </div>
                <div className="h-6 py-2 px-2 flex flex-row items-center justify-center flex-nowrap space-x-1 text-white bg-[#2463eb] hover:bg-[#2463eb] shadow-md rounded-md">
                  <Button
                    className="p-0 rounded-md w-fit"
                    onClick={() => duplicateSection(section.id)}
                    title="Duplicate section"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    className="p-0 rounded-md w-fit"
                    onClick={() => toggleSectionVisibility(section.id)}
                    title={
                      section.isHidden === false
                        ? "Show section"
                        : "Hide section"
                    }
                  >
                    <Eye className={cn("w-4 h-4")} />
                  </Button>
                  <Button
                    className="p-0 w-fit  hover:text-destructive rounded-md"
                    onClick={handleRemoveSection}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Background image and overlay */}
          {/* --- Background & Overlay Container --- */}
          <div
            className="absolute inset-0 z-0 overflow-hidden" // Positioned behind content
            style={{
              backgroundColor:
                backgroundType === "color"
                  ? effectiveBackgroundColor
                  : undefined,
            }}
          >
            {/* Background Image */}
            {backgroundType === "image" && backgroundValue && (
              <Image
                key={backgroundValue} // Add key for re-render on change
                src={backgroundValue}
                alt={`${name || "Section"} background`}
                layout="fill"
                objectFit="cover" // Consider making this configurable too
                quality={100}
                priority={section.sectionType === "hero"} // Example: Prioritize hero images
              />
            )}
            {/* Background Video */}
            {backgroundType === "video" && backgroundValue && (
              <video
                key={backgroundValue}
                playsInline
                autoPlay
                muted
                loop
                className="absolute top-0 left-0 w-full h-full object-cover"
              >
                <source src={backgroundValue} type="video/mp4" />
              </video>
            )}

            {/* --- NEW: Overlay Div --- */}
            {showOverlay && (
              <div
                className={cn(
                  "absolute inset-0", // Cover the container
                  overlayEffect === "faded" && "opacity-50", // Apply fade effect
                  overlayEffect === "frosted" && "backdrop-blur-sm" // Apply frost effect (adjust blur amount as needed)
                )}
                style={{
                  backgroundColor: overlayColor, // Apply the overlay color
                }}
              />
            )}
            {/* --- End Overlay Div --- */}
          </div>

          {/* Border Overlay */}
          <div
            className={cn(
              "absolute inset-0 rounded-md transition-all duration-200 pointer-events-none",
              !showEditorUI && !isSelected && "border border-transparent",
              showEditorUI &&
                !isSelected &&
                "border-dashed border-2  border-gray-400 rounded-sm",
              isSelected && "border-2  border-indigo-600 rounded-sm"
            )}
            onClick={handleClick}
          />

          {/* content container */}
          <div
            onClick={handleClick}
            className={cn(
              "relative z-10 max-w-6xl mx-auto py-8 grid grid-cols-1 gap-1 items-center",
              className
            )}
            style={
              {
                ...styles,
                justifyContent:
                  settings?.itemsVerticalAlignment ?? "flex-start",
              } as React.CSSProperties
            }
          >
            {Array.isArray(childSections) &&
              childSections.map((childsection) => (
                <Switcher key={childsection.id} section={childsection} />
              ))}
          </div>

          {/* Add Section Button */}
          {showEditorUI && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-50">
              <DialogWrapper
                trigger={
                  <Button
                    size="sm"
                    variant="default"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-primary hover:text-white hover:bg-[#5545e6]"
                    style={{
                      backgroundColor: "#5545e6",
                    }}
                  >
                    <Plus className="h-4 w-4 " />
                  </Button>
                }
                title="Templates"
                description="Select a section template to add it to the page."
                className="max-w-[100vw] w-[80vw] min-h-[500px] max-h-[95vh] bg-white text-editor-foreground border-b border-editor-border shadow-md"
              >
                <SectionTemplatesDialog atIndex={true} index={section.id} />
              </DialogWrapper>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default React.memo(SectionContainer);
