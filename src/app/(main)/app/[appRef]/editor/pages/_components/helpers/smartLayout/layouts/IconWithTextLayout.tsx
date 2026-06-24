// File: src/components/SmartLayout/layouts/IconWithTextLayout.tsx
"use client";

import React, { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import DynamicLucideIcon from "@/components/global/dynamicLucideIcon";
import TextComponent from "../../../elementTypes/textContainer";
import { RiImageEditFill } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import IconPicker from "../../iconPicker";
import { CardWrapper } from "../../../elementTypes/scopes/cardWrapper";

interface IconWithTextLayoutProps {
  item: ElementNode;
  section: ElementNode;
}

/**
 * IconWithTextLayout - Renders an icon with text layout
 */
export const IconWithTextLayout: React.FC<IconWithTextLayoutProps> = React.memo(
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

    const handleIconChange = useCallback(
      (itemId: string, iconName: string) => {
        if (itemId) {
          updateElementProperty(
            itemId, // The ID of the layout_item being changed
            "settings.iconName",
            iconName,
            selectedSectionId as string // The ID of the smart_layout container
          );
        }
        // Note: Sheet closing is handled within IconPicker's onSelect -> handleSelect
      },
      [item.id, updateElementProperty] // Add section.id dependency
    );

    return (
      <CardWrapper
        bgColor={effectiveBg}
        className={cn("themed-card w-full h-full max-w-lg p-8", item.className)}
        style={cardStyle}
        theme={theme}
      >
        <div className="flex flex-col items-start gap-4">
          <div className="border-gray-200 rounded-lg p-3 mb-6">
            <IconPicker
              value={item.settings?.iconName || "HelpCircle"}
              onChange={(iconName) => handleIconChange(item.id, iconName)}
              editorTrigger={
                <div
                  className="relative group/IconWithTextLayout w-full h-full"
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: "var(--theme-border-color)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/IconWithTextLayout:opacity-100 rounded-md z-40">
                    <BiEdit className="h-4 w-4 text-white" />
                  </div>
                  <DynamicLucideIcon
                    name={item.settings?.iconName}
                    className="w-6 h-6"
                  />
                </div>
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <TextComponent section={item.content[0]} />
          </div>
        </div>
        <dd className="mt-2">
          <TextComponent section={item.content[1]} />
        </dd>
      </CardWrapper>
    );
  }
);

IconWithTextLayout.displayName = "IconWithTextLayout";
