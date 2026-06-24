"use client";

import * as React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes"; // Assuming you use next-themes for theme management

// Define the expected structure for individual data points
type NivoChartDataItem = {
  //   category: string;
  //   score_percent: number;
  //   fill: string;
  id: string; // Corresponds to 'category' in your Recharts data
  label: string; // Label for the slice
  value: number; // Corresponds to 'score_percent'
  color: string; // Corresponds to 'fill'
};

// Define the overall score structure (can be adapted if needed)
type OverallScore = {
  score_percentage: string;
};

// Define the component props
type Props = {
  chartData: NivoChartDataItem[];
  overallScore?: OverallScore | null;
  innerRadius?: number; // Allow customizing donut thickness
  padAngle?: number; // Space between slices
  cornerRadius?: number; // Rounded corners for slices
};

export function NivoPieChartDonutWithText({
  chartData,
  overallScore,
  innerRadius = 0.6, // Default donut thickness (percentage of radius)
  padAngle = 0.7,
  cornerRadius = 3,
}: Props) {
  const { resolvedTheme } = useTheme(); // Get current theme (light/dark)
  const averageScore = React.useMemo(() => {
    if (!overallScore) return 0;
    return parseFloat(overallScore.score_percentage);
  }, [overallScore]);

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

  return (
    // Container needs explicit height for ResponsivePie
    <div className="relative w-full h-[400px] sm:h-[500px]">
      {" "}
      {/* Adjust height as needed */}
      <ResponsivePie
        data={chartData}
        theme={nivoTheme}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={innerRadius}
        padAngle={padAngle}
        cornerRadius={cornerRadius}
        activeOuterRadiusOffset={8} // Effect on hover/click
        colors={{ datum: "data.color" }} // Use color property from data
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        // --- Arc Labels (Labels on the slices) ---
        enableArcLabels={true} // Show labels on slices
        arcLabel={(d) => `${d.value}%`} // Display value percentage on slice
        arcLabelsSkipAngle={10} // Don't label small slices
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2.5]], // Make label color darker than slice
        }}
        // --- Arc Link Labels (Labels outside the slices with lines) ---
        enableArcLinkLabels={true} // Show labels outside with lines
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={resolvedTheme === "dark" ? "#bbb" : "#333"} // Use theme color
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }} // Line color matches slice
        arcLinkLabelsDiagonalLength={16}
        arcLinkLabelsStraightLength={24}
        arcLinkLabelsTextOffset={6}
        //arcLinkLabelsTextColor={resolvedTheme === "dark" ? "#bbb" : "#333"} // Use theme color

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
        // --- Legends (Optional) ---
        // legends={[
        //   {
        //     anchor: "bottom",
        //     direction: "row",
        //     justify: false,
        //     translateX: 0,
        //     translateY: 56,
        //     itemsSpacing: 0,
        //     itemWidth: 100,
        //     itemHeight: 18,
        //     itemTextColor: "#999",
        //     itemDirection: "left-to-right",
        //     itemOpacity: 1,
        //     symbolSize: 18,
        //     symbolShape: "circle",
        //     effects: [
        //       {
        //         on: "hover",
        //         style: {
        //           itemTextColor: resolvedTheme === 'dark' ? '#fff' : '#000',
        //         },
        //       },
        //     ],
        //   },
        // ]}
      />
      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div
          className="text-3xl sm:text-4xl font-bold"
          // Optionally use theme variables if available globally or via context
          // style={{ color: `var(${THEME_VARIABLES.textHeading})` }}
        >
          {averageScore.toFixed(1)}%
        </div>
        <div
          className="text-sm sm:text-base text-muted-foreground"
          // style={{ color: `var(${THEME_VARIABLES.textBody})` }}
        >
          Overall Score
        </div>
      </div>
    </div>
  );
}
