// File: src/components/SmartLayout/LayoutRenderer.tsx
"use client";

import React, { useMemo } from "react";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { BulletsLayout } from "./layouts/BulletsLayout";
import { IconWithTextLayout } from "./layouts/IconWithTextLayout";
import { ImageWithTextLayout } from "./layouts/ImageWithTextLayout";
import { TextBoxLayout } from "./layouts/TextBoxLayout";
import { StatsWithTextLayout } from "./layouts/StatsWithTextLayout";
import { TestimonialLayout } from "./layouts/TestimonialLayout";
import { ProductItemLayout } from "./layouts/ProductItemLayout";
import { CategoryScoresShortLayout } from "./layouts/categoryScoresShort";

/**
 * Props for LayoutRenderer component
 */
interface LayoutRendererProps {
  item: ElementNode;
  index: number;
  section: ElementNode;
}

/**
 * LayoutRenderer - Renders the appropriate layout type based on section settings
 * Uses a switch statement to delegate to specific layout components
 *
 * @param {LayoutRendererProps} props - Component props
 * @returns {JSX.Element | null} Rendered layout or null
 */
export const LayoutRenderer: React.FC<LayoutRendererProps> = React.memo(
  ({ item, index, section }) => {
    const layoutType = section.settings?.smart_layout_type;

    // Memoize the layout component to prevent re-renders
    const layoutComponent = useMemo(() => {
      switch (layoutType) {
        case "bullets":
          return <BulletsLayout index={index} item={item} section={section} />;
        case "icon_with_text":
          return <IconWithTextLayout item={item} section={section} />;
        case "image_with_text":
          return <ImageWithTextLayout item={item} section={section} />;
        case "text_box":
          return <TextBoxLayout item={item} />;
        case "stats_with_text":
          return <StatsWithTextLayout item={item} section={section} />;
        case "testimonial":
          return <TestimonialLayout item={item} section={section} />;
        case "product_item":
          return <ProductItemLayout item={item} section={section} />;
        case "category_score_item_short":
          return <CategoryScoresShortLayout item={item} section={section} />;
        default:
          return null;
      }
    }, [layoutType, item, index, section]);

    return <>{layoutComponent}</>;
  }
);

LayoutRenderer.displayName = "LayoutRenderer";
