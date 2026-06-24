"use client";

import * as React from "react";
import { ResponsiveRadar } from "@nivo/radar";

import { Card, CardContent } from "@/components/ui/card";

interface RadarData {
  category: string;
  color: string;
  [key: string]: string | number;
}

interface ResultRadarChartProps {
  data: RadarData[];
  keys: string[];
  grids: number;
  // Optional: Allow passing custom colors
  colors?: string[];
}

export function ResultRadarChart({
  data,
  keys,
  grids,
  colors,
}: ResultRadarChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-transparent flex flex-col w-full h-full">
        <CardContent className="flex-1 flex items-center justify-center pb-0 w-full h-full">
          <p>No data available for chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent flex flex-col w-full h-full shadow-none border-none">
      <CardContent className="relative flex-1 flex items-center justify-center pb-0 w-full h-full ">
        <div className="absolute w-full h-full">
          <ResponsiveRadar
            data={data}
            keys={keys}
            indexBy="category"
            margin={{ top: 60, right: 80, bottom: 20, left: 80 }}
            gridLevels={grids}
            gridLabelOffset={10}
            // --- 1. ADDING COLOR TO DATA ---
            // You can use a scheme string like "nivo", "category10"
            // or an array of specific hex codes passed via props
            colors={colors || { scheme: "nivo" }}
            // --- 2. & 3. GRID COLORS AND LABELS ---
            // The theme prop controls the visual style of the grid lines and text
            theme={{
              // Controls the outer labels (Category names)
              text: {
                fontSize: 14,
                fill: "#333333", // Default text color
                fontWeight: 600,
              },
              // Controls the concentric circles/polygons
              grid: {
                line: {
                  stroke: "#52525b", // COLOR of the grid levels
                  strokeWidth: 1,
                  //strokeDasharray: "4 4", // Optional: makes grid dashed
                },
              },
              // Controls the numeric labels on the grid levels (e.g., 20, 40, 60)
              axis: {
                ticks: {
                  text: {
                    fill: "#888888", // Color of the grid label text
                    fontSize: 12,
                  },
                },
              },
            }}
            // Optional: Format the grid label numbers (e.g. add " pts")
            valueFormat=">-.2f"
            dotSize={10}
            dotColor={{ theme: "background" }}
            dotBorderWidth={2}
            fillOpacity={0.5}
            blendMode="multiply"
          />
        </div>
      </CardContent>
    </Card>
  );
}
