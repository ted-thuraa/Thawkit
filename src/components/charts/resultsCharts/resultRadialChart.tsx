"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
  ResponsiveRadialBar,
  RadialBarCustomLayerProps,
} from "@nivo/radial-bar";
import { useTheme } from "next-themes";
import { DeviceType } from "@/stores/pageEditorStore/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScoreData {
  id: string;

  data: {
    x: string;
    y: number;
  }[];
}

interface ResultRadialChartProps {
  data: ScoreData[];
  overallScoreData?: {
    score_percentage: string;
  };
  colors?: string[];
  device?: DeviceType;
}

export function ResultRadialChart({
  data,
  overallScoreData,
  colors = ["#fcd34d", "#6ee7b7", "#93c5fd"],
  device,
}: ResultRadialChartProps) {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile() || device === "Mobile";

  // Basic Nivo theme configuration - can be expanded
  const nivoTheme = {
    tooltip: {
      container: {
        background: resolvedTheme === "dark" ? "#333" : "#fff",
        color: resolvedTheme === "dark" ? "#fff" : "#000",
        fontSize: "12px",
        borderRadius: "2px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        padding: "5px 9px",
      },
    },
    labels: {
      text: {
        fill: resolvedTheme === "dark" ? "#bbb" : "#333",
        fontSize: 11,
      },
    },
    // Add more theme adjustments if needed (legends, axes, etc.)
  };

  // Custom layer component to render text in the center of the donut chart
  const CenteredMetric = ({ center, ...props }: RadialBarCustomLayerProps) => {
    const [centerX, centerY] = center;
    // Get the score percentage from data or default to 50
    const overallScore = overallScoreData?.score_percentage
      ? parseFloat(overallScoreData.score_percentage).toFixed(0)
      : 0;

    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        <tspan
          x={centerX}
          dy="-0.26em"
          style={{
            fontSize: isMobile ? "2rem" : "4rem",
            fontWeight: "bold",
            fill: "var(--color-text-body)",
          }}
        >
          {overallScore}%
        </tspan>
        <tspan
          x={centerX}
          dy="2.4em"
          style={{
            fontSize: isMobile ? "0.5rem" : "1rem",
            fill: "color-mix(in srgb, var(--color-text-body) 75%, transparent)",
          }}
        >
          Overall Score
        </tspan>
      </text>
    );
  };

  if (!data || data.length === 0) {
    return (
      <Card className="bg-transparent flex flex-col w-full h-full">
        <CardContent className="flex-1 flex items-center justify-center pb-0 w-full h-full">
          <p>No data available for chart.</p>
        </CardContent>
      </Card>
    );
  }

  const trackColors = colors.map((color) => `${color}60`);
  const overlayColor = ["#00000020"]; // 25% opacity black overlay

  const trackData = data.map((d) => ({
    ...d,
    data: d.data.map((point) => ({ ...point, y: 100 })),
  }));
  console.log(trackData);

  return (
    <Card className="bg-transparent flex flex-col w-full h-full max-h-[350px] border-none">
      <CardContent className="relative flex-1 flex items-center justify-center pb-0 w-full h-full ">
        <div className="absolute w-full h-full">
          <ResponsiveRadialBar
            data={trackData}
            maxValue={100}
            innerRadius={0.4}
            padding={0.02}
            cornerRadius={20}
            colors={trackColors}
            enableRadialGrid={false}
            enableCircularGrid={false}
            endAngle={360}
            radialAxisStart={null}
            circularAxisOuter={null}
            isInteractive={false}
          />
        </div>
        <div className="absolute w-full h-full">
          <ResponsiveRadialBar
            data={trackData}
            maxValue={100}
            innerRadius={0.4}
            padding={0.02}
            cornerRadius={20}
            colors={overlayColor}
            enableRadialGrid={false}
            enableCircularGrid={false}
            endAngle={360}
            radialAxisStart={null}
            circularAxisOuter={null}
            isInteractive={false}
          />
        </div>
        <div className="absolute w-full h-full">
          <ResponsiveRadialBar
            data={data}
            maxValue={100}
            innerRadius={0.4}
            padding={0.02}
            cornerRadius={45}
            colors={colors}
            enableRadialGrid={false}
            enableCircularGrid={false}
            endAngle={360}
            radialAxisStart={null}
            circularAxisOuter={null}
            layers={["bars", CenteredMetric]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
