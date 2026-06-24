"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes"; // Assuming you use next-themes for theme management
import {
  calculateScorePositionPercentage,
  calculateTierSegmentWidths,
  findScoreTierForScore,
  getTierColor,
  getTiersRange,
} from "@/lib/pageEditor/fakeChartData";
import { cn } from "@/lib/utils";

export type LevelType = "low" | "normal" | "medium" | "high";

export const levelValues: LevelType[] = ["low", "normal", "medium", "high"];
type ScoreTiers = {
  name: string;
  id: string;
  score_colour: string;
  score_from: number;
  score_to: number;
};
type DisplayModeProps = {
  mode: "display";
  scoreTiers: ScoreTiers[];
  overallScorePercentage: number | null | undefined;
  onLevelChange?: never; // Not applicable in display mode
};

type InputModeProps = {
  mode: "input";
  // Define props specific to input mode later if needed
  // e.g., steps: number | string[]; value: number | string;
  onLevelChange: (newLevel: any) => void; // Callback for input changes
  scoreTiers?: never; // Not applicable in input mode (unless input relates to tiers)
  overallScorePercentage?: never;
};

type Props = {
  scoreTiers: ScoreTiers[];
  overallScorePercentage: number | null | undefined;
  className?: string;
  tooltipLabel?: string; // Optional custom tooltip label (e.g., "Your Score")
  /** Height of the progress bar track (e.g., 'h-5', 'h-6'). Defaults to 'h-5'. */
  barHeight?: string;
  /** Size of the indicator thumb (e.g., 'h-6 w-6', 'h-7 w-7'). Defaults to 'h-7 w-7'. */
  thumbSize?: string;
  blurIntensity?: string;
  /** Background opacity for glassmorphism (e.g., 'bg-opacity-30'). */
  backgroundOpacityClass?: string;
};

