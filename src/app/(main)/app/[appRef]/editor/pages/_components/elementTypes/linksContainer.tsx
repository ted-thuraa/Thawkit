"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { v4 } from "uuid";

import { Copy, Eye, Palette, Plus, SquarePen, Trash, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { debounce } from "lodash";
import ButtonStylist from "./elementUtils/buttonStylist";
import { DialogProvider } from "@/providers/dialog-provider";
import { ElementNode } from "@/stores/pageEditorStore/types";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import IconPicker from "../helpers/iconPicker";
import DynamicLucideIcon from "@/components/global/dynamicLucideIcon";

type Props = { section: ElementNode };

const PopoverContentWithCloseButton = ({
  link_item,
  handlePropertyUpdate,
  handleDeleteItem,
  context,
}: {
  link_item: ElementNode;
  handlePropertyUpdate: (
    property: string,
    linkItemId: string,
    val: string
  ) => void;
  handleDeleteItem: (linkItemId: string) => void;
  context: "text" | "icon";
}) => {
  if (Array.isArray(link_item.content)) return null;

  return (
    <div className="relative flex flex-col justify-center bg-white shadow-medium rounded-xl px-4 py-4 border border-gray-100 w-72">
      {/* <Button
        variant={"ghost"}
        size={"sm"}
        // onClick={() => setOpen(false)}
        className="absolute top-2 right-2 h-6 text-gray-700 py-1 px-1"
      >
        <X className="w-3 h-3" />
      </Button> */}
      <div className="space-y-3">
        {context === "text" ? (
          <div>
            <label
              htmlFor={`text-${link_item.id}`}
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Text
            </label>
            <input
              id={`text-${link_item.id}`}
              type="text"
              value={link_item.content.innerText}
              onChange={(e) =>
                handlePropertyUpdate(
                  "content.innerText",
                  link_item.id,
                  e.target.value
                )
              }
              className="w-full px-2.5 py-1.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter link text"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor={`text-${link_item.id}`}
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Icon
            </label>
            <div className="w-full flex flex-row items-center gap-x-2">
              <DynamicLucideIcon
                name={link_item.content.icon}
                className={cn(link_item.className)}
              />
              <DialogWrapper
                trigger={
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="text-xs justify-start h-6 px-2 py-1 w-auto rounded border-transparent hover:bg-gray-100 text-gray-700 flex flex-row items-center gap-1 flex-nowrap"
                  >
                    Change{" "}
                    <SquarePen className="w-3 h-3 mr-1.5 text-gray-600 shrink-0" />
                  </Button>
                }
                title="Edit icon "
                description="Change icon"
                className=" min-w-[50vw] max-w-md w-fit h-fit bg-editor-component text-editor-foreground border-b border-editor-border  rounded-xl shadow-md border border-slate-200"
              >
                {/* Add page settings content here */}
                <IconPicker
                  value={link_item.content.icon as string}
                  onChange={(iconName) => {
                    handlePropertyUpdate(
                      "content.icon",
                      link_item.id,
                      iconName
                    );
                    //setOpen(false);
                  }}
                />
              </DialogWrapper>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor={`href-${link_item.id}`}
            className="block text-xs font-medium text-gray-600 mb-1"
          >
            Link
          </label>
          <input
            id={`href-${link_item.id}`}
            type="url"
            value={link_item.content.href}
            onChange={(e) =>
              handlePropertyUpdate("content.href", link_item.id, e.target.value)
            }
            className="w-full px-2.5 py-1.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="https://example.com"
          />
        </div>

        <Button
          size={"sm"}
          className="flex flex-row items-center justify-center bg-red-500 hover:bg-red-600 text-white"
          onClick={(e) => handleDeleteItem(link_item.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

const RenderTextLinks = ({ section }: Props) => {
  const {
    livemode,
    activeElementId,
    setActiveElementId,
    updateElementProperty,
    removeSmartLayoutItem,
    addLayoutItem,
    previewMode,
  } = usePageBuilderStore();
  if (!Array.isArray(section.content)) return null;

  // State to track the ID of the currently hovered link item.
  // This is managed locally as hover is a transient UI state.
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handlePropertyUpdate = (
    property: string,
    linkItemId: string,
    val: string
  ) => {
    // Update the global state with the new link properties
    updateElementProperty(linkItemId, property, val);
  };

  const handleAddItem = useCallback(() => {
    if (livemode || previewMode) return;

    const newNode: ElementNode = {
      id: v4(),
      styles: {},
      className: "no-underline tracking-[0.025em] text-[16px] font-normal",
      name: "",
      type: "layout_item",
      isHidden: false,
      settings: {},
      content: {
        href: "#",
        innerText: "Add text",
      },
    };

    addLayoutItem(section.id, newNode);
  }, [section.id, previewMode]);

  const handleDeleteItem = useCallback(
    (linkItemId: string) => {
      if (linkItemId) {
        removeSmartLayoutItem(section.id, linkItemId);
      }
    },
    [section.id, removeSmartLayoutItem]
  );

  // --- Edge Case Handling ---
  if (!Array.isArray(section.content)) {
    return null;
  }

  // --- Live Mode Rendering ---
  // In live mode, we only render clean, functional <a> tags without editor interactivity.
  //   if (livemode) {
  //     return (
  //       <>
  //         {section.content.map((link_item) => (
  //           <a
  //             key={link_item.id}
  //             href={link_item.content.href || '#'}
  //             className={section.className} // Apply container styles to the link itself
  //             style={section.styles}
  //           >
  //             {link_item.content.innerText || 'Untitled Link'}
  //           </a>
  //         ))}
  //       </>
  //     );
  //   }

  // --- Editor/Preview Mode Rendering ---
  return (
    <>
      {section.content.map((link_item: ElementNode, index: number) => {
        // Determine the interaction state for the current link item.
        // 'isActive' is derived from the global store, representing the persistent "clicked" state.
        const isActive = activeElementId === link_item.id;
        // 'isHovered' is derived from local component state.
        const isHovered = hoveredId === link_item.id;

        // Use clsx to conditionally apply Tailwind classes for different states.
        const linkWrapperClasses = clsx(
          "p-1.5", // Padding to ensure the outline has space
          "transition-all duration-200 ease-in-out", // Smooth transition for border and background
          {
            // Hover State (only if not already active)
            "cursor-pointer border-2 border-dashed border-indigo-600 rounded-md":
              isHovered && !isActive,
            // Clicked/Active State
            "border-2 border-solid border-indigo-600 rounded-md": isActive,
            // Default State: A transparent border prevents layout shift when other states are applied.
            "border-2 border-transparent rounded-md": !isHovered && !isActive,
          }
        );

        return (
          <div
            className="relative"
            key={link_item.id}
            onClick={() => setActiveElementId(link_item.id)}
            onMouseEnter={() => !previewMode && setHoveredId(link_item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {!Array.isArray(link_item.content) && (
              <Popover>
                <PopoverTrigger asChild>
                  <p className={linkWrapperClasses}>
                    {link_item.content.innerText}
                  </p>
                </PopoverTrigger>
                <PopoverContent className="w-[18rem] p-2 bg-transparent border-none shadow-none ">
                  <PopoverContentWithCloseButton
                    link_item={link_item}
                    handlePropertyUpdate={handlePropertyUpdate}
                    handleDeleteItem={handleDeleteItem}
                    context={"text"}
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* "Add Item" button logic (unchanged from original snippet) */}
            {!livemode &&
              !previewMode &&
              Array.isArray(section.content) &&
              index === section.content.length - 1 && (
                <button
                  className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 border border-gray-200"
                  onClick={handleAddItem}
                >
                  <Plus className="h-3 w-3 text-gray-500" />
                </button>
              )}
          </div>
        );
      })}
    </>
  );
};

const RenderIconLinks = ({ section }: Props) => {
  const {
    livemode,
    sections,
    activeElementId,
    addLayoutItem,
    setActiveElementId,
    addBtnItem,
    updateElementProperty,
    removeSmartLayoutItem,
    previewMode,
    selectedSectionId,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const { id, content, name, styles, className, type, settings } = section;
  // State to track the ID of the currently hovered link item.
  // This is managed locally as hover is a transient UI state.
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handlePropertyUpdate = (
    property: string,
    linkItemId: string,
    val: string
  ) => {
    // Update the global state with the new link properties
    updateElementProperty(linkItemId, property, val);
  };

  const handleAddItem = useCallback(() => {
    if (livemode || previewMode) return;

    const newNode: ElementNode = {
      id: v4(),
      styles: {},
      className: "no-underline tracking-[0.025em] text-[16px] font-normal",
      name: "",
      type: "layout_item",
      isHidden: false,
      settings: {},
      content: {
        href: "#",
        icon: "HelpCircle",
      },
    };

    addLayoutItem(section.id, newNode);
  }, [section.id, previewMode]);

  const handleDeleteItem = useCallback(
    (linkItemId: string) => {
      if (linkItemId) {
        removeSmartLayoutItem(
          section.id,
          linkItemId,
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, section.id, removeSmartLayoutItem]
  );

  // --- Edge Case Handling ---
  if (!Array.isArray(section.content)) {
    return null;
  }

  // --- Live Mode Rendering ---
  // In live mode, we only render clean, functional <a> tags without editor interactivity.
  //   if (livemode) {
  //     return (
  //       <>
  //         {section.content.map((link_item) => (
  //           <a
  //             key={link_item.id}
  //             href={link_item.content.href || '#'}
  //             className={section.className} // Apply container styles to the link itself
  //             style={section.styles}
  //           >
  //             {link_item.content.innerText || 'Untitled Link'}
  //           </a>
  //         ))}
  //       </>
  //     );
  //   }

  // --- Editor/Preview Mode Rendering ---
  return (
    <>
      {section.content.map((link_item: ElementNode, index: number) => {
        // Determine the interaction state for the current link item.
        // 'isActive' is derived from the global store, representing the persistent "clicked" state.
        const isActive = activeElementId === link_item.id;
        // 'isHovered' is derived from local component state.
        const isHovered = hoveredId === link_item.id;

        // Use clsx to conditionally apply Tailwind classes for different states.
        const linkWrapperClasses = clsx(
          "p-1.5", // Padding to ensure the outline has space
          "transition-all duration-200 ease-in-out", // Smooth transition for border and background
          {
            // Hover State (only if not already active)
            "cursor-pointer border-2 border-dashed border-indigo-600 rounded-md":
              isHovered && !isActive,
            // Clicked/Active State
            "border-2 border-solid border-indigo-600 rounded-md": isActive,
            // Default State: A transparent border prevents layout shift when other states are applied.
            "border-2 border-transparent rounded-md": !isHovered && !isActive,
          }
        );

        return (
          <div
            className="relative"
            key={link_item.id}
            onClick={() => setActiveElementId(link_item.id)}
            onMouseEnter={() => !previewMode && setHoveredId(link_item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {!Array.isArray(link_item.content) && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className={linkWrapperClasses}>
                    <DynamicLucideIcon
                      name={link_item.content.icon}
                      className={cn(link_item.className)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[18rem] p-2 bg-transparent border-none shadow-none ">
                  <PopoverContentWithCloseButton
                    link_item={link_item}
                    handlePropertyUpdate={handlePropertyUpdate}
                    handleDeleteItem={handleDeleteItem}
                    context={"icon"}
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* "Add Item" button logic (unchanged from original snippet) */}
            {!livemode &&
              !previewMode &&
              Array.isArray(section.content) &&
              index === section.content.length - 1 && (
                <button
                  className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 border border-gray-200"
                  onClick={handleAddItem}
                >
                  <Plus className="h-3 w-3 text-gray-500" />
                </button>
              )}
          </div>
        );
      })}
    </>
  );
};

const LinksContainer: React.FC<Props> = ({ section }: Props) => {
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

  const handleElementClick = useCallback(
    (e: React.MouseEvent) => {
      //e.stopPropagation(); // Prevent bubbling
      if (!livemode && !previewMode) {
        setActiveElementId(id); // Set this element as active
      }
    },
    [livemode, previewMode, setActiveElementId, id]
  );

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

  const isSelected = !livemode && !previewMode && activeElementId === id;
  const showEditorUI = !livemode && !previewMode && (isHovered || isSelected);

  return (
    <>
      <div
        //ref={containerRef}
        className={cn(
          "relative w-full flex flex-col md:flex-row items-center flex-wrap gap-[32px] justify-end md:justify-center md:gap-y-[20px] ",
          "outline outline-1",
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
            "outline-transparent": !showEditorUI && !isSelected, // Fully transparent when not hovered or selected
            "outline-dashed outline-indigo-400": showEditorUI && !isSelected, // Lighter solid indigo on hover (but not selected)
            " outline-indigo-600": isSelected, // Darker solid indigo when selected
          }
        )}
        onClick={handleElementClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          pointerEvents: previewMode ? "none" : "auto",
        }}
      >
        {section.settings?.link_type === "text" ? (
          <RenderTextLinks section={section} />
        ) : (
          <RenderIconLinks section={section} />
        )}
      </div>
    </>
  );
};

export default React.memo(LinksContainer);
