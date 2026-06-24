"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with the gauge library
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

interface ResultGaugeChartProp {
  gaugeData: { id: string; label: string; value: number; color: string };
}

const TwoArcsGaugeChart = ({ gaugeData }: ResultGaugeChartProp) => {
  if (!gaugeData) return null;
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 1. The Gauge Chart */}
      <GaugeComponent
        type="semicircle"
        className="w-full h-full z-10"
        value={gaugeData.value} // This drives the animation
        // Hide standard labels so we can use our custom overlay
        labels={{
          valueLabel: { style: { display: "none" } },
          tickLabels: { type: "inner", hideMinMax: true },
        }}
        minValue={0}
        maxValue={101}
        // Configure Arc to look like a progress bar
        arc={{
          width: 0.15, // Thickness of the bar
          padding: 0,
          cornerRadius: 10, // Rounded ends
          // logic: 2 subArcs. First matches value (Green), second is remainder (Grey)
          subArcs: [
            {
              limit: gaugeData.value,
              color: gaugeData.color ?? "#10B981", // Emerald-500 (The green active color)
              showTick: false,
            },
            {
              limit: 101,
              color: "#E5E7EB", // Gray-200 (The empty track color)
              showTick: false,
            },
          ],
        }}
        // Hide the needle pointer
        pointer={{
          type: "arrow",
          color: "transparent",
          width: 0,
          length: 0,
        }}
      />

      {/* 2. Custom Text Overlay (Polymarket Style) */}
      <div className="absolute inset-0 top-14 flex flex-col items-center justify-center text-center z-0 pointer-events-none">
        <span className="text-lg font-bold text-slate-900 leading-none">
          {gaugeData.value}%
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {gaugeData.label}
        </span>
      </div>
    </div>
  );
};

export default TwoArcsGaugeChart;
