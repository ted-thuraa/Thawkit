// File: src/components/SmartLayout/OutcomeScoreChartComponent.tsx
"use client";

import React, { useMemo } from "react";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { SingleMetricOutcome } from "./variants/outcomeCharts/singleMetricOutcome";
import { CompositionOutcome } from "./variants/outcomeCharts/compositionOutcome";

/**
 * Props for OutcomeScoreChartComponent component
 */
interface OutcomeScoreChartComponentProps {
  section: ElementNode;
}

/**
 * OutcomeScoreChartComponent - Renders the appropriate layout type based on section settings
 * Uses a switch statement to delegate to specific layout components
 *
 * @param {OutcomeScoreChartComponentProps} props - Component props
 * @returns {JSX.Element | null} Rendered layout or null
 */
export const OutcomeScoreChartComponent: React.FC<OutcomeScoreChartComponentProps> =
  React.memo(({ section }) => {
    const outcomeType = section.settings?.outcomeType;

    // Memoize the layout component to prevent re-renders
    const layoutComponent = useMemo(() => {
      switch (outcomeType) {
        case "compositionChart":
          return <CompositionOutcome section={section} />;
        case "singleMetriChart":
          return <SingleMetricOutcome section={section} />;

        default:
          return null;
      }
    }, [outcomeType, section]);

    return <>{layoutComponent}</>;
  });

OutcomeScoreChartComponent.displayName = "OutcomeScoreChartComponent";
