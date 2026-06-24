"use client";

import * as React from "react";
import { ResponsivePie, PieCustomLayerProps } from "@nivo/pie";
import { useTheme } from "next-themes";

import { Card, CardContent } from "@/components/ui/card";
import { DeviceType } from "@/stores/pageEditorStore/types";
import { useIsMobile } from "@/hooks/use-mobile";

// Types
interface ScoreData {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface ResultPieChartProps {
  data: ScoreData[];
  overallScoreData?:
    | {
        scoreTierId: string;
        scoreTierColor: string;
        score_percentage: string;
      }
    | undefined;
  device?: DeviceType;
  chartSettings: {
    showLabels?: boolean;
  };
}

export function ResultPieChart({
  data,
  overallScoreData,
  device,
  chartSettings,
}: ResultPieChartProps) {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile() || device === "Mobile";

  // --- Handle Empty Data ---
  if (!data || data.length === 0) {
    return (
      <Card className="bg-transparent border-none shadow-none flex flex-col w-full h-full">
        <CardContent className="flex-1 flex items-center justify-center pb-0">
          <p>No data available for chart.</p>
        </CardContent>
      </Card>
    );
  }

  // --- Theme Configuration ---
  const nivoTheme = {
    tooltip: {
      container: {
        background: resolvedTheme === "dark" ? "#333" : "#fff",
        color: resolvedTheme === "dark" ? "#fff" : "#000",
        fontSize: "12px",
        borderRadius: "4px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        padding: "6px 10px",
      },
    },
    labels: {
      text: {
        fill: resolvedTheme === "dark" ? "#bbb" : "#333",
        fontSize: 11,
      },
    },
  };

  // --- Centered Text Layer ---
  const CenteredMetric = ({
    centerX,
    centerY,
  }: PieCustomLayerProps<ScoreData>) => {
    const overallScore = overallScoreData?.score_percentage
      ? parseFloat(overallScoreData.score_percentage).toFixed(0)
      : "50";

    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan
          x={centerX}
          dy="-0.3em"
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
          dy="2.2em"
          style={{
            fontSize: isMobile ? "0.6rem" : "1rem",
            fill: "color-mix(in srgb, var(--color-text-body) 75%, transparent)",
          }}
        >
          Overall Score
        </tspan>
      </text>
    );
  };

  // --- Chart Render ---
  return (
    <Card className="bg-transparent border-none shadow-none w-full h-full">
      <CardContent className="w-full h-full p-0 flex items-center justify-center">
        <div className="w-full h-full">
          <ResponsivePie
            data={data}
            theme={nivoTheme}
            margin={
              isMobile
                ? { top: 10, right: 10, bottom: 10, left: 10 }
                : { top: 40, right: 60, bottom: 60, left: 60 }
            }
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            activeInnerRadiusOffset={8}
            colors={{ datum: "data.color" }}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            enableArcLabels={!!chartSettings.showLabels}
            enableArcLinkLabels={!!chartSettings.showLabels && !isMobile}
            arcLabel={(d) => `${d.value}%`}
            arcLinkLabel={(d) => `${d.id}`}
            arcLabelsSkipAngle={10}
            arcLinkLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2.5]],
            }}
            arcLinkLabelsTextColor={"var(--color-text-body)"}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            layers={
              [
                "arcs",
                chartSettings.showLabels ? "arcLabels" : undefined,
                chartSettings.showLabels ? "arcLinkLabels" : undefined,
                "legends",
                CenteredMetric,
              ].filter(Boolean) as any
            }
            tooltip={({ datum: { label, value, color } }) => (
              <div
                style={{
                  padding: "6px 10px",
                  background: resolvedTheme === "dark" ? "#333" : "#fff",
                  color: resolvedTheme === "dark" ? "#fff" : "#000",
                  border: `1px solid ${color}`,
                  borderRadius: "4px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                }}
              >
                <strong>{label}</strong>: {value.toFixed(1)}%
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
