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

import {
  Brain,
  Briefcase,
  Copy,
  Ellipsis,
  Eye,
  Palette,
  Plus,
  Pointer,
  Recycle,
  SquarePen,
  Star,
  Trash,
  TypeIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import TextComponent from "./textContainer";
import ItemStylist from "./elementUtils/itemStylist";
import SmartLayoutStylist from "./elementUtils/smartLayoutStylist";
import { Button } from "@/components/ui/button";
import { DialogProvider } from "@/providers/dialog-provider";
import TweetLinkFormModal from "../helpers/tweetLinkModal";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import TweetEmbed from "@/components/global/TweetEmbed";
import DialogWrapper from "@/wrappers/dialog-wrapper";

type Props = { section: ElementNode };

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

const TestimonialsContainer: React.FC<Props> = ({ section }: Props) => {
  const {
    livemode,
    previewMode,
    selectedSectionId,
    activeElementId, // <-- Get global active ID
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
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const [hoveredIconId, setHoveredIconId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDListElement>(null);

  // --- State Checks ---
  const isSelectedLayout = !livemode && activeElementId === id;
  const showLayoutEditorUI = !livemode && (isLayoutHovered || isSelectedLayout);

  const isSelectedItem = !livemode && activeElementId === id;
  const showItemEditorUI = !livemode && (isLayoutHovered || isSelectedLayout);

  const isLayoutActive = !livemode && activeElementId === id;
  const isChildActive = useMemo(() => {
    if (livemode || !activeElementId || !Array.isArray(content)) return false;
    // Check if the activeElementId matches any of the child item IDs
    return content.some((item) => item.id === activeElementId);
  }, [livemode, activeElementId, content]);

  const handleLayoutClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent bubbling to parent sections/background
      if (!livemode) {
        setActiveElementId(id);
      }
    },
    [livemode, setActiveElementId, id]
  );

  // Specific handler for item clicks
  const handleItemClick = useCallback(
    (e: React.MouseEvent, itemId: string) => {
      e.stopPropagation(); // Prevent bubbling to the smart layout container
      if (!livemode) {
        setActiveElementId(itemId);
      }
    },
    [livemode, setActiveElementId]
  );

  const handleAddItem = useCallback(() => {
    if (!id || !settings?.smart_layout_type) return;
    //addLayoutItem(id, settings.smart_layout_type);
  }, [id, settings?.smart_layout_type, addLayoutItem]);

  const handleLayoutMouseEnter = useCallback(() => {
    if (!livemode) setIsLayoutHovered(true);
  }, [livemode]);
  const handleLayoutMouseLeave = useCallback(() => {
    if (!livemode) setIsLayoutHovered(false);
  }, [livemode]);
  const handleItemMouseEnter = useCallback(
    (index: number) => {
      if (!livemode) setHoveredItemIndex(index);
    },
    [livemode]
  );
  const handleItemMouseLeave = useCallback(() => {
    if (!livemode) setHoveredItemIndex(null);
  }, [livemode]);

  // --- NEW: Icon hover handlers ---
  const handleIconMouseEnter = useCallback(
    (index: number) => {
      if (!livemode) {
        setHoveredIconId(index);
      }
    },
    [livemode]
  );

  const handleIconMouseLeave = useCallback(() => {
    if (!livemode) {
      setHoveredIconId(null);
    }
  }, [livemode]);

  const getLayout = (item: ElementNode, index: number) => {
    switch (item.settings?.testimonalType) {
      case "normal_testimonial":
        return (
          <div className="w-full max-w-lg  p-5 flex flex-col gap-[32px] ">
            {Array.isArray(item.content) && item.content.length >= 2 && (
              <>
                <div className="flex items-center gap-[2px]">
                  <Star className="block w-[20px] h-auto text-[#facc15] fill-[#facc15]" />
                  <Star className="block w-[20px] h-auto text-[#facc15] fill-[#facc15]" />
                  <Star className="block w-[20px] h-auto text-[#facc15] fill-[#facc15]" />
                  <Star className="block w-[20px] h-auto text-[#facc15] fill-[#facc15]" />
                  <Star className="block w-[20px] h-auto text-[#facc15] fill-[#facc15]" />
                </div>
                <div className="block">
                  <TextComponent section={item.content[1]} />
                </div>
                <div className="flex flex-row items-center gap-[16px] mt-[auto]">
                  <div className=" overflow-hidden w-[48px] h-[48px] aspect-square relative rounded-t-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          !Array.isArray(item.content[3].content)
                            ? item.content[3].content?.src ||
                              "/assets/roundArchitecture.jpg"
                            : "/assets/roundArchitecture.jpg"
                        }
                        alt={
                          !Array.isArray(item.content[0].content)
                            ? item.content[0].content?.innerText ||
                              "profile image"
                            : "profile image"
                        }
                      />
                      <AvatarFallback>
                        {(!Array.isArray(item.content[0].content) &&
                        item.content[0].content?.innerText
                          ? item.content[0].content.innerText
                              .charAt(0)
                              .toUpperCase()
                          : "A") || "A"}
                      </AvatarFallback>
                    </Avatar>
                    {/* <Image
                      fill
                      className="object-cover rounded-[9999px]"
                      src={
                        !Array.isArray(item.content[3].content)
                          ? item.content[3].content?.src ||
                            "/assets/roundArchitecture.jpg"
                          : "/assets/roundArchitecture.jpg"
                      }
                      alt="image"
                    /> */}
                  </div>
                  <div className="flex flex-col flex-1">
                    <TextComponent section={item.content[0]} />
                    <TextComponent section={item.content[2]} />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "tweet_testimonial":
        return (
          <>
            {!Array.isArray(item.content) && (
              <TweetEmbed
                tweetUrl={item.content.href as string}
                appearance={{
                  theme: "auto",
                  border: "rounded-xl",
                  padding: "p-6",
                  shadow: "shadow-lg",
                }}
                className="bg-transparent"
                showActions={true}
                maxWidth={400}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  const renderContent = useCallback(() => {
    if (!Array.isArray(section.content)) return null;

    const handleAddTestimonial = (e: React.MouseEvent) => {
      e.preventDefault();
      if (livemode || previewMode) return;

      const newNode: ElementNode = {
        id: v4(),
        styles: {},
        className: "",
        name: "",
        type: "testimonial_item",
        isHidden: false,
        settings: {
          categoryId: "",
          contentIsDynamic: false,
          testimonalType: "normal_testimonial",
        },
        content: [
          {
            id: v4(),
            styles: {},
            className: "text-left font-semibold text-sm truncate font-medium",
            name: "",
            type: "testimonial_Title",
            settings: {
              contentIsDynamic: false,
            },
            content: {
              innerText: `
                              <h3>Peter Cooper</h3>
                              `,
              metaDynamic: [],
            },
          },
          {
            id: v4(),
            styles: {},
            className:
              "text-sm leading-relaxed whitespace-pre-wrap break-words ",
            name: "",
            type: "testimonial_Content",
            settings: {
              contentIsDynamic: false,
            },
            content: {
              innerText: `
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                              `,
              metaDynamic: [],
            },
          },
          {
            id: v4(),
            styles: {},
            className: "text-xs",
            name: "",
            type: "testimonial_Occupation",
            settings: {
              contentIsDynamic: false,
            },
            content: {
              innerText: `
                              <span>Digital Marketing Specialist</span>
                              `,
              metaDynamic: [],
            },
          },
          {
            id: v4(),
            styles: {},
            className: "h-12 w-12",
            name: "",
            type: "image",
            settings: {
              contentIsDynamic: false,
            },
            content: {
              src: "/assets/roundArchitecture.jpg",
            },
          },
        ],
      };

      addLayoutItem(section.id, newNode);
    };

    const gridColsClass = (() => {
      const cols = settings?.grid_columns; // Using grid_columns
      if (cols === 1) return "md:grid-cols-1";
      if (cols === 2) return "md:grid-cols-2";
      if (cols === 4) return "md:grid-cols-4"; // Added 4-column support
      return "md:grid-cols-3"; // Default to 3
    })();

    return (
      <ol
        className={cn(
          "grid grid-cols-1 gap-8 md:gap-3 lg:gap-8 ",
          gridColsClass, // Apply dynamic column class
          (!livemode || !previewMode) && "py-4"
        )}
      >
        {Array.isArray(content) &&
          content.map((item, index) => {
            const isItemActive = !livemode && activeElementId === item.id;
            const isItemHovered = !livemode && hoveredItemIndex === index;
            const showItemEditorUI =
              !livemode && (isItemHovered || isItemActive);

            return (
              <li
                key={item.id} // Use item ID as key
                id={item.id} // Add ID for potential direct targeting
                className={cn(
                  "themed-card relative list-none", // Ensure default list styles are removed
                  item.className, // Apply item's specific classes
                  // Active state outline (Solid)
                  isItemActive &&
                    "outline-1 outline outline-indigo-600 outline-offset-2",
                  // Optional: Hover state outline (Dashed) - only if not active
                  isItemHovered &&
                    !isItemActive &&
                    "outline-1 outline-dashed outline-indigo-400 outline-offset-2",
                  // Default border in edit mode only if not active and not hovered
                  // !livemode &&
                  //   !isItemActive &&
                  //   !isItemHovered &&
                  //   "outline-1  outline-dashed outline-gray-300 outline-offset-1",
                  "cursor-pointer" // Add pointer cursor in edit mode
                )}
                style={item.styles}
                onClick={(e) => handleItemClick(e, item.id)} // Use item-specific handler
                onMouseEnter={() => handleItemMouseEnter(index)} // Optional hover handler
                onMouseLeave={handleItemMouseLeave} // Optional hover handler
              >
                {/* --- Item Stylist Badge --- */}
                {/* Show ONLY if this specific item is active */}
                {showItemEditorUI && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          //onClick={(e) => e.stopPropagation()} // Prevent badge click from deselecting
                          className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                          aria-label="Edit Item"
                        >
                          <Ellipsis className="w-3 h-3" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto bg-transparent p-0 z-[50]  absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none ">
                        <ItemStylist
                          section={section} // Pass parent section
                          item={item} // Pass the specific item
                          index={index} // Pass index if needed by stylist
                        />
                      </PopoverContent>
                    </Popover>
                  </Badge>
                )}
                {/* --- End Item Stylist Badge --- */}

                {/* Render the actual layout content */}
                {getLayout(item, index)}

                {/* Add Item Button - Show only on the last item in edit mode */}
                {!livemode && !previewMode && index === content.length - 1 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        // onClick={(e) => {
                        //   e.stopPropagation(); // Prevent click from selecting the list item
                        //   handleAddItem();
                        // }}
                        className="absolute -right-3 -bottom-3 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 border border-gray-300"
                        aria-label="Add Item"
                        title="Add Item"
                      >
                        <Plus className="h-4 w-4 text-indigo-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-3 absolute -top-[1rem] right-2 bg-editor-component text-editor-foreground border-b border-editor-border shadow-md">
                      <div className="flex flex-col gap-2">
                        <DialogWrapper
                          trigger={
                            <Button
                              variant={"secondary"}
                              className="rounded-md min-w-[8rem] flex flex-row gap-x-2  items-start justify-start bg-transparent hover:bg-accent hover:text-accent-foreground"
                            >
                              <div
                                className="bg-background flex size-8 items-center justify-center rounded-md border"
                                aria-hidden="true"
                              >
                                <TypeIcon size={16} className="opacity-60" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-medium">Tweet</div>
                                <div className="text-muted-foreground text-xs">
                                  Embed a tweet
                                </div>
                              </div>
                            </Button>
                          }
                          title="Add New Question"
                          description="Create a new question"
                          className="bg-sidebar "
                        >
                          <TweetLinkFormModal section={section} />
                        </DialogWrapper>
                        <Button
                          variant="secondary"
                          className="rounded-md min-w-[8rem] flex flex-row gap-x-2  items-start justify-start bg-transparent hover:bg-accent hover:text-accent-foreground"
                          onClick={(e) => handleAddTestimonial(e)}
                        >
                          <div
                            className="bg-background flex size-8 items-center justify-center rounded-md border"
                            aria-hidden="true"
                          >
                            <Star size={16} className="opacity-60" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium">
                              Standard testimonial
                            </div>
                            <div className="text-muted-foreground text-xs">
                              Add a standard testimonial
                            </div>
                          </div>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </li>
            );
          })}
      </ol>
    );
  }, [
    content,
    settings?.grid_columns,
    livemode,
    activeElementId,
    hoveredItemIndex,
    handleItemClick,
    handleItemMouseEnter,
    handleItemMouseLeave,
    handleAddItem,
    section, // Needed for ItemStylist and getLayout
    removeSmartLayoutItem, // Needed for ItemStylist onRemove
  ]);

  return (
    <div
      id={id} // Add ID for potential targeting
      className={cn(
        "relative min-w-full", // Base class
        className, // Apply section's specific classes
        // --- Conditional Outlines ---
        // Active state outline (Solid)
        isLayoutActive &&
          "outline-1 outline outline-indigo-600 outline-offset-2",
        // Parent-Active state outline (Dashed) - If a child is active
        isChildActive &&
          "outline-1  outline-dashed outline-indigo-400 outline-offset-2",
        // Optional: Hover state outline (Dashed) - Only if not active and no child active
        isLayoutHovered &&
          !isLayoutActive &&
          !isChildActive &&
          "outline-1  outline-dashed outline-indigo-400 outline-offset-2",
        // Default border in edit mode only if not active, no child active, and not hovered
        // !livemode &&
        //   !isLayoutActive &&
        //   !isChildActive &&
        //   !isLayoutHovered &&
        //   "outline-1  outline-dashed outline-gray-300 outline-offset-1",
        // --- End Conditional Outlines ---
        "cursor-pointer" // Add pointer cursor in edit mode
      )}
      style={styles}
      onClick={handleLayoutClick} // Attach layout click handler
      onMouseEnter={handleLayoutMouseEnter} // Optional hover handler
      onMouseLeave={handleLayoutMouseLeave} // Optional hover handler
    >
      {/* --- SmartLayout Stylist Badge --- */}
      {/* Show ONLY if the layout container itself is active */}
      {showLayoutEditorUI && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
          <Popover>
            <PopoverTrigger asChild>
              <button
                //onClick={(e) => e.stopPropagation()} // Prevent badge click from deselecting
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                aria-label="Edit Layout"
              >
                <Ellipsis className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-transparent p-0 z-[50]  absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none ">
              <SmartLayoutStylist section={section} />
            </PopoverContent>
          </Popover>
        </Badge>
      )}
      {/* --- End SmartLayout Stylist Badge --- */}

      {/* Render the grid/list of items */}
      {renderContent()}
    </div>
  );
};

export default React.memo(TestimonialsContainer);
