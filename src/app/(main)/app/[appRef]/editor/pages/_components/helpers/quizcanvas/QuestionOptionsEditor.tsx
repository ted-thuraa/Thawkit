// components/editor/question/QuestionOptionsEditor.tsx
"use client";

import React, { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Cog } from "lucide-react";
import QuestionOptionsStylist from "../../elementTypes/elementUtils/questionOptionsStylist";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const useOptionsEditorState = () =>
  usePageBuilderStore(
    useShallow((state) => ({
      question: state.selectedQuestion,
      livemode: state.livemode,
      previewMode: state.previewMode,
      activeElementId: state.activeElementId,
      setActiveElementId: state.setActiveElementId,
    }))
  );

type Props = {
  elementSection: ElementNode;
  children: React.ReactNode;
};

const QuestionOptionsEditor = ({ elementSection, children }: Props) => {
  const {
    question,
    livemode,
    previewMode,
    activeElementId,
    setActiveElementId,
  } = useOptionsEditorState();
  const [isHovered, setIsHovered] = useState(false);

  const { id } = elementSection;

  const handleMouseEnter = () => {
    if (!livemode && !previewMode) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!livemode && !previewMode) setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    //e.stopPropagation();
    if (!livemode && !previewMode) {
      setActiveElementId(id);
    }
  };

  const isSelected = !livemode && !previewMode && activeElementId === id;
  const showEditorUI = !livemode && !previewMode && (isHovered || isSelected);
  const isInfoScreen = question?.type === "INFO_SCREEN" ? true : false;

  const containerClasses = cn(
    "relative max-w-xl mx-auto ",
    !livemode && !previewMode && "cursor-pointer p-2",
    showEditorUI &&
      !isInfoScreen &&
      !isSelected &&
      "outline-dashed outline-1 outline-indigo-600 rounded-sm",
    isSelected &&
      !isInfoScreen &&
      "outline outline-1 outline-indigo-600 rounded-sm"
  );

  return (
    <div
      className={containerClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {showEditorUI && (
        <Badge
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent"
          onClick={(e) => e.stopPropagation()} // Prevent badge click from propagating
        >
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                aria-label="Edit Options Container"
                onClick={handleClick}
              >
                <Cog className="w-3 h-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-transparent p-0 z-50 absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none">
              <QuestionOptionsStylist element={elementSection} />
            </PopoverContent>
          </Popover>
        </Badge>
      )}
      {children}
    </div>
  );
};

export default React.memo(QuestionOptionsEditor);
