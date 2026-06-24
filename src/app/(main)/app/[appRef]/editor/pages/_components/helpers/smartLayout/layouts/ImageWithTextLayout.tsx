// File: src/components/SmartLayout/layouts/ImageWithTextLayout.tsx
"use client";

import React, { useMemo } from "react";
import { ElementNode } from "@/stores/pageEditorStore/types";
import Image from "next/image";
import TextComponent from "../../../elementTypes/textContainer";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { CardWrapper } from "../../../elementTypes/scopes/cardWrapper";
import { cn } from "@/lib/utils";

interface ImageWithTextLayoutProps {
  item: ElementNode;
  section: ElementNode;
}

/**
 * ImageWithTextLayout - Renders an image with text layout
 */
export const ImageWithTextLayout: React.FC<ImageWithTextLayoutProps> =
  React.memo(({ item, section }) => {
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
          "themed-card w-full h-full p-4 min-h-[300px] flex flex-col",
          item.className
        )}
        style={cardStyle}
        theme={theme}
      >
        <div
          className="overflow-hidden max-h-[16rem] aspect-video relative rounded-t-lg"
          style={{
            borderRadius: theme?.design?.card?.roundness,
            boxShadow: theme?.design?.card?.shadow,
          }}
        >
          <Image
            fill
            className="object-cover"
            src="/assets/fieldWithBicycles.jpg"
            alt="image"
          />
        </div>
        <div className="mt-4 flex-grow">
          <TextComponent section={item.content[0]} />
          <TextComponent section={item.content[1]} />
        </div>
      </CardWrapper>
    );
  });

ImageWithTextLayout.displayName = "ImageWithTextLayout";
