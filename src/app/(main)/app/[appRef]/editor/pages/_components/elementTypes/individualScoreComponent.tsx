"use client";

import {
  SquarePen, // Icon for layout type
  Image as ImageIcon,
  Cog, // For Timeline (Placeholder)
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info, Pencil } from "lucide-react";
import React, { memo, useCallback, useMemo, useState } from "react";

import IndividualScoreStylist from "./elementUtils/individualScoreStylist";

import TextComponent from "./textContainer";
import ResultMediaChart from "@/components/charts/resultsCharts/mediaChart";
import ResultScoreGaugeChart from "@/components/charts/resultsCharts/gaugeChart";
import ResultTextBlockChart from "@/components/charts/resultsCharts/textBlockChart";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";

type Props = { section: ElementNode };
type IndividualScoreComponentHeaderProps = { element: ElementNode };
type IndividualScoreComponentChartProps = { element: ElementNode };
//type IndividualScoreComponentChartProps = { element: ElementNode };

const IndividualScoreComponentHeader = memo(
  ({ element }: IndividualScoreComponentHeaderProps) => {
    const { livemode, device, scoretiers, previewMode } = usePageBuilderStore();
    const { settings } = element;
    console.log(element);

    // 1. Prepare Chart Settings
    const chartSettings = useMemo(
      () => ({
        showLabels: settings?.showChartLabels,
      }),
      [settings?.showChartLabels]
    );

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="p-2.5 bg-gray-100 rounded-full">
            <Clock className="w-5 h-5 text-gray-800" strokeWidth={2.5} />
          </div> */}
          {/* <h2 className="text-xl font-semibold text-gray-900">
            Marketing Score
          </h2> */}
          <TextComponent section={element} />
        </div>
        <div className="p-1.5  ">
          {/* <MoreVertical className="w-5 h-5 text-gray-600" strokeWidth={2} /> */}
          <Badge
            variant="default"
            className="border-transparent bg-green-600/30 text-green-600 hover:bg-green-600/60"
          >
            Badge
          </Badge>
        </div>
      </div>
    );
  }
);
IndividualScoreComponentHeader.displayName = "IndividualScoreComponentHeader";

const IndividualScoreComponentChart = memo(
  ({ element }: IndividualScoreComponentChartProps) => {
    const {
      livemode,
      previewMode,
      device,

      scoretiers,
      updateElementProperty,
    } = usePageBuilderStore();
    if (!element) return;
    const { settings } = element;
    // 1. Prepare Chart Settings
    const chartSettings = useMemo(
      () => ({
        showLabels: settings?.showChartLabels,
      }),
      [settings?.showChartLabels]
    );

    const gaugeData = {
      overallScoreData: {
        score_percentage: "60",
      },
    };

    // 5. Select Chart Component to Render
    const chartToRender = useMemo(() => {
      const chartType = settings?.chart_type || "text_block";
      switch (chartType) {
        case "text_block":
          return <ResultTextBlockChart section={element} />;

        case "gauge":
          return (
            <ResultScoreGaugeChart
              overallScoreData={gaugeData?.overallScoreData}
            />
          );
        case "image":
          return <ResultMediaChart section={element} />;
        case "video":
          return <ResultMediaChart section={element} />;
        default:
          return <ResultTextBlockChart section={element} />;
      }
    }, [previewMode, device, settings?.chart_type, chartSettings]);

    return (
      <div className="flex flex-col items-center justify-center gap-8 py-2">
        {/* Circular Arc with Score Display */}
        <div
          className={cn(
            "relative w-full min-h-48 h-auto  flex items-center justify-center",
            settings?.chart_type !== "text_block" && "aspect-video"
          )}
        >
          {chartToRender}
          {/* <CircularProgressArc score={score} maxScore={maxScore} /> */}

          {/* Centered Score Display */}
          {/* <div className="absolute flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className="text-6xl font-bold text-gray-900">{score}</span>
                <span className="text-lg text-gray-400">/{maxScore}</span>
              </div>
            </div> */}
        </div>

        {/* Scale Labels */}
        {/* <div className="flex w-full justify-between px-6 text-sm text-gray-400">
            <span>0</span>
            <span>100</span>
          </div> */}
      </div>
    );
  }
);
IndividualScoreComponentChart.displayName = "IndividualScoreComponentChart";

/**
 * Feedback Section Component
 * Displays feedback title and description with an accent gradient circle
 */

