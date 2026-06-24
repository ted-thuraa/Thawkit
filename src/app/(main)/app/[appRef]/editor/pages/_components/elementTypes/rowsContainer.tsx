"use client";

import React, { useMemo } from "react";

import { cn } from "@/lib/utils";
import Switcher from "../recursiveComponent";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { section: ElementNode };

const RowsContainer = ({ section }: Props) => {
  const { livemode, removeSection, duplicateSection, toggleSectionVisibility } =
    usePageBuilderStore();
  const { id, content, name, styles, className, type } = section;
  const childSections = useMemo(() => {
    if (Array.isArray(content)) {
      return content;
    }
    return [];
  }, [content]);
  return (
    <div style={styles} className={cn("flex flex-col", className)}>
      {childSections.map((childsection) => (
        <Switcher key={childsection.id} section={childsection} />
      ))}
    </div>
  );
};

export default React.memo(RowsContainer);
