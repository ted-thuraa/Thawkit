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

export function ChartPieDonutText({ data }: { data: ChartDataItem }) {
  const { resolvedTheme } = useTheme();

  // Use the passed data or fall back to sample data
  const chartData = data?.categoryScore || sampleData;

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
  const CenteredMetric = ({
    dataWithArc,
    centerX,
    centerY,
  }: PieCustomLayerProps<(typeof sampleData)[0]>) => {
    // Get the score percentage from data or default to 50
    const overallScore = data?.overallScore?.score_percentage
      ? parseFloat(data.overallScore.score_percentage).toFixed(0)
      : 50;

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

  return (
    <Card className="bg-transparent flex flex-col w-full h-full">
      <CardContent className="flex-1 flex items-center justify-center pb-0 w-full h-full ">
        <ResponsivePie /* or Pie for fixed dimensions */
          data={chartData}
          theme={nivoTheme}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.6}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: "data.color" }}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          enableArcLabels={true}
          arcLabel={(d) => `${d.value}%`}
          arcLinkLabel={(d) => `${d.id} (${d.formattedValue})`}
          activeInnerRadiusOffset={8}
          enableArcLinkLabels={true} // Show labels outside with lines
          arcLinkLabelsSkipAngle={10}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2.5]] }}
          arcLinkLabelsTextColor={resolvedTheme === "dark" ? "#bbb" : "#333"} // Use theme color
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }} // Line color matches slice
          arcLinkLabelsDiagonalLength={16}
          arcLinkLabelsStraightLength={24}
          arcLinkLabelsTextOffset={6}
          layers={[
            "arcs",
            "arcLabels",
            "arcLinkLabels",
            "legends",
            CenteredMetric,
          ]}
          // --- Tooltip ---
          tooltip={({ datum: { id, value, color, label } }) => (
            <div
              style={{
                padding: "5px 9px",
                background: resolvedTheme === "dark" ? "#333" : "#fff",
                color: resolvedTheme === "dark" ? "#fff" : "#000",
                border: `1px solid ${color}`,
                borderRadius: "2px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                fontSize: "12px",
              }}
            >
              <strong>{label}</strong>: {value.toFixed(1)}%
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
