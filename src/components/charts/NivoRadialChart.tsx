"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsivePie, PieCustomLayerProps } from "@nivo/pie";
import {
  ResponsiveRadialBar,
  RadialBarCustomLayerProps,
  RadialBarDatum,
} from "@nivo/radial-bar";
import { useTheme } from "next-themes";

export const description = "A donut chart with text";

interface ChartDataItem {
  overallScore: any;
  categoryScore: Array<{
    id: string;
    label: string;
    value: number;
    color: string;
  }>;
}

// Sample data for standalone usage
const sampleData = [
  {
    id: "rust",
    label: "rust",
    value: 526,
    color: "hsl(78, 70%, 50%)",
  },
  // ... other sample data items
];

const data = [
  {
    id: "Supermarket",
    data: [
      {
        x: "High",
        y: 80,
      },
    ],
  },
  {
    id: "Combini",
    data: [
      {
        x: "Low",
        y: 14,
      },
    ],
  },
  {
    id: "Online",
    data: [
      {
        x: "Mid",
        y: 56,
      },
    ],
  },
];

export function NivoRadialChart() {
  const { resolvedTheme } = useTheme();

  // Use the passed data or fall back to sample data
  //const chartData = data?.categoryScore || sampleData;

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
    const overallScore = 50;
    //   const overallScore = data?.overallScore?.score_percentage
    //   ? parseFloat(data.overallScore.score_percentage).toFixed(0)
    //   : 50;

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
          style={{ fontSize: "4rem", fontWeight: "bold" }}
        >
          {overallScore}%
        </tspan>
        <tspan
          x={centerX}
          dy="2.4em"
          style={{ fontSize: "1rem", fill: "hsl(var(--muted-foreground))" }}
        >
          Overall Score
        </tspan>
      </text>
    );
  };

  const colors = ["#fcd34d", "#6ee7b7", "#93c5fd"];
  const trackColors = ["#fcd34d60", "#6ee7b760", "#93c5fd60"];
  const overlayColor = ["#00000020"]; // 25% opacity black overlay

  const trackData = data.map((d) => ({
    ...d,
    data: d.data.map((point) => ({ ...point, y: 100 })),
  }));

  return (
    <Card className="bg-transparent flex flex-col w-full h-full">
      <CardContent className="relative flex-1 flex items-center justify-center pb-0 w-full h-full ">
        <div className="absolute w-full h-full">
          <ResponsiveRadialBar
            data={trackData}
            maxValue={100}
            innerRadius={0.3}
            padding={0.2}
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
            innerRadius={0.3}
            padding={0.2}
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
            innerRadius={0.3}
            padding={0.2}
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
