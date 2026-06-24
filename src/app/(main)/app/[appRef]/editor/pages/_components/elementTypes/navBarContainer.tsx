"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { Copy, Eye, Menu, Palette, Plus, Trash, X } from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { DialogProvider } from "@/providers/dialog-provider";
import Switcher from "../recursiveComponent";
import SectionTemplatesDialog from "../helpers/templatesDialog";
import { FaBars } from "react-icons/fa";
import HeaderStylist from "./elementUtils/headerStylist";
import {
  Heading1Icon,
  Heading2Icon,
  MinusIcon,
  PlusIcon,
  TextQuoteIcon,
  TypeIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageComponent from "./imageContainer";
import LinksContainer from "./linksContainer";
import ButtonContainer from "./buttonContainer";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SheetProvider } from "@/providers/sheet-provider";
import { THEME_CLASSES } from "@/lib/constants/theme";

type Props = { section: ElementNode };

const NavContainerOld = ({ section }: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    livemode,
    selectedSectionId,
    activeElementId,
    theme,
    removeSection,
    setSelectedSectionId,
    setActiveElementId,
    duplicateSection,
    toggleSectionVisibility,
    previewMode,
    addButtonToSection,
  } = usePageBuilderStore();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isRowHovered, setRowIsHovered] = useState<boolean>(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const { id, content, name, styles, className, type, settings } = section;
  const logoSection: ElementNode | undefined = Array.isArray(section?.content)
    ? section?.content.filter((s) => s.type === "image")[0]
    : undefined;
  const linksSection: ElementNode | undefined = Array.isArray(section?.content)
    ? section?.content.filter((s) => s.type === "links")[0]
    : undefined;
  const buttonsSection: ElementNode | undefined = Array.isArray(
    section?.content
  )
    ? section?.content.filter((s) => s.type === "buttons")[0]
    : undefined;

  const isSelected = !livemode && !previewMode && selectedSectionId === id;
  const showEditorUI = !livemode && !previewMode && (isHovered || isSelected);

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

  const navigation = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
  ];

  const gridColsClass = (() => {
    const cols = settings?.grid_columns; // Using grid_columns
    if (cols === 1) return "md:grid-cols-1";
    if (cols === 2) return "md:grid-cols-2";
    if (cols === 4) return "md:grid-cols-4"; // Added 4-column support
    return "md:grid-cols-3"; // Default to 3
  })();

  return (
    <>
      {section.isHidden !== true && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <nav
              ref={sectionRef}
              className={cn(
                "relative  w-full  ",
                className,

                {
                  "outline-transparent": !showEditorUI && !isSelected, // Fully transparent when not hovered or selected
                  "outline-dashed outline-1  outline-offset-0 outline-gray-400 rounded-sm":
                    showEditorUI && !isSelected, // Lighter solid indigo on hover (but not selected)
                  "  outline-1 outline-offset-0 outline-indigo-600 rounded-sm":
                    isSelected, // Darker solid indigo when selected
                }
              )}
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
                          <HeaderStylist section={section} />
                        </PopoverContent>
                      </Popover>
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
              <div className="flex flex-col w-full  mx-auto px-[32px] max-w-7xl">
                <div
                  className={cn(
                    "flex flex-row items-center gap-[32px]   md:items-stretch md:gap-[40px]",
                    !linksSection && !buttonsSection && "justify-center",
                    (linksSection || buttonsSection) && "justify-between"
                  )}
                >
                  <div className="flex flex-row items-center gap-[20px]">
                    <ImageComponent section={logoSection as ElementNode} />
                  </div>
                  {(linksSection || buttonsSection) && (
                    <>
                      <div className="hidden md:flex flex-row gap-[12px] items-center justify-center   md:gap-[24px] md:items-start flex-1">
                        {linksSection && (
                          <LinksContainer section={linksSection} />
                        )}
                        {buttonsSection && (
                          <ButtonContainer section={buttonsSection} />
                        )}
                      </div>
                      <div className="block md:hidden">
                        <SheetProvider
                          trigger={
                            <button
                              className={cn(
                                "w-fit h-fit px-4 py-2 tracking-[0.025em] leading-[1.5em]  inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                                THEME_CLASSES.button
                              )}
                            >
                              <Menu className="h-4 w-4" />
                            </button>
                          }
                          customCloseButton={
                            <Button
                              variant="ghost"
                              className="absolute top-4 right-4 z-50 rounded-lg p-2 bg-transparent text-editor-foreground border-none hover:bg-transparent hover:text-editor-foreground"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          }
                          showDefaultClose={false}
                          side="right"
                          className="min-h-[40rem]  w-[100vw] max-w-none p-0 overflow-hidden bg-editor-component text-editor-foreground border-b border-editor-border shadow-md"
                        >
                          <div className="flex flex-col gap-[12px] items-center justify-center  md:gap-[24px] md:items-start flex-1">
                            {linksSection && (
                              <LinksContainer section={linksSection} />
                            )}
                            {buttonsSection && (
                              <ButtonContainer section={buttonsSection} />
                            )}
                          </div>
                        </SheetProvider>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </header>
      )}
    </>
  );
};

export default React.memo(NavContainerOld);
