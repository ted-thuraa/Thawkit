// File: src/components/SmartLayout/layouts/BulletsLayout.tsx
"use client";

import React, { useMemo } from "react";
import { ElementNode } from "@/stores/pageEditorStore/types";
import TextComponent from "../../../elementTypes/textContainer";
import { CardWrapper } from "../../../elementTypes/scopes/cardWrapper";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { cn } from "@/lib/utils";

interface BulletsLayoutProps {
  index: number;
  item: ElementNode;
  section: ElementNode;
}

/**
 * BulletsLayout - Renders a numbered bullet layout
 */
export const BulletsLayout: React.FC<BulletsLayoutProps> = React.memo(
  ({ index, item, section }) => {
    const {
      livemode,
      theme,
      selectedSectionId,
      updateElementProperty,
      removeSmartLayoutItem,
    } = usePageBuilderStore();
    if (!Array.isArray(item.content) || item.content.length < 2) return null;

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
          "themed-card w-full h-full max-w-lg p-8 flex flex-col items-start leading-none",
          item.className
        )}
        style={cardStyle}
        theme={theme}
      >
        <div
          className="rounded-md p-2 "
          style={{
            borderRadius: "0.5rem",
            backgroundColor: "var(--theme-border-color)",
          }}
        >
          0{index + 1}
        </div>
        <dt className="mt-4">
          <TextComponent section={item.content[0]} />
        </dt>
        <dd className="mt-2">
          <TextComponent section={item.content[1]} />
        </dd>
      </CardWrapper>
    );
  }
);

BulletsLayout.displayName = "BulletsLayout";
