// File: src/components/SmartLayout/layouts/StatsWithTextLayout.tsx
"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import StatsWithTextElement from "../../../elementTypes/statsWithTextElement";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { CardWrapper } from "../../../elementTypes/scopes/cardWrapper";

interface StatsWithTextLayoutProps {
  item: ElementNode;
  section: ElementNode;
}

/**
 * StatsWithTextLayout - Renders a stats with text layout
 */
export const StatsWithTextLayout: React.FC<StatsWithTextLayoutProps> =
  React.memo(({ item, section }) => {
    const {
      livemode,
      theme,
      selectedSectionId,
      updateElementProperty,
      removeSmartLayoutItem,
    } = usePageBuilderStore();
    const element = Array.isArray(item.content) ? item.content[0] : null;

    if (!element) return null;

    // Memoize background color computation
    const effectiveBg = useMemo(
      () =>
        item.styles?.backgroundColor ||
        section.settings?.smartLayout_cardBackgroundColor ||
        theme.colors?.background?.card ||
        "#ffffff",
      [
        item.styles?.backgroundColor,
        section.settings?.smartLayout_cardBackgroundColor,
        theme.colors?.background?.card,
      ]
    );

    // Memoize style object
    const cardStyle = useMemo(
      () => ({
        ...section.styles,
      }),
      [section.styles]
    );

    return (
      <CardWrapper
        bgColor={effectiveBg}
        className={cn(
          "themed-card w-full h-full flex flex-col gap-[12px] items-start justify-start",
          item.className
        )}
        style={cardStyle}
        theme={theme}
      >
        <StatsWithTextElement element={element} />
      </CardWrapper>
    );
  });

StatsWithTextLayout.displayName = "StatsWithTextLayout";