export function FancyProgressBar({
  scoreTiers,
  overallScorePercentage,
  className,
  tooltipLabel = "Your level", // Default tooltip label matches image
  barHeight = "h-5", // Default bar height
  thumbSize = "h-4 w-4",
  blurIntensity = "backdrop-blur-sm", // Default blur
  backgroundOpacityClass = "bg-opacity-30", // Default opacity (needs color e.g., bg-white/30)
}: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // --- Memoized Calculations ---
  const displayData = useMemo(() => {
    // Guard against invalid inputs early
    if (
      !scoreTiers ||
      scoreTiers.length === 0 ||
      overallScorePercentage === null ||
      overallScorePercentage === undefined
    ) {
      return null;
    }

    // Sort tiers before calculating segments to ensure correct visual order
    const sortedTiers = [...scoreTiers].sort(
      (a, b) => a.score_from - b.score_from
    );
    const range = getTiersRange(sortedTiers); // Get the min/max range (e.g., 0-100)

    if (!range || range.max === range.min) {
      // Avoid division by zero or invalid range
      return null;
    }

    const positionPercentage = calculateScorePositionPercentage(
      overallScorePercentage,
      scoreTiers
    );
    const currentTier = findScoreTierForScore(
      overallScorePercentage ?? 0, // Use 0 if somehow still null/undefined
      scoreTiers
    );

    const segmentsData = calculateTierSegmentWidths(sortedTiers); // Calculate widths based on sorted tiers

    const firstScore = sortedTiers[0].score_from;
    const lastScore = sortedTiers[sortedTiers.length - 1].score_to;
    const totalRange = lastScore - firstScore;

    // --- Calculate Gradient String ---
    const gradientStops = sortedTiers.map((tier, i) => {
      // Calculate the percentage position of the *end* of this tier
      const tierEndPercentage =
        ((tier.score_to - firstScore) / totalRange) * 100;
      // Clamp between 0 and 100 just in case
      //const clampedPercentage = Math.max(0, Math.min(100, tierEndPercentage));
      // Use the tier's color
      const color = getTierColor(tier);
      return `${color} ${tierEndPercentage.toFixed(2)}%`;
    });

    gradientStops.push(
      `${sortedTiers[sortedTiers.length - 1].score_colour} 100%`
    );

    // Add the start color at 0% if the first tier doesn't start at min
    const firstTier = sortedTiers[0];
    const startColor = getTierColor(firstTier);
    const gradientString = `linear-gradient(to right, ${gradientStops.join(", ")})`;

    // Ensure we return the sorted tiers for label rendering
    return {
      positionPercentage,
      currentTier,
      gradientString,
      segmentsData,
      sortedTiers,
    };
  }, [scoreTiers, overallScorePercentage]);

  // Handle cases where data might be missing or invalid
  if (!displayData) {
    // Optionally render a placeholder or null
    console.warn(
      "FancyProgressBar: Missing scoreTiers or overallScorePercentage."
    );
    return (
      <div className={cn("relative mt-4 mb-10 w-full", className)}>
        <div
          className={cn("rounded-full bg-gray-200 animate-pulse", barHeight)}
        />
        <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-400 select-none px-1">
          <span>...</span>
          <span>...</span>
        </div>
      </div>
    );
  }

  const {
    positionPercentage,
    currentTier,
    gradientString,
    segmentsData,
    sortedTiers,
  } = displayData;

  return (
    // Container needs explicit height for ResponsivePie
    <div className={cn("relative mt-4 mb-4 w-full", className)}>
      {/* Slider track */}
      <div
        className={cn(
          "relative p-1 flex w-full rounded-full bg-white/50 backdrop-blur-lg  border border-white/30  items-center justify-center"
        )}
      >
        <div
          ref={sliderRef}
          className={cn(
            "rounded-full relative overflow-hidden flex items-center justify-center w-full  border border-white border-opacity-20  ", // Use flex for segments
            barHeight, // Apply dynamic height
            blurIntensity, // Apply blur
            "bg-white/20"
          )}
          style={{
            backgroundImage: gradientString, // Apply the calculated gradient
          }}
        >
          {/* <div
        ref={sliderRef}
        className="h-6 rounded-full bg-gradient-to-r from-blue-300 via-yellow-300 to-red-500 cursor-pointer relative"
        onClick={handleSliderClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      > */}
          {segmentsData.slice(0, -1).map(({ tier, width }, index) => (
            <div
              key={tier.id || index}
              className="h-full shrink-0 border-r-4 border-white/50" // Add shrink-0 to prevent flex shrinking
              style={{
                width: `${width}%`,
                //backgroundColor: getTierColor(tier),
              }}
              title={`${tier.name}: ${tier.score_from}-${tier.score_to}%`}
            />
          ))}
          {segmentsData.length > 0 &&
            (() => {
              const lastSegment = segmentsData[segmentsData.length - 1];
              return (
                <div
                  key={lastSegment.tier.id || segmentsData.length - 1}
                  className="h-full flex-1" // Use flex-1 to fill remaining space
                  style={
                    {
                      //backgroundColor: getTierColor(lastSegment.tier),
                    }
                  }
                  title={`${lastSegment.tier.name}: ${lastSegment.tier.score_from}-${lastSegment.tier.score_to}%`}
                />
              );
            })()}
        </div>
        {/* Thumb Indicator */}
        <div
          className="absolute top-1/2 flex items-center pointer-events-none rounded-full bg-white/50 backdrop-blur-lg  border border-white/30 justify-center p-0.5"
          style={{
            left: `${positionPercentage}%`,
            transform: "translate(-50%, -50%)", // Center the thumb precisely
          }}
        >
          {/* Circular Thumb - matches image */}
          <div
            className={cn(
              "rounded-full bg-white ",
              //"bg-white/50", // Semi-transparent background for thumb
              //blurIntensity, // Apply same blur
              thumbSize // Apply dynamic size
            )}
          />
        </div>
      </div>

      {/* Labels below the bar */}
      {/* Render labels based on the sorted tiers used for segments */}
      {sortedTiers.length > 0 && (
        <div className="flex justify-between mt-1 text-xs sm:text-sm text-gray-600 select-none px-1">
          {/* Map over sorted tiers to generate labels */}
          {sortedTiers.map((tier) => (
            <span key={tier.id}>{tier.name}</span>
          ))}
        </div>
      )}

      {/* Tooltip above the thumb */}
      <div
        className="absolute bottom-full flex flex-col items-center mb-1 pointer-events-none" // Position above thumb
        style={{
          left: `${positionPercentage}%`,
          transform: "translateX(-50%)", // Center the tooltip
        }}
      >
        <div className="bg-gray-700 text-white px-3 py-1 rounded font-medium text-xs sm:text-sm shadow-lg whitespace-nowrap">
          {/* Use the passed label and the found tier name */}
          {tooltipLabel}
          {currentTier ? `: ${currentTier.name}` : ""}
        </div>
        {/* Arrow pointing down */}
        <div className="w-2.5 h-2.5 rotate-45 bg-gray-700 transform translate-y-[-4px]"></div>
      </div>

      {/* Level labels */}
      {/* <div className="flex justify-between mt-2 text-sm sm:text-base text-gray-600 select-none">
        <span>Low</span>
        <span>Normal</span>
        <span>Medium</span>
        <span>High</span>
      </div> */}

      {/* Tooltip */}
      {/* <div
        className="absolute bottom-full flex flex-col items-center transform -translate-x-1/2 mb-2"
        style={{ left: `${tooltipPosition}%` }}
      >
        <div className="bg-gray-700 text-white px-3 py-1 rounded font-medium text-sm shadow-lg whitespace-nowrap">
          Your level
        </div>
        <div className="w-3 h-3 rotate-45 bg-gray-700 transform translate-y-[-4px]"></div>
      </div> */}
    </div>
  );
}
