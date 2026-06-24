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
  ChartPie,
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
import TextComponent from "./textContainer";

import { DynamicScoreInfo } from "@/lib/pageEditor/fakeChartData";
import { generateDynamicScoreInfo } from "@/lib/dummyData/fakeChartData";
import TwoArcsGaugeChart from "@/components/charts/CustomTwoArcsGaugeChart";
import { CardWrapper } from "./scopes/cardWrapper";

type Props = { section: ElementNode };
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
const CategoryContentCards = (
  { section }: Props
  //index: number,
) => {
  const {
    livemode,
    previewMode,
    resultDummyData,
    theme,
    categories,
    scoretiers,
    activeElementId,
    selectedSectionId,
    editingElementId,
    setEditingElementId,
    updateElementProperty,
    setActiveElementId,
  } = usePageBuilderStore();
  const { id, content, name, styles, className, type, settings } = section;
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const isEditable = !livemode && !previewMode;
  const isSelected = isEditable && activeElementId === id;
  const isHovered = isEditable && hoveredItemId === id;

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

  const gaugeData = useMemo(() => {
    const score = data?.categoryScores?.find(
      (s) => s.categoryId === settings?.categoryId
    );

    return {
      id: score?.categoryTitle || "",
      label: score?.scoreTierName || "",
      value: score ? parseFloat(score.score_percentage) || 0 : 0,
      color: score?.scoreTierColor || "",
    };
  }, [data, settings?.categoryId]);

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
  const categoryScoreTitle: ElementNode | undefined = Array.isArray(
    section?.content
  )
    ? section?.content[0]
    : undefined;
  const categoryScoreDescription: ElementNode | undefined = Array.isArray(
    section?.content
  )
    ? section?.content[1]
    : undefined;
  const effectiveBg =
    section.styles?.backgroundColor ||
    theme.colors?.background?.card ||
    "#ffffff";

  // For outline buttons, the "background" that determines text contrast
  // is actually the PAGE background (or card background), not the button's border.
  // So for outline, we might want to skip defining a new scope or set it to transparent.

  return (
    <div
      className={cn(" relative w-full ")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* editor active state */}
      <div
        className={cn(
          "absolute -inset-1 z-0 overflow-hidden pointer-events-none",
          isSelected && "border-2   border-indigo-600",
          !isSelected &&
            isHovered &&
            isEditable &&
            "border-dashed border-2  border-gray-400 "
        )}
      ></div>
      {/* Main Card Container */}
      <CardWrapper
        bgColor={effectiveBg}
        className={cn("themed-card relative w-full px-6 py-6 space-y-4")}
        theme={theme}
      >
        {/* Article Header */}
        <div className="flex flex-row items-center justify-between w-full h-20">
          {/* LEFT: Icon and Title */}
          <div className="flex flex-row items-center gap-3 pr-4">
            <div
              className="p-2  rounded-lg "
              style={{
                borderRadius: "0.5rem",
                backgroundColor: "var(--theme-border-color)",
              }}
            >
              <ChartPie className="w-5 h-5" />
            </div>
            {categoryScoreTitle && (
              <div className="">
                <TextComponent section={categoryScoreTitle} />
              </div>
            )}
          </div>

          {/* RIGHT: Gauge Chart Container 
          Increased size from 4rem to ~120px for visibility 
      */}
          <div className="relative w-[140px] h-[80px] flex-shrink-0">
            <TwoArcsGaugeChart gaugeData={gaugeData} />
          </div>
        </div>

        {/* Article Snippet / Excerpt */}
        <div className="text-sm text-slate-500 leading-relaxed font-sans">
          {categoryScoreDescription && (
            <TextComponent section={categoryScoreDescription} />
          )}
        </div>
      </CardWrapper>
    </div>
  );
};

const CategoryScoresLong = ({ section }: Props) => {
  const {
    livemode,
    previewMode,
    questions,
    activeElementId,
    setActiveElementId,
    addLayoutItem,
    setSelectedSectionId,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const { id, content, name, styles, className, type } = section;

  const containerRef = useRef<HTMLDivElement>(null);

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
    !livemode && !previewMode && (isSelected || hoveredItemId === id);

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative mt-4 mx-auto  max-w-full  w-full flex flex-col items-center"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* editor active state */}
        <div
          className={cn(
            "absolute inset-0 z-0 overflow-hidden pointer-events-none",
            !livemode &&
              !previewMode &&
              hoveredItemId === id &&
              !isSelected &&
              "outline-dashed outline-1 outline-indigo-600 rounded-sm",
            !livemode &&
              !previewMode &&
              isSelected &&
              "outline outline-2 outline-indigo-600 rounded-sm"
          )}
        ></div>
        {/* content cards */}
        <div className="relative mx-auto  h-auto  flex flex-col items-center justify-center gap-6 my-4 px-1 lg:px-8 font-sans">
          {Array.isArray(content) &&
            content.map((childsection, index) => {
              return (
                <CategoryContentCards
                  section={childsection}
                  key={childsection.id}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default React.memo(CategoryScoresLong);
