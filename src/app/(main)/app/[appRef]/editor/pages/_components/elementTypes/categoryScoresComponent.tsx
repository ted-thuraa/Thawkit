"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, {
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";

import {
  Bitcoin,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  Ellipsis,
  Eye,
  Gift,
  Info,
  LayoutGrid,
  Palette,
  Plus,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import TextComponent from "./textContainer";
import SmartLayoutStylist from "./elementUtils/smartLayoutStylist";
import CategoryScoreStylist from "./elementUtils/scoreCategoriesStylist";
import { initialLayoutState, layoutReducer } from "../helpers/layoutReducer";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = { section: ElementNode };

const CategoryScoresComponent = ({ section }: Props) => {
  const {
    livemode,
    theme,
    selectedSectionId,
    addLayoutItem,
    setSelectedSectionId,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const [state, dispatch] = useReducer(layoutReducer, initialLayoutState);

  const [isItemHovered, setIsItemHovered] = useState<boolean>(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  const { id, content, name, styles, className, type } = section;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddItem = useCallback(() => {
    if (!section.id) {
      console.warn("Cannot add item - section ID is missing");
      return;
    }

    if (!section.settings?.smart_layout_type) {
      console.warn("Cannot add item - layout type is missing");
      return;
    }

    addLayoutItem(section.id, section.settings.smart_layout_type);
  }, [section.id, section.settings?.smart_layout_type]);

  const handleLayoutHover = useCallback(
    (isHovered: boolean) => {
      if (!livemode) {
        dispatch({ type: "HOVER_LAYOUT", payload: isHovered });
      }
    },
    [livemode]
  );

  const handleItemHover = useCallback(
    (index: number | null, isHovered: boolean) => {
      if (!livemode) {
        dispatch({
          type: "HOVER_ITEM",
          payload: { index, isHovered },
        });
      }
    },
    [livemode]
  );

  const handleLayoutSelect = useCallback(() => {
    if (!livemode) {
      dispatch({ type: "TOGGLE_LAYOUT_SELECT" });
    }
  }, [livemode]);

  const handleItemSelect = useCallback(
    (index: number) => {
      if (!livemode) {
        dispatch({
          type: "TOGGLE_ITEM_SELECT",
          payload: { index },
        });
      }
    },
    [livemode]
  );

  // Memoize the event handlers object
  const handleMouseEvents = useMemo(
    () => ({
      onLayoutHover: handleLayoutHover,
      onItemHover: handleItemHover,
      onLayoutSelect: handleLayoutSelect,
      onItemSelect: handleItemSelect,
    }),
    [handleLayoutHover, handleItemHover, handleLayoutSelect, handleItemSelect]
  );

  const onItemHover = useCallback(
    (index: number | null, val: boolean) => {
      if (!livemode) {
        setIsItemHovered(val);
        setHoveredItemIndex(index);
      }
    },
    [livemode]
  );

  const renderContent = useCallback(() => {
    if (!Array.isArray(section.content)) return null;
    // Calculate number of filled bars (out of 32 total)
    const data = {
      name: "If you need to store the chart data or implement any backend logic, you can use Supabase to add these features easily.",
      percentage: 58,
      weeklyChange: 2.1,
      productCount: 45,
      productCountChange: 3.2,
    };

    const totalBars = 25;
    const filledBars = Math.round((data.percentage / 100) * totalBars);

    switch (section.type) {
      case "category_scores":
        return (
          <>
            <ol
              className={cn("grid grid-cols-1 gap-8 mt-12 mb-12 md:mt-12", {
                "md:grid-cols-3 md:gap-3 lg:gap-8":
                  !section.settings?.grid_columns ||
                  section.settings.grid_columns === 3,
                "md:grid-cols-2 md:gap-3 lg:gap-8":
                  section.settings?.grid_columns === 2,
              })}
            >
              {section.content.map((item, index) => (
                <li
                  className={cn("relative", {
                    "!border-yellow-500 !border-solid":
                      state.hoveredState.isItemHovered &&
                      state.hoveredState.itemIndex === index,
                    "border-dashed border-[1px] border-gray-300": !livemode,
                  })}
                  onMouseEnter={() => onItemHover(index, true)}
                  onMouseLeave={() => onItemHover(null, false)}
                >
                  {isItemHovered && hoveredItemIndex === index && (
                    <>
                      <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-none rounded-t-lg">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100">
                              <Ellipsis className="w-3 h-2" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-max p-2 absolute -left-32 -top-12">
                            <CategoryScoreStylist
                              parentSection={section}
                              item={item}
                              index={index}
                              onTierChange={setSelectedTierId}
                            />
                          </PopoverContent>
                        </Popover>
                      </Badge>
                    </>
                  )}

                  <div
                    className={cn(
                      "w-full max-w-lg  p-5 ",
                      "themed-card",
                      item.className
                    )}
                    style={{
                      ...styles,
                      backgroundColor:
                        item.styles.backgroundColor ||
                        section.settings?.smartLayout_cardBackgroundColor,
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <TextComponent
                          section={
                            Array.isArray(item.content)
                              ? item.content[0]
                              : item.content
                          }
                          isCard={true}
                        />
                        {/* <h3 className="text-gray-700 text-lg font-medium">
                          Product Categories
                        </h3> */}
                        {/* <Info size={16} className="text-gray-400" /> */}
                      </div>
                      <Button
                        variant="outline"
                        className="h-8 px-4 text-gray-700 border-gray-200"
                      >
                        Details
                      </Button>
                    </div>

                    <div className="flex items-baseline gap-3 mb-4">
                      <h2 className="text-4xl font-semibold">
                        {data.percentage}%
                      </h2>
                    </div>

                    <div className="flex gap-0.5 h-6 mb-5">
                      {[...Array(totalBars)].map((_, index) => (
                        <div
                          key={index}
                          className={`flex-1 ${index < filledBars ? "bg-orange-500" : "bg-gray-100"}`}
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <TextComponent
                          section={
                            Array.isArray(item.content)
                              ? item.content[1]
                              : item.content
                          }
                          isCard={true}
                        />
                        {/* <span className="text-lg font-medium text-gray-700">
                          {data.name}
                        </span> */}
                      </div>
                    </div>
                  </div>

                  {!livemode &&
                    Array.isArray(section.content) &&
                    index === section.content.length - 1 && (
                      <button
                        onClick={handleAddItem}
                        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 border border-gray-200"
                      >
                        <Plus className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                </li>
              ))}
            </ol>
          </>
        );
      case "category_scores_long":
        return (
          <ol className="space-y-4">
            {section.content.map((item, index) => (
              <li
                className={cn("relative", item.className, {
                  "!border-yellow-500 !border-solid":
                    state.hoveredState.isItemHovered &&
                    state.hoveredState.itemIndex === index,
                  "border-dashed border-[1px] border-gray-300": !livemode,
                })}
                style={item.styles}
                onMouseEnter={() => onItemHover(index, true)}
                onMouseLeave={() => onItemHover(null, false)}
              >
                {isItemHovered && hoveredItemIndex === index && (
                  <>
                    <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-none rounded-t-lg">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100">
                            <Ellipsis className="w-3 h-2" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-max p-2 absolute -left-32 -top-12">
                          <CategoryScoreStylist
                            parentSection={section}
                            item={item}
                            index={index}
                            onTierChange={setSelectedTierId}
                          />
                        </PopoverContent>
                      </Popover>
                    </Badge>
                  </>
                )}

                <div
                  className={cn(
                    "w-full min-h-[300px]   p-5 ",
                    "themed-card",
                    item.className
                  )}
                  style={{
                    ...styles,
                    backgroundColor:
                      item.styles.backgroundColor ||
                      section.settings?.smartLayout_cardBackgroundColor,
                  }}
                >
                  <CardHeader className="relative">
                    <CardTitle className="">
                      <TextComponent
                        section={item.content.find(
                          (c) => c.type === "catItemTitle"
                        )}
                      />
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                      <Badge
                        variant="outline"
                        className="flex gap-1 rounded-lg text-xs"
                      >
                        45%
                      </Badge>
                    </div>
                  </CardHeader>
                  <div className="p-6">
                    <TextComponent
                      section={item.content.find(
                        (c) => c.type === "catItemDescription"
                      )}
                    />
                  </div>
                </div>
                {!livemode &&
                  Array.isArray(section.content) &&
                  index === section.content.length - 1 && (
                    <button
                      onClick={handleAddItem}
                      className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 border border-gray-200"
                    >
                      <Plus className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
              </li>
            ))}
          </ol>
        );

      default:
        return null;
    }
  }, [
    section,
    livemode,
    hoveredItemIndex,
    selectedTierId,
    setSelectedTierId,
    livemode,
    // handleMouseOnCard,
  ]);

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative",

          {
            "!border-blue-500 !border-solid":
              state.hoveredState.isLayoutHovered,
            "border-dashed border-[1px] border-slate-300 my-2": !livemode,
          }
        )}
        onMouseEnter={() => handleMouseEvents.onLayoutHover(true)}
        onMouseLeave={() => handleMouseEvents.onLayoutHover(false)}
        // onClick={handleClick}
      >
        {state.hoveredState.isLayoutHovered && (
          <Badge className="absolute top-[0px] left-1/2 rounded-none rounded-t-lg ">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100">
                  <Ellipsis className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-max p-2 absolute -left-32 -top-20">
                <SmartLayoutStylist section={section} />
              </PopoverContent>
            </Popover>
          </Badge>
        )}
        {renderContent()}
      </div>
    </>
  );
};

export default React.memo(CategoryScoresComponent);
