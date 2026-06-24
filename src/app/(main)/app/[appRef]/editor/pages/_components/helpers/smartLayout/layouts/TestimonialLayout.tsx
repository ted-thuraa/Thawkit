// File: src/components/SmartLayout/layouts/TestimonialLayout.tsx
"use client";

import React, { useMemo } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import TextComponent from "../../../elementTypes/textContainer";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { cn } from "@/lib/utils";
import { CardWrapper } from "../../../elementTypes/scopes/cardWrapper";

interface TestimonialLayoutProps {
  item: ElementNode;
  section: ElementNode;
}

// Star rating component (memoized)
const StarRating: React.FC = React.memo(() => (
  <div className="flex items-center gap-[2px]">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className="block w-[20px] h-auto text-[#facc15] fill-[#facc15]"
      />
    ))}
  </div>
));

StarRating.displayName = "StarRating";

/**
 * TestimonialLayout - Renders a testimonial card layout
 */
export const TestimonialLayout: React.FC<TestimonialLayoutProps> = React.memo(
  ({ item, section }) => {
    const {
      livemode,
      theme,
      selectedSectionId,
      updateElementProperty,
      removeSmartLayoutItem,
    } = usePageBuilderStore();
    if (!Array.isArray(item.content) || item.content.length < 2) return null;
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

    // Memoize image source
    const imageSrc = useMemo(() => {
      const imageContent = Array.isArray(item.content)
        ? item.content[3]
        : undefined;
      if (!imageContent) return "/assets/imageplaceholder.svg";

      return !Array.isArray(imageContent.content)
        ? imageContent.content?.src || "/assets/roundArchitecture.svg"
        : "/assets/imageplaceholder.svg";
    }, [item.content]);

    return (
      <CardWrapper
        bgColor={effectiveBg}
        className={cn(
          "themed-card w-full h-full max-w-lg p-5 flex flex-col gap-[32px]",
          item.className
        )}
        style={cardStyle}
        theme={theme}
      >
        <StarRating />
        <div className="block">
          <TextComponent section={item.content[1]} />
        </div>
        <div className="flex flex-row items-center gap-[16px] mt-[auto]">
          <div className="overflow-hidden w-[48px] h-[48px] aspect-square relative rounded-t-lg">
            <Image
              fill
              className="object-cover rounded-[9999px]"
              src={imageSrc}
              alt="image"
            />
          </div>
          <div className="flex flex-col flex-1">
            <TextComponent section={item.content[0]} />
            <TextComponent section={item.content[2]} />
          </div>
        </div>
      </CardWrapper>
    );
  }
);

TestimonialLayout.displayName = "TestimonialLayout";
