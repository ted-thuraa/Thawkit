"use client";

import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo,
  useRef,
} from "react";
import {
  Check,
  ChevronsUpDown,
  Cog,
  Copy,
  Ellipsis,
  Eye,
  ImageIcon,
  Info,
  Palette,
  Settings2,
  Terminal,
  Trash,
  TrendingUp,
} from "lucide-react";
import { cn, sortScoreTiersByRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import ResultScoreGaugeChart from "@/components/charts/resultsCharts/gaugeChart";
import { ResultRadarChart } from "@/components/charts/resultsCharts/resultsRadarChart";
import { ResultPieChart } from "@/components/charts/resultsCharts/resultsPieChart";
import { ResultRadialChart } from "@/components/charts/resultsCharts/resultRadialChart";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScoreTiers } from "@/lib/types/project";
import CategoryScoresItemStylist from "../../elementUtils/catItemStylist";
import ResultChartStylist from "../../elementUtils/resultChartStylist";
import { SheetProvider } from "@/providers/sheet-provider";

// --- Type Definitions (Refactored for clarity) ---

type ScoreData = {
  overallScore: any;
  categoryScores: Array<{
    categoryId: string;
    categoryTitle: string;
    scoreTierColor: string;
    scoreTierId: string;
    scoreTierName: string;
    score_percentage: string;
  }>;
};

type ChartContainerProps = {
  element: ElementNode;
};

type AllTiersData = Array<{
  scoreTierId: string;
  data: ScoreData;
}>;

type CategorySnapshotsProps = {
  element: ElementNode;
  allTiersData: AllTiersData; // Corrected type
  randomTierData: ScoreData;
  show: boolean;
};

type CategorySnapshotItemProps = {
  childsection: ElementNode;
  index: number;
  allTiersData: AllTiersData; // Corrected type
  randomTierData: ScoreData;
  isItemHovered: boolean;
  isItemActive: boolean;
  handleItemMouseEnter: (index: number) => void;
  handleItemMouseLeave: () => void;
  handleItemClick: (e: React.MouseEvent, itemId: string) => void;
};

type CompositionOutcomeProps = { section: ElementNode };

// --- Utility Hooks and Functions ---

/**
 * Custom hook to manage hover and active state of an element in the editor.
 * @param elementId The ID of the element.
 * @returns An object with hover/active state and event handlers.
 */
const useEditorElementState = (elementId: string) => {
  const { livemode, previewMode, activeElementId, setActiveElementId } =
    usePageBuilderStore();
  const [isHovered, setIsHovered] = useState(false);

  const isElementActive =
    !livemode && !previewMode && activeElementId === elementId;
  const isEditable = !livemode && !previewMode;

  const handleMouseEnter = useCallback(() => {
    if (isEditable) {
      setIsHovered(true);
    }
  }, [isEditable]);

  const handleMouseLeave = useCallback(() => {
    if (isEditable) {
      setIsHovered(false);
    }
  }, [isEditable]);

  const handleElementClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent bubbling
      if (isEditable) {
        setActiveElementId(elementId); // Set this element as active
      }
    },
    [isEditable, setActiveElementId, elementId]
  );

  return {
    isHovered,
    isElementActive,
    isEditable,
    handleMouseEnter,
    handleMouseLeave,
    handleElementClick,
  };
};

// --- Sub-Components (Refactored for performance and maintainability) ---

/**
 * Component to render the main chart based on settings.
 * Memoized for performance.
 */
