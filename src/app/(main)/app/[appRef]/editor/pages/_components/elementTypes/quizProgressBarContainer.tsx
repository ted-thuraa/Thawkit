"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { v4 } from "uuid";
import { Copy, Eye, MoreHorizontal, Palette, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import ColumnsStylist from "./elementUtils/columnStylist";
import Switcher from "../recursiveComponent";
import QuizProgressBarHeader from "./quizProgressBar";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";

type Props = { section: ElementNode };

const QuizProgressHeaderContainer = ({ section }: Props) => {
  const {
    selectedSectionId,
    livemode,
    activeElementId,
    setActiveElementId,
    updateElementProperty,
  } = usePageBuilderStore();
  const [isHovered, setIsHovered] = useState(false);
  const { id, content, name, styles, className, settings } = section;

  return (
    <div className="relative max-w-7xl w-full mb-4">
      <QuizProgressBarHeader
        currentStep={4}
        totalSteps={10}
        title="Embrace your potential"
        //onBack={handleBack}
      />
    </div>
  );
};

export default QuizProgressHeaderContainer;
