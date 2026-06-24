"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, { useMemo } from "react";
import { v4 } from "uuid";
import { Copy, Eye, Palette, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import Switcher from "../recursiveComponent";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";

type Props = { section: ElementNode };

const GridContainer = ({ section }: Props) => {
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
    <div
      style={styles}
      className={cn("grid gap-[32px] grid-cols-2 md:grid-cols-4", className)}
    >
      {childSections.map((childsection) => (
        <Switcher key={childsection.id} section={childsection} />
      ))}
    </div>
  );
};

export default React.memo(GridContainer);
