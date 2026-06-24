// File: src/components/SmartLayout/layouts/CategoryScoresShortLayout.tsx
"use client";

import React, { useMemo } from "react";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { Pencil } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import TextComponent from "../../../elementTypes/textContainer";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { CardWrapper } from "../../../elementTypes/scopes/cardWrapper";
import { cn } from "@/lib/utils";

// Lazy-load heavy editor components (only loaded in edit mode)
const DialogProvider = dynamic(
  () => import("@/providers/dialog-provider").then((mod) => mod.DialogProvider),
  { ssr: false }
);

const ListingEditor = dynamic(
  () => import("../../../elementTypes/listingEditor"),
  {
    ssr: false,
  }
);

interface CategoryScoresShortLayoutProps {
  item: ElementNode;
  section: ElementNode;
}

/**
 * CategoryScoresShortLayout - Renders a product item card layout
 */
export const CategoryScoresShortLayout: React.FC<CategoryScoresShortLayoutProps> =
  React.memo(({ item, section }) => {
    const {
      livemode,
      theme,
      selectedSectionId,
      updateElementProperty,
      removeSmartLayoutItem,
    } = usePageBuilderStore();
    // Early return if content is an array (product items should have object content)
    if (!Array.isArray(item.content)) return null;

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

    const titleElement: ElementNode | undefined = Array.isArray(item?.content)
      ? item?.content.filter((s) => s.type === "catItemTitle")[0]
      : undefined;
    const descriptionElement: ElementNode | undefined = Array.isArray(
      item?.content
    )
      ? item?.content.filter((s) => s.type === "catItemDescription")[0]
      : undefined;

    return (
      <CardWrapper
        bgColor={effectiveBg}
        className={cn(
          "themed-card w-full h-full max-w-md  p-6 rounded-2xl shadow-lg",
          item.className
        )}
        style={cardStyle}
        theme={theme}
      >
        {/* 1. Header: Title + Info Icon */}
        <div className="flex justify-between items-center mb-4">
          {/* <h2 className="text-base font-semibold text-gray-700">
            Total Products Listed
          </h2> */}
          <TextComponent section={titleElement as ElementNode} />

          {/* Info Icon (inline SVG) */}
          {/* <svg
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg> */}
        </div>

        {/* 2. Main Metrics: Count, Change, and Goal */}
        <div className="flex justify-between items-end mb-5">
          {/* Left Side: Count + Percentage Change */}
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">50%</span>
          </div>

          {/* Right Side: Progress Goal */}
          <div>
            <span className="flex items-center text-base font-semibold text-green-500">
              {/* Up Arrow Icon (inline SVG) */}

              <span>High</span>
            </span>
          </div>
        </div>

        {/* 3. Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          {/* Filled portion of the bar, using arbitrary width w-[80%] */}
          <div className="bg-emerald-400 h-2.5 rounded-full w-[80%]"></div>
        </div>

        {/* 4. Footer Text */}
        {/* <p className="text-sm text-gray-500">
          You're currently at 80% of your product goal. keep it up!
        </p> */}
        <TextComponent section={descriptionElement as ElementNode} />
      </CardWrapper>
    );
  });

CategoryScoresShortLayout.displayName = "CategoryScoresShortLayout";