const IndividualScoreComponentFeedback = memo(
  ({ element }: { element: ElementNode }) => {
    const { livemode, device, scoretiers, previewMode } = usePageBuilderStore();
    const { settings } = element;
    const titleElement: ElementNode | undefined = Array.isArray(
      element?.content
    )
      ? element?.content.filter(
          (s) => s.type === "IndividualScoreFeedbackTitle"
        )[0]
      : undefined;
    const descriptionElement: ElementNode | undefined = Array.isArray(
      element?.content
    )
      ? element?.content.filter(
          (s) => s.type === "IndividualScoreFeedbackDescription"
        )[0]
      : undefined;

    return (
      <div className="flex gap-4 items-start">
        {/* Gradient Circle Badge */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 shadow-lg shadow-blue-300/40 flex-shrink-0" />
        </div>

        {/* Feedback Content */}
        <div className="flex-1 pt-0.5">
          {/* <h3 className="text-lg font-bold text-gray-900 mb-1">
            Good, room for improvement
          </h3> */}
          <TextComponent section={titleElement as ElementNode} />
          <TextComponent section={descriptionElement as ElementNode} />
          {/* <p className="text-sm text-gray-500 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p> */}
        </div>
      </div>
    );
  }
);
IndividualScoreComponentFeedback.displayName =
  "IndividualScoreComponentFeedback";

// function FeedbackSection({ element }: { element: ElementNode }) {
//   const titleElement: ElementNode | undefined = Array.isArray(element?.content)
//     ? element?.content.filter(
//         (s) => s.type === "IndividualScoreFeedbackTitle"
//       )[0]
//     : undefined;
//   const descriptionElement: ElementNode | undefined = Array.isArray(
//     element?.content
//   )
//     ? element?.content.filter(
//         (s) => s.type === "IndividualScoreFeedbackDescription"
//       )[0]
//     : undefined;

//   return (
//     <div className="flex gap-4 items-start">
//       {/* Gradient Circle Badge */}
//       <div className="flex-shrink-0 mt-0.5">
//         <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 shadow-lg shadow-blue-300/40 flex-shrink-0" />
//       </div>

//       {/* Feedback Content */}
//       <div className="flex-1 pt-0.5">
//         <h3 className="text-lg font-bold text-gray-900 mb-1">
//           Good, room for improvement
//         </h3>
//         <p className="text-sm text-gray-500 leading-relaxed">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
//           eiusmod tempor incididunt ut labore et dolore magna aliqua.
//         </p>
//       </div>
//     </div>
//   );
// }

const IndividualScoreComponent = ({ section }: Props) => {
  const { livemode, previewMode, activeElementId, setActiveElementId } =
    usePageBuilderStore();

  const { id } = section;
  const [hoveredItemId, setHoveredItemId] = useState<string | number | null>(
    null
  );

  const level = 88;
  const headerSection: ElementNode | undefined = Array.isArray(section?.content)
    ? section?.content.filter((s) => s.type === "IndividualScoreHeader")[0]
    : undefined;
  const chartSection: ElementNode | undefined = Array.isArray(section?.content)
    ? section?.content.filter((s) => s.type === "IndividualScoreChart")[0]
    : undefined;
  const feedBackSection: ElementNode | undefined = Array.isArray(
    section?.content
  )
    ? section?.content.filter((s) => s.type === "IndividualScoreFeedback")[0]
    : undefined;
  const clampedLevel = Math.min(Math.max(level, 0), 100);
  //const { name } = getLevelDetails({ level: clampedLevel });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!livemode && !previewMode) {
      setActiveElementId(id);
    }
  };

  const handleMouseEnter = () => {
    if (!livemode && !previewMode) setHoveredItemId(id);
  };
  const handleMouseLeave = () => {
    if (!livemode && !previewMode) setHoveredItemId(null);
  };

  const isSelected = !livemode && !previewMode && activeElementId === id;
  const showEditorUI =
    !livemode && !previewMode && (hoveredItemId === id || isSelected);

  return (
    <div
      className={cn(
        "relative mt-3 max-w-[44rem] flex items-center justify-center p-4 ",

        !livemode && !previewMode && "p-1"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Border Overlay */}
      <div
        className={cn(
          "absolute inset-0 rounded-md transition-all duration-200 ",
          !showEditorUI && !isSelected && "border border-transparent", // Fully transparent when not hovered or selected
          showEditorUI && "border-dashed border-2 border-gray-400 rounded-sm",
          showEditorUI &&
            isSelected &&
            "border-2 border-solid border-indigo-600 rounded-sm "
        )}
        onClick={handleClick}
      />
      {showEditorUI && (
        <div
          className={cn(
            "absolute z-50 right-2 top-3 left-2 -translate-y-1/3 transition-opacity",
            showEditorUI ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex flex-row flex-nowrap justify-start ">
            <div className="flex flex-row flex-nowrap space-x-1.5 text-white bg-[#2463eb] hover:bg-[#2463eb] shadow-md rounded-md">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-transparent">
                    <Cog className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[18rem] p-2 absolute -left-4 shadow-none bg-transparent border-none">
                  {chartSection && section && (
                    <IndividualScoreStylist
                      parentElement={section}
                      chartElement={chartSection}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto bg-white rounded-3xl shadow-lg p-6 font-sans space-y-2">
        {/* Header Section */}
        {headerSection && (
          <IndividualScoreComponentHeader element={headerSection} />
        )}
        {/* Progress Chart Section */}
        {chartSection && (
          <IndividualScoreComponentChart element={chartSection} />
        )}
        {/* Divider */}
        <div className="h-px bg-gray-100 my-4" />
        {/* Feedback Section */}
        {feedBackSection && (
          <IndividualScoreComponentFeedback element={feedBackSection} />
        )}
      </div>
    </div>
  );
};

export default React.memo(IndividualScoreComponent);
