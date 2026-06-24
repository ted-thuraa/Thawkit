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
  ArrowRight,
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

import { debounce } from "lodash";
import CategoryScoresItemStylist from "./elementUtils/catItemStylist";
import SectionTemplatesDialog from "../helpers/templatesDialog";
import { DialogProvider } from "@/providers/dialog-provider";
import Switcher from "../recursiveComponent";
import { BiEdit } from "react-icons/bi";
import CircularGauge from "@/components/charts/regularCharts/customCircularGaugeChart";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { section: ElementNode };

const renderDetailedCategoryScores = (
  parentElement: ElementNode,
  element: ElementNode,
  index: number,
  data: {
    overallScore: any;
    categoryScore: Array<{
      id: string;
      label: string;
      value: number;
      color: string;
    }>;
  }
) => {
  const {
    livemode,
    previewMode,
    categories,
    scoretiers,
    activeElementId,
    selectedSectionId,
    editingElementId,
    setEditingElementId,
    updateElementProperty,
    setActiveElementId,
  } = usePageBuilderStore();
  const { id, content, name, styles, className, type, settings } = element;
  const [hoveredItemIndex, setHoveredItemIndex] = useState<
    number | string | null
  >(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  const [hoveredEditableId, setHoveredEditableId] = useState<string | null>(
    null
  );
  const [htmlContent, setHtmlContent] = useState<string>("");

  const handleItemMouseEnter = useCallback(
    (index: number) => {
      if (!livemode) setHoveredItemIndex(index);
    },
    [livemode]
  );
  const handleItemMouseLeave = useCallback(() => {
    if (!livemode) setHoveredItemIndex(null);
  }, [livemode]);
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

  useEffect(() => {
    if (element.settings?.contentIsDynamic && scoretiers.length > 0) {
      const firstTierId = scoretiers[0].id;
      setSelectedTierId(firstTierId);
      //onTierChange(firstTierId);
    }
  }, [element.settings?.contentIsDynamic, scoretiers]);

  const isItemActive = !livemode && activeElementId === element.id;
  const isItemHovered = !livemode && hoveredItemIndex === index;

  const dynamicScoreInfo: DynamicScoreInfo = useMemo(
    () => generateDynamicScoreInfo(selectedTierId, scoretiers),
    [selectedTierId, scoretiers]
  );
  // Create a function to get content for a specific element
  const getDisplayContent = useCallback(
    (element: any) => {
      let data = {
        innerText: "",
      };

      // Handle non-dynamic content
      if (!element.settings?.contentIsDynamic) {
        if (!Array.isArray(element.content) && element.content?.innerText) {
          data.innerText = element.content.innerText;
        }
        return data;
      }

      // Handle dynamic content
      if (!Array.isArray(element.content)) {
        // If element has metaDynamic data
        if (
          element.content?.metaDynamic &&
          Array.isArray(element.content.metaDynamic)
        ) {
          const tierContent = element.content.metaDynamic.find(
            (item: any) => item.score_tier_id === selectedTierId
          );

          if (tierContent && tierContent.content?.innerText) {
            data.innerText = tierContent.content.innerText;
          }
        }
      }

      return data;
    },
    [element.settings?.contentIsDynamic, selectedTierId, element.content]
  );

  const createDebouncedPropertyUpdater = useCallback(
    (elementId: string, Path: string) =>
      debounce((newValue: string) => {
        if (!element.settings?.contentIsDynamic && selectedTierId) {
          const propertyPath = `content.metaDynamic.${selectedTierId}.${Path}`;
          if (elementId) {
            updateElementProperty(
              elementId,
              propertyPath,
              newValue,
              selectedSectionId as string
            );
          } else {
            console.warn(
              `Cannot update property ${propertyPath} for element ${elementId}: selectedSectionId is ${selectedSectionId} or elementId is missing.`
            );
          }
        } else {
          const propertyPath = `${Path}`;
          console.log({ elementId, propertyPath, newValue });
          updateElementProperty(
            elementId,
            propertyPath,
            newValue,
            selectedSectionId as string
          );
        }
      }, 500),
    [
      selectedSectionId,
      selectedTierId,
      settings?.contentIsDynamic,
      updateElementProperty,
    ]
  );

  // Fix the debouncedUpdateCatScoreTitle implementation
  const debouncedUpdateCatScoreTitle = useCallback(
    (newValue: string, elementId: string) => {
      const updater = createDebouncedPropertyUpdater(
        elementId,
        "content.innerText"
      );
      updater(newValue);
    },
    [createDebouncedPropertyUpdater]
  );

  const handleHtmlUpdate = useCallback(
    (newValue: string, elementId: string) => {
      const updater = createDebouncedPropertyUpdater(
        elementId,
        "content.innerText"
      );
      updater(newValue);
    },
    [createDebouncedPropertyUpdater]
  );

  const handleIconChange = useCallback(
    (itemId: string, iconName: string) => {
      if (itemId) {
        updateElementProperty(
          itemId, // The ID of the layout_item being changed
          "settings.iconName",
          iconName,
          selectedSectionId as string // The ID of the smart_layout container
        );
      }
      // Note: Sheet closing is handled within IconPicker's onSelect -> handleSelect
    },
    [element.id, updateElementProperty] // Add section.id dependency
  );

  return (
    <div
      key={element.id}
      data-slot="card"
      className={cn(
        "themed-card relative flex flex-col rounded-xl shrink-0 ring-muted/60 border shadow-sm ring-3",
        !livemode &&
          !previewMode &&
          isItemActive &&
          "outline-1  outline-indigo-600 outline-offset-2",
        // Optional: Hover state outline (Dashed) - only if not active
        !livemode &&
          !previewMode &&
          isItemHovered &&
          !isItemActive &&
          "outline-1 outline-dashed outline-indigo-400 outline-offset-2",
        // Default border in edit mode only if not active and not hovered
        !livemode &&
          !previewMode &&
          !isItemActive &&
          !isItemHovered &&
          "outline-none",
        "cursor-pointer"
      )}
      onMouseEnter={() => handleItemMouseEnter(index)}
      onMouseLeave={handleItemMouseLeave}
      onClick={(e) => handleItemClick(e, element.id)}
    >
      {(isItemActive || isItemHovered) && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
          <PopoverProvider
            trigger={
              <button
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100 "
                aria-label="Edit Item"
              >
                <Ellipsis className="w-3 h-3" />
              </button>
            }
            className="w-max p-0 bg-transparent absolute left-1/2 -translate-x-1/2 -top-16"
          >
            <CategoryScoresItemStylist
              Item={element}
              index={index}
              onTierChange={setSelectedTierId}
            />
          </PopoverProvider>
        </Badge>
      )}

      <div
        data-slot="card-header"
        className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-5 pt-4 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-2 pb-0"
      >
        <div className="flex items-start justify-between pt-2 px-1">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start gap-4">
              {element.settings?.iconName && (
                <div className="bg-gray-200 rounded-md p-2">
                  <IconPicker
                    value={element.settings?.iconName || "HelpCircle"}
                    onChange={(iconName) =>
                      handleIconChange(element.id, iconName)
                    }
                    editorTrigger={
                      <div className="group/DetailedCategoryScoreIcon w-full h-full">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/DetailedCategoryScoreIcon:opacity-100 rounded-md z-40">
                          <BiEdit className="h-4 w-4 text-white" />
                        </div>
                        <DynamicLucideIcon
                          name={element.settings?.iconName} // Use dynamic icon
                          className="w-6 h-6" // Default size
                          // Add color/styling based on theme or item state if needed
                        />
                      </div>
                    }
                  />
                </div>
              )}

              <div
                className={cn(
                  "focus:outline-none",
                  !livemode &&
                    "cursor-text transition-all duration-150 ease-in-out p-1",
                  !livemode &&
                    hoveredEditableId ===
                      (Array.isArray(element.content)
                        ? element.content[0]?.id
                        : "") &&
                    editingElementId !==
                      (Array.isArray(element.content)
                        ? element.content[0]?.id
                        : "") &&
                    "outline-dashed outline-1 outline-indigo-600 rounded-sm",
                  !livemode &&
                    editingElementId ===
                      (Array.isArray(element.content)
                        ? element.content[0]?.id
                        : "") &&
                    "outline outline-2 outline-indigo-600 rounded-sm"
                )}
                onClick={(e) => {
                  if (!livemode) {
                    e.stopPropagation();
                    setEditingElementId(
                      Array.isArray(element.content)
                        ? element.content[0]?.id
                        : null
                    );
                    setActiveElementId(element.id);
                  }
                }}
                onMouseEnter={(e) => {
                  if (!livemode) {
                    e.stopPropagation();
                    setHoveredEditableId(
                      Array.isArray(element.content)
                        ? element.content[0]?.id
                        : null
                    );
                  }
                }}
                onMouseLeave={(e) => {
                  if (!livemode) {
                    e.stopPropagation();
                    setHoveredEditableId(null);
                  }
                }}
              >
                {/* <h3 className="text-xl font-semibold mb-2">DeepSick</h3> */}
                <EditableElement
                  key={`${Array.isArray(element.content) && element.content[0].id}-title`}
                  elementId={
                    (Array.isArray(element.content) &&
                      element.content[0]?.id) ||
                    ""
                  }
                  sectionId={selectedSectionId as string}
                  element={element}
                  value={
                    getDisplayContent(
                      Array.isArray(element.content)
                        ? element.content[0]
                        : element.content
                    ).innerText
                  }
                  fieldType="innerText"
                  contentSource={
                    settings?.contentIsDynamic ? "dynamic" : "static"
                  }
                  tierId={selectedTierId as string}
                  style={styles}
                  className="text-[22px] leading-[1.15] font-semibold tracking-tight max-w-[44rem]"
                  // className="font-medium text-[48px] leading-[1.1] md:text-[36px] tracking-[-0.05em]  "
                  isCard={false}
                  onHtmlUpdate={(val) => {
                    if (!livemode) {
                      handleHtmlUpdate(
                        val,
                        Array.isArray(element.content)
                          ? element.content[0].id
                          : ""
                      );
                      //setEditingElementId(null);
                    }
                  }}
                  htmlContent={
                    getDisplayContent(
                      Array.isArray(element.content)
                        ? element.content[0]
                        : element.content
                    ).innerText
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: dynamicScoreInfo.tier?.score_colour
                  ? `${dynamicScoreInfo.tier.score_colour}20`
                  : "#e5e7eb",
                color: dynamicScoreInfo.tier?.score_colour || "#6b7280",
              }}
            >
              {dynamicScoreInfo.tier?.name}
            </span>
          </div>
        </div>
      </div>

      <div data-slot="card-content" className="px-5 pb-4">
        <div
          className={cn(
            "focus:outline-none",
            !livemode &&
              "cursor-text transition-all duration-150 ease-in-out p-1",
            !livemode &&
              hoveredEditableId ===
                (Array.isArray(element.content)
                  ? element.content[1]?.id
                  : "") &&
              editingElementId !==
                (Array.isArray(element.content)
                  ? element.content[1]?.id
                  : "") &&
              "outline-dashed outline-1 outline-indigo-600 rounded-sm",
            !livemode &&
              editingElementId ===
                (Array.isArray(element.content)
                  ? element.content[1]?.id
                  : "") &&
              "outline outline-2 outline-indigo-600 rounded-sm"
          )}
          onClick={(e) => {
            if (!livemode) {
              e.stopPropagation();
              setEditingElementId(
                Array.isArray(element.content) ? element.content[1]?.id : null
              );
              setActiveElementId(element.id);
            }
          }}
          onMouseEnter={(e) => {
            if (!livemode) {
              e.stopPropagation();
              setHoveredEditableId(
                Array.isArray(element.content) ? element.content[1]?.id : null
              );
            }
          }}
          onMouseLeave={(e) => {
            if (!livemode) {
              e.stopPropagation();
              setHoveredEditableId(null);
            }
          }}
        >
          <EditableElement
            key={`${Array.isArray(element.content) && element.content[1].id}-description`}
            elementId={
              (Array.isArray(element.content) && element.content[1]?.id) || ""
            }
            sectionId={selectedSectionId as string}
            element={element}
            value={
              getDisplayContent(
                Array.isArray(element.content)
                  ? element.content[1]
                  : element.content
              ).innerText
            }
            fieldType="innerText"
            contentSource={settings?.contentIsDynamic ? "dynamic" : "static"}
            tierId={selectedTierId as string}
            style={styles}
            className="text-[16px] leading-[1.6] font-normal"
            // className="text-[20px] break-words"
            isCard={false}
            onHtmlUpdate={(val) => {
              if (!livemode) {
                handleHtmlUpdate(
                  val,
                  Array.isArray(element.content) ? element.content[1].id : ""
                );
                //setEditingElementId(null);
              }
            }}
            htmlContent={
              getDisplayContent(
                Array.isArray(element.content)
                  ? element.content[1]
                  : element.content
              ).innerText
            }
          />
        </div>
      </div>
      {(isItemActive || isItemHovered) && (
        <Badge className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-50 bg-transparent hover:bg-transparent">
          <DialogProvider
            trigger={
              <button
                className="flex items-center justify-center  border-none  w-8 h-8 rounded-full bg-indigo-700 text-gray-100 "
                aria-label="Add Item"
              >
                <Plus className="h-4 w-4" />
              </button>
            }
            title="Templates"
            description="Select a section template to add it to the page."
            className="max-w-[100vw] w-[80vw] min-h-[500px] max-h-[95vh] bg-editor-component text-editor-foreground border-b border-editor-border shadow-md"
          >
            <SectionTemplatesDialog
              atIndex={true}
              index={element.id}
              parentContainerId={parentElement.id}
              templateOptions={["cta", "video", "advert"]}
            />
          </DialogProvider>
        </Badge>
      )}
    </div>
  );
};