const ChartContainer = memo(({ element }: ChartContainerProps) => {
  const { livemode, device, scoretiers, resultDummyData, previewMode } =
    usePageBuilderStore();
  const { settings } = element;
  const sortedScoreTiers = sortScoreTiersByRange(scoretiers);
  console.log(resultDummyData);

  const data = useMemo(() => {
    const defaultData: ScoreData = {
      overallScore: {},
      categoryScores: [],
    };

    if (!resultDummyData || resultDummyData.length === 0) {
      return defaultData;
    }

    // FIX: The original code was accessing the 'data' property of the randomly selected sample.
    const randomIndex = Math.floor(Math.random() * resultDummyData.length);
    return resultDummyData[randomIndex].data || defaultData;
  }, [resultDummyData]);

  // 1. Prepare Chart Settings
  const chartSettings = useMemo(
    () => ({
      showLabels: settings?.showChartLabels,
    }),
    [settings?.showChartLabels]
  );

  // 2. Prepare Pie Chart Data
  const pieChartData = useMemo(
    () => ({
      data:
        data?.categoryScores?.map((score) => ({
          id: score.categoryTitle,
          label: score.categoryTitle,
          value: parseFloat(score.score_percentage) || 0,
          color: score.scoreTierColor,
        })) || [],
      overallScoreData: data?.overallScore,
    }),
    [data, resultDummyData]
  );

  // 3. Prepare Radial Chart Data
  const radialChartData = useMemo(() => {
    const scores = data?.categoryScores || [];
    const chartData =
      scores
        .map((score: any) => {
          const tier = scoretiers.find((t) => t.id === score.scoreTierId);
          const yValue = score.score_percentage
            ? parseFloat(score.score_percentage)
            : null;

          return {
            id: score.categoryTitle,
            data: [
              {
                x: tier?.name,
                y: yValue,
              },
            ],
          };
        })
        .filter(
          (
            item: any
          ): item is { id: string; data: [{ x: string; y: number }] } =>
            item.id !== null &&
            item.data[0].x !== undefined &&
            item.data[0].y !== null &&
            !isNaN(item.data[0].y)
        ) || [];

    const chartColors =
      scores.map((score) => score.scoreTierColor).filter(Boolean) || [];

    return {
      data: chartData,
      colors: chartColors,
      overallScoreData: data?.overallScore,
    };
  }, [data, scoretiers, resultDummyData]);

  // 4. Prepare Radar Chart Data
  const radarChartData = useMemo(
    () => ({
      data:
        data?.categoryScores
          ?.map((score: any) => ({
            category: score.categoryTitle || "Unnamed",
            color: score.scoreTierColor,
            score: score.score_percentage
              ? parseFloat(score.score_percentage)
              : 0,
          }))
          .filter((item: any) => item.category !== null) || [],
      keys: ["score"],
      grids: scoretiers.length,
      colors:
        data?.categoryScores
          ?.filter((score: any) => score.category !== null)
          ?.map((score: any) => score.scoreTierColor) || [],
    }),
    [data, scoretiers, resultDummyData]
  );

  const gaugeChartData = useMemo(
    () => ({
      data: sortedScoreTiers.map((score: ScoreTiers) => ({
        limit: score.scoreTo,
        color: score.scoreColour || "#F5CD19",
        showTick: true,
        label: score.name,
        labelColor: score.scoreColour,
        labelOffset: 12,
      })),
    }),
    [data, sortedScoreTiers, scoretiers, resultDummyData]
  );
  // 5. Select Chart Component to Render
  const chartToRender = useMemo(() => {
    const chartType = settings?.chart_type || "pie";
    switch (chartType) {
      case "pie":
        return (
          <ResultPieChart
            {...pieChartData}
            device={device}
            chartSettings={chartSettings}
          />
        );
      case "radial":
        return <ResultRadialChart {...radialChartData} device={device} />;
      case "gauge":
        return (
          <ResultScoreGaugeChart
            overallScoreData={data?.overallScore}
            arcsData={gaugeChartData.data}
          />
        );
      case "radar":
        return <ResultRadarChart {...radarChartData} />;
      case "bar":
        return (
          <div className="text-center p-4 text-muted-foreground">
            Bar chart not implemented.
          </div>
        );
      default:
        return (
          <ResultPieChart
            {...pieChartData}
            device={device}
            chartSettings={chartSettings}
          />
        );
    }
  }, [
    device,
    settings?.chart_type,
    pieChartData,
    radialChartData,
    radarChartData,
    data?.overallScore,
    chartSettings,
    resultDummyData,
  ]);

  return (
    <div
      className={cn(
        "relative mx-auto max-w-xl w-full flex flex-col items-center justify-center h-[400px] md:h-[560px] rounded-md"
      )}
    >
      {chartToRender}
      {settings?.showScoreTiersLabels && (
        <div className="flex flex-row items-center gap-3 mt-4">
          {scoretiers.map((tier, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              {/* Using tier color for the circle */}
              <div
                className="rounded-full w-4 h-4"
                style={{ backgroundColor: tier.scoreColour || "#cccccc" }}
              ></div>
              <p className="text-sm">{tier.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
ChartContainer.displayName = "ChartContainer";

/**
 * OutcomeScoreChartComponent - Renders the appropriate layout type based on section settings
 * Uses a switch statement to delegate to specific layout components
 *
 * @param {CompositionOutcomeProps} props - Component props
 * @returns {JSX.Element | null} Rendered layout or null
 */
export const CompositionOutcome: React.FC<CompositionOutcomeProps> = React.memo(
  ({ section }) => {
    const { livemode, previewMode, categories, scoretiers } =
      usePageBuilderStore(); // FIX: Destructure categories and scoretiers from the store

    const { id, settings, content } = section;
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const { activeElementId, setActiveElementId } = usePageBuilderStore();

    const isEditable = !livemode && !previewMode;
    const isEditing = isEditable && activeElementId === id;
    const isHovered = isEditable && hoveredItemId === id;

    const chartElement = Array.isArray(section.content)
      ? (section.content[0] as ElementNode)
      : null;
    const snapshotsElement = Array.isArray(section.content)
      ? (section.content[1] as ElementNode)
      : null;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isEditable || isEditing) return;
      setActiveElementId(id);
    };

    return (
      <div
        ref={componentRef}
        className={cn("space-y-2 relative w-full max-w-[768px] mt-3")}
        onClick={handleClick}
        onMouseEnter={() => isEditable && setHoveredItemId(id)}
        onMouseLeave={() => isEditable && setHoveredItemId(null)}
      >
        <div
          className={cn(
            "absolute inset-0 h-full w-full rounded-md pointer-events-none",
            isEditing &&
              "outline outline-2 outline-indigo-600 outline-offset-2",
            !isEditing &&
              isHovered &&
              isEditable &&
              "outline outline-2 outline-dashed outline-gray-400 outline-offset-2"
          )}
        />
        {/* Editor Controls */}
        {(isEditing || isHovered) && isEditable && (
          <div
            className={cn(
              "absolute z-40 right-2 top-3 left-2 -translate-y-1/3 tr transition-opacity"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row flex-nowrap justify-start">
              <div className="flex flex-row flex-nowrap space-x-1.5 text-white bg-[#2463eb] hover:bg-[#2463eb] shadow-md rounded-md">
                <SheetProvider
                  trigger={
                    <button className="p-2 rounded-md hover:bg-transparent">
                      <Cog className="w-4 h-4" />
                    </button>
                  }
                  side="right"
                  className="w-[280px] sm:max-w-lg bg-white h-screen border-r border-gray-200 z-[9999]"
                >
                  <ResultChartStylist
                    parentElement={section}
                    chartElement={chartElement}
                  />
                </SheetProvider>
              </div>
            </div>
          </div>
        )}

        {/* Render Chart and Snapshots */}
        {chartElement && snapshotsElement && (
          <>
            <div className="mx-auto ">
              <ChartContainer element={chartElement} />
            </div>
          </>
        )}
      </div>
    );
  }
);

CompositionOutcome.displayName = "CompositionOutcome";
