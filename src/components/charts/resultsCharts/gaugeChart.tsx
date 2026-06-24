"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

// Dynamically import the library to prevent SSR issues
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

// Define available gauge styles based on the screenshot
export type GaugeType =
  | "semicircle-default"
  | "semicircle-arrow"
  | "semicircle-blob"
  | "radial-default"
  | "radial-thick"
  | "radial-inner-ticks"
  | "radial-elastic";

interface ResultGaugeChartProp {
  gaugeType?: GaugeType;
  overallScoreData?: {
    score_percentage: string;
  };
  arcsData: {
    limit: number;
    color: string;
    showTick: boolean;
    label?: string;
    labelColor?: string;
    labelOffset?: number;
  }[];
}

const ResultScoreGaugeChart = ({
  gaugeType = "semicircle-default", // Default fallback
  overallScoreData,
  arcsData,
}: ResultGaugeChartProp) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Parse score safely
  const scorePercentage = useMemo(() => {
    return overallScoreData?.score_percentage
      ? parseFloat(overallScoreData.score_percentage)
      : 0;
  }, [overallScoreData]);

  // Resize Observer to prevent rendering on 0x0 container (prevents SVG errors)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to throttle and avoid "Loop limit exceeded"
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) return;
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          setIsReady(true);
        }
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * Configuration Builder
   * Maps the requested gaugeType to specific 'react-gauge-component' props.
   * We use useMemo to avoid recalculating this object on every render.
   */
  const gaugeConfig = useMemo(() => {
    // 1. Common defaults shared by all charts
    const commonProps = {
      value: scorePercentage,
      marginInPercent: 0.03,
      labels: {
        valueLabel: {
          formatTextValue: (v: number) => `${v.toFixed(0)}%`,
          style: {
            fontSize: "36px",
            fontWeight: "bold",
            fill: "#000000",
            textShadow: "none",
          },
        },
      },
      arc: {
        subArcs: arcsData,
        padding: 0.02,
        width: 0.15,
      },
      pointer: {
        elastic: true,
        animationDelay: 0,
      },
    };

    // 2. Specific overrides based on gaugeType
    switch (gaugeType) {
      case "semicircle-arrow":
        return {
          ...commonProps,
          type: "semicircle",
          arc: { ...commonProps.arc, width: 0.2, padding: 0.02 },
          pointer: { type: "arrow", color: "#343434", elastic: true },
        };

      case "semicircle-blob":
        return {
          ...commonProps,
          type: "semicircle",
          pointer: { type: "blob", color: "#343434", animationDelay: 0 },
        };

      case "radial-default":
        return {
          ...commonProps,
          type: "radial",
          arc: { ...commonProps.arc, width: 0.15 },
          pointer: { type: "needle", elastic: true },
        };

      case "radial-thick":
        return {
          ...commonProps,
          type: "radial",
          arc: { ...commonProps.arc, width: 0.3, padding: 0.01 }, // Thicker arc
          pointer: { type: "needle", elastic: true },
        };

      case "radial-inner-ticks":
        return {
          ...commonProps,
          type: "radial",
          arc: { ...commonProps.arc, width: 0.2 },
          labels: {
            ...commonProps.labels,
            tickLabels: {
              type: "inner",
              defaultTickValueConfig: {
                formatTextValue: (v: any) => v,
                style: { fontSize: 10, fill: "#333" },
              },
            },
          },
        };

      case "radial-elastic":
        return {
          ...commonProps,
          type: "radial",
          arc: { ...commonProps.arc, width: 0.2 },
          pointer: { type: "needle", elastic: true, animationDelay: 0 },
        };

      case "semicircle-default":
      default:
        return {
          ...commonProps,
          type: "semicircle",
          pointer: { type: "needle", elastic: true },
        };
    }
  }, [gaugeType, arcsData, scorePercentage]);

  return (
    <Card
      ref={containerRef}
      className="relative w-full h-full bg-transparent border-none shadow-none"
    >
      <CardContent className="w-full h-full p-0 flex items-center justify-center">
        {isReady ? (
          <div className="w-full h-full">
            <GaugeComponent
              className="w-full h-full"
              style={{ width: "100%", height: "100%" }}
              {...(gaugeConfig as any)}
            />
          </div>
        ) : (
          // Optional: Render a Skeleton or Loading state here if needed
          <div className="w-full h-full flex items-center justify-center opacity-0">
            Loading...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultScoreGaugeChart;