const DetailedCategoryScoreComponent = ({ section }: Props) => {
  const {
    livemode,
    theme,
    selectedSectionId,
    categories,
    addLayoutItem,
    setSelectedSectionId,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  //const [state, dispatch] = useReducer(layoutReducer, initialLayoutState);

  const [isItemHovered, setIsItemHovered] = useState<boolean>(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  const { id, content, name, styles, className, type } = section;

  const containerRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(
    () => prepareNivoPieChartData(categories),
    [categories]
  );
  const OverallScore = useMemo(() => getSampleOverallScoreData(), []);

  const data = {
    overallScore: OverallScore,
    categoryScore: chartData,
  };

  const handleAddItem = useCallback(() => {
    if (!section.id) {
      console.warn("Cannot add item - section ID is missing");
      return;
    }

    if (!section.settings?.smart_layout_type) {
      console.warn("Cannot add item - layout type is missing");
      return;
    }

    //addLayoutItem(section.id, section.settings.smart_layout_type);
  }, [section.id, section.settings?.smart_layout_type]);

  return (
    <>
      <div ref={containerRef} className={cn("relative mt-4")}>
        <div className="grid gap-4">
          {/* {Array.isArray(content) &&
            content.map((childsection, index) => {
              if (childsection.type === "catItem") {
                return (
                  <div key={childsection.id}>
                    {renderDetailedCategoryScores(
                      section,
                      childsection,
                      index,
                      data
                    )}
                  </div>
                );
              } else {
                return (
                  <Switcher key={childsection.id} section={childsection} />
                );
              }
            })} */}
          <PredictionCard
            question="Will Bitcoin dip below $100k before 2026?"
            percentage={60}
            volume="$2m"
            iconType="bitcoin"
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(DetailedCategoryScoreComponent);

// --- Helper Component for the Circular Progress Bar (Gauge) ---
// This custom SVG component replicates the semi-circular progress bar design.
interface GaugeProps {
  percentage: number;
}

const Gauge: React.FC<GaugeProps> = ({ percentage }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  // The gauge is a semi-circle, so the stroke-dasharray should be half the circumference.
  const semiCircumference = circumference / 2;
  // The progress is calculated based on the percentage of the semi-circle.
  const progress = (percentage / 100) * semiCircumference;

  // The gradient colors are visually estimated from the image (dark blue to bright green).
  const startColor = "#1e3a8a"; // Dark Blue
  const endColor = "#10b981"; // Bright Green

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
        {/* Background Arc (Dark Gray) */}
        <circle
          cx="35"
          cy="35"
          r={radius}
          fill="none"
          stroke="#374151" // Tailwind gray-700 equivalent
          strokeWidth="6"
          strokeDasharray={semiCircumference}
          strokeDashoffset={semiCircumference}
          strokeLinecap="round"
          style={{ transformOrigin: "center", transform: "rotate(180deg)" }}
        />

        {/* Progress Arc (Gradient Effect) */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: startColor, stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: endColor, stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <circle
          cx="35"
          cy="35"
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="6"
          strokeDasharray={semiCircumference}
          strokeDashoffset={semiCircumference - progress}
          strokeLinecap="round"
          style={{ transformOrigin: "center", transform: "rotate(180deg)" }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pt-2 text-center">
        <span className="text-xl font-bold text-white leading-none">
          {percentage}%
        </span>
        <span className="text-xs text-gray-400 block leading-none">chance</span>
      </div>
    </div>
  );
};

// --- Main Component ---
interface PredictionCardProps {
  question: string;
  percentage: number;
  volume: string;
  iconType: "bitcoin" | "polymarket";
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  question,
  percentage,
  volume,
  iconType,
}) => {
  // Custom colors for pixel-perfect match
  const CARD_BG = "bg-[#1E293B]"; // Dark Slate Blue
  const YES_COLOR = "bg-[#059669]"; // Emerald-600 equivalent
  const NO_COLOR = "bg-[#4b5563]/40"; // Dark Gray with transparency

  const IconComponent = iconType === "bitcoin" ? Bitcoin : LayoutGrid;
  const IconBg = iconType === "bitcoin" ? "bg-orange-500" : "bg-indigo-500";

  return (
    <div
      className={`max-w-sm p-5 rounded-xl ${CARD_BG} shadow-2xl border border-white/10 backdrop-blur-sm`}
      style={{
        boxShadow:
          "0 4px 15px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 255, 255, 0.05) inset",
      }}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4 pr-4">
          {/* Icon */}
          <div className={`p-2 rounded-md ${IconBg} flex-shrink-0`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          {/* Question */}
          <h2 className="text-xl font-semibold text-white leading-snug">
            {question}
          </h2>
        </div>
        {/* Gauge/Percentage */}
        <div className="flex-shrink-0">
          {/* <Gauge percentage={percentage} /> */}
          <CircularGauge value={60} size={60} thickness={4} label="success" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-5">
        {/* Yes Button */}
        <button
          className={`flex-1 py-3 rounded-lg font-bold text-white transition duration-200 hover:opacity-90 ${YES_COLOR}`}
        >
          Yes
        </button>
        {/* No Button */}
        <button
          className={`flex-1 py-3 rounded-lg font-bold text-red-400 transition duration-200 hover:opacity-90 ${NO_COLOR}`}
        >
          No
        </button>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        {/* Volume */}
        <span>{volume} Vol.</span>
        {/* Icons */}
        <div className="flex space-x-3">
          <Gift className="w-5 h-5 cursor-pointer hover:text-white transition" />
          <Bookmark className="w-5 h-5 cursor-pointer hover:text-white transition" />
        </div>
      </div>
    </div>
  );
};
