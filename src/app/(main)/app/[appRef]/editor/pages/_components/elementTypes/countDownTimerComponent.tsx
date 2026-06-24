"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React from "react";
import { v4 } from "uuid";
import { Copy, Eye, Palette, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import Switcher from "../recursiveComponent";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";
import CountdownTimer from "@/components/global/CountdownTimer";

type Props = { section: ElementNode };

const CountDownTimerContainer = ({ section }: Props) => {
  const { livemode, removeSection, duplicateSection, toggleSectionVisibility } =
    usePageBuilderStore();
  const { id, content, name, styles, className, type } = section;

  return (
    <div className="flex flex-col items-center justify-between  p-24">
      <CountdownTimer
        liveMode={false}
        previewMode={false}
        targetDate={
          !Array.isArray(content)
            ? (content?.targetDate as string)
            : "2025-12-31T23:59:59"
        }
        onTargetDateChange={(iso) => console.log("New target date:", iso)}
        onComplete={() => console.log("Countdown finished!")}
        size="lg"
        showLabels={true}
      />
    </div>
  );
};

export default React.memo(CountDownTimerContainer);
