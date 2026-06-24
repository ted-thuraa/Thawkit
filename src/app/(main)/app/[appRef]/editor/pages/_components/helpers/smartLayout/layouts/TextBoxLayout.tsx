// File: src/components/SmartLayout/layouts/TextBoxLayout.tsx
"use client";

import React from "react";
import TextComponent from "../../../elementTypes/textContainer";
import { ElementNode } from "@/stores/pageEditorStore/types";

interface TextBoxLayoutProps {
  item: ElementNode;
}

/**
 * TextBoxLayout - Renders a simple text box layout
 */
export const TextBoxLayout: React.FC<TextBoxLayoutProps> = React.memo(
  ({ item }) => {
    if (!Array.isArray(item.content) || item.content.length < 2) return null;

    return (
      <div className="themed-card p-[2rem] min-h-[300px] h-full">
        <TextComponent section={item.content[0]} />
        <TextComponent section={item.content[1]} />
      </div>
    );
  }
);

TextBoxLayout.displayName = "TextBoxLayout";
