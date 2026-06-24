import ResultScoreGaugeChart from "@/components/charts/resultsCharts/gaugeChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScoreTiers } from "@/lib/types/project";
import { cn, sortScoreTiersByRange } from "@/lib/utils";
import { SheetProvider } from "@/providers/sheet-provider";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { Cog, Ellipsis } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import ElementEditorSidebar from "../../../helpers/elementEditor";
import TextComponent from "../../textContainer";

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

interface DisplayMetrics {
  value: number;
  tierLabel: string;
  tierColor: string;
}

/**
 * Metric Card Component
 */
const MetricCard = ({ item }: { item: ElementNode }) => {
  const resultDummyData = usePageBuilderStore((state) => state.resultDummyData);

  const { content, settings } = item;

  // 2. Data Selection: Memoize the raw data source
  const sourceData = useMemo((): ScoreData => {
    const defaultData: ScoreData = {
      overallScore: {},
      categoryScores: [],
    };

    if (!resultDummyData || resultDummyData.length === 0) {
      return defaultData;
    }

    // Note: In a real SSR environment, Math.random() in useMemo can cause hydration mismatches.
    // Ensure this component is only rendered on the client or use a deterministic index.
    const randomIndex = Math.floor(Math.random() * resultDummyData.length);
    return resultDummyData[randomIndex]?.data || defaultData;
  }, [resultDummyData]);

  // 3. Metric Extraction: Logic specifically requested in the prompt
  const { value, tierLabel, tierColor } = useMemo((): DisplayMetrics => {
    const targetCategoryId = settings?.categoryId;

    // Find the score that matches the item's configured category ID
    const matchedScore = sourceData?.categoryScores?.find(
      (score) => score.categoryId === targetCategoryId
    );

    // Default Fallbacks
    if (!matchedScore) {
      return {
        value: 0,
        tierLabel: "N/A",
        tierColor: "#cbd5e1", // slate-300
      };
    }

    return {
      // Extracted from scoreData where (item.settings.categoryId === scoreData[item].id).value
      value: parseFloat(matchedScore.score_percentage || "0"),

      // Extracted from scoreData where (item.settings.categoryId === scoreData[item].id).label
      tierLabel: matchedScore.scoreTierName || "",

      // Extracted from scoreData where (item.settings.categoryId === scoreData[item].id).color
      tierColor: matchedScore.scoreTierColor || "#000000",
    };
  }, [sourceData, settings?.categoryId]);

  // 4. Content Parsing: safe access to children components
  const categoryScoreTitle = Array.isArray(content) ? content[0] : undefined;
  const categoryScoreDescription = Array.isArray(content)
    ? content[1]
    : undefined;
  console.log(item);
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white/50 flex flex-col justify-between h-[160px] transition-all hover:shadow-md">
      {/* Header Section: Title & Icon */}
      <div className="flex justify-between items-start">
        {categoryScoreTitle ? (
          <TextComponent section={categoryScoreTitle} />
        ) : (
          // Placeholder to maintain layout if no title exists
          <div className="h-6" />
        )}

        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-transparent shrink-0">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
            aria-hidden="true"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </div>

      {/* Body Section: Value, Label, Description */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl font-semibold text-slate-900 tracking-tight">
            {value}%
          </span>

          <span
            className="text-white text-[10px] px-2 py-1 rounded-md font-bold ml-auto uppercase tracking-wide shadow-sm"
            style={{ backgroundColor: tierColor }}
          >
            {tierLabel}
          </span>
        </div>

        {categoryScoreDescription && (
          <div className="mt-2">
            <TextComponent section={categoryScoreDescription} />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Props for OutcomeScoreChartComponent component
 */
interface SingleMetricOutcomeProps {
  section: ElementNode;
}

/**
 * SingleMetricOutcome - Renders the appropriate layout type based on section settings
 * Uses a switch statement to delegate to specific layout components
 *
 * @param {SingleMetricOutcomeProps} props - Component props
 * @returns {JSX.Element | null} Rendered layout or null
 */
export const SingleMetricOutcome: React.FC<SingleMetricOutcomeProps> =
  React.memo(({ section }) => {
    const {
      livemode,
      device,
      scoretiers,
      resultDummyData,
      previewMode,
      activeElementId,
      setActiveElementId,
    } = usePageBuilderStore();
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const { id, settings, content } = section;
    const showCategoriesSnapshot = section?.settings?.showCategoryScores
      ? section?.settings?.showCategoryScores
      : false;
    const isEditable = !livemode && !previewMode;
    const isEditing = isEditable && activeElementId === id;
    const isHovered = isEditable && hoveredItemId === id;

    const chartElement = Array.isArray(section.content)
      ? (section.content[0] as ElementNode)
      : null;
    const categorySnapshotElement = Array.isArray(section.content)
      ? (section.content[1] as ElementNode)
      : null;
    const sortedScoreTiers = sortScoreTiersByRange(scoretiers);

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

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isEditable || isEditing) return;
      setActiveElementId(id);
    };

    return (
      <div
        ref={componentRef}
        className={cn("relative")}
        onMouseEnter={() => isEditable && setHoveredItemId(id)}
        onMouseLeave={() => isEditable && setHoveredItemId(null)}
        onClick={handleClick}
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
        {/* Settings Toolbar */}
        {(isEditing || isHovered) && isEditable && (
          <div
            className="absolute z-20 right-2 top-3 left-2 -translate-y-1/3 tr transition-opacity"
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
                  <ElementEditorSidebar
                    parentElement={section}
                    chartElement={chartElement}
                  />
                </SheetProvider>
              </div>
            </div>
          </div>
        )}
        <>
          {/* Gauge Section */}
          <div className="w-[19rem] h-[11rem] md:w-[40rem] md:h-[20rem] mx-auto">
            <ResultScoreGaugeChart
              gaugeType="semicircle-blob"
              overallScoreData={data?.overallScore}
              arcsData={gaugeChartData.data}
            />
          </div>

          {/* Metrics Grid */}
          {showCategoriesSnapshot && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Array.isArray(categorySnapshotElement?.content) &&
                categorySnapshotElement?.content.map((childsection, index) => {
                  return (
                    <MetricCard item={childsection} key={childsection.id} />
                  );
                })}
            </div>
          )}
        </>
      </div>
    );
  });

SingleMetricOutcome.displayName = "SingleMetricOutcome";
