"use client";

import React, { useState, useCallback } from "react";
import { cva } from "class-variance-authority";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { PageType, QuestionField } from "@/stores/pageEditorStore/types";
import AdvancedTextEditor from "../TextEditor/richTextEditor";
import { HtmlParser } from "@/components/global/html-parser";

//-------------------------------
// Text Variant Styles
//-------------------------------
const questionTextVariants = cva("", {
  variants: {
    variant: {
      title:
        "text-left md:text-center font-semibold tracking-tight text-pretty lg:text-balance rounded-md",
      description: "text-left md:text-center",
    },
    size: {
      sm: "",
      lg: "",
    },
  },
  compoundVariants: [
    { variant: "title", size: "lg", className: "text-3xl sm:text-4xl" },
    { variant: "title", size: "sm", className: "text-2xl sm:text-3xl" },
    { variant: "description", size: "lg", className: "text-lg/8" },
    { variant: "description", size: "sm", className: "text-lg/6" },
  ],
  defaultVariants: {
    size: "lg",
  },
});

//-------------------------------
// Shared Store Hook
//-------------------------------
const useQuestionContentState = () =>
  usePageBuilderStore(
    useShallow((state) => ({
      livemode: state.livemode,
      previewMode: state.previewMode,
      activeElementId: state.activeElementId,
      setActiveElementId: state.setActiveElementId, // Only need this one
      updateQuestion: state.updateQuestion,
    }))
  );

type Props = {
  question: QuestionField;
  pageType: PageType | undefined;
  styles: React.CSSProperties;
};

// =======================================================
// 🔵 QUESTION TITLE
// =======================================================
export const QuestionTitle = ({ question }: Props) => {
  const {
    livemode,
    previewMode,
    activeElementId,
    setActiveElementId,
    updateQuestion,
  } = useQuestionContentState();

  const [isHovered, setIsHovered] = useState(false);

  const { id: questionId, title } = question;
  const titleId = `title-${questionId}`;

  const isEditable = !livemode && !previewMode;

  // SINGLETON CHECK: Is this specific Title ID the active global element?
  const isEditing = isEditable && activeElementId === titleId;

  const handleUpdate = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue.length > 400) return;
      updateQuestion(questionId, { title: trimmedValue });
    },
    [questionId, updateQuestion]
  );

  return (
    <div
      className={cn(
        "relative mb-10 mt-4 rounded-md transition-all duration-200",
        isEditable && "cursor-text p-1"
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!isEditable || isEditing) return;
        setActiveElementId(titleId);
      }}
      onMouseEnter={() => isEditable && setIsHovered(true)}
      onMouseLeave={() => isEditable && setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 h-full w-full rounded-md pointer-events-none",
          isEditing && "border-2  border-indigo-600",
          // 2. Hovered (and NOT Active): Dashed Border
          !isEditing &&
            isHovered &&
            isEditable &&
            "border-dashed border-2  border-gray-400 "
        )}
      />
      {isEditing ? (
        <AdvancedTextEditor
          initialHtml={title as string}
          onUpdate={handleUpdate}
          className="text-[28px] leading-tight font-bold text-center "
        />
      ) : (
        <HtmlParser
          html={title as string}
          isLive={false}
          editorContentClasses="text-4xl font-semibold leading-tight"
        />
      )}
    </div>
  );
};

export const MemoizedTitle = React.memo(QuestionTitle);

// =======================================================
// 🔵 QUESTION DESCRIPTION
// =======================================================
export const QuestionDescription = ({ question, pageType }: Props) => {
  const {
    livemode,
    previewMode,
    activeElementId,
    setActiveElementId,
    updateQuestion,
  } = useQuestionContentState();

  const [isHovered, setIsHovered] = useState(false);

  const { id: questionId, description, settings } = question;
  const descriptionId = `description-${questionId}`;

  const isEditable = !livemode && !previewMode;

  // SINGLETON CHECK: Is this specific Description ID the active global element?
  const isEditing = isEditable && activeElementId === descriptionId;

  const currentSize = pageType === "Quiz_Page" ? "lg" : "sm";

  const handleUpdate = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue.length > 800) return;
      updateQuestion(questionId, { description: trimmedValue });
    },
    [questionId, updateQuestion]
  );

  if (!settings?.show_instruction) return null;

  return (
    <div
      className={cn(
        "relative mt-2 rounded-md transition-all duration-200",
        isEditable && "cursor-text p-1"
        // VISUAL LOGIC
        // isEditing && "outline outline-2 outline-indigo-600",
        // !isEditing &&
        //   isHovered &&
        //   isEditable &&
        //   "outline-dashed outline-1 outline-gray-400"
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!isEditable || isEditing) return;
        setActiveElementId(descriptionId);
      }}
      onMouseEnter={() => isEditable && setIsHovered(true)}
      onMouseLeave={() => isEditable && setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 h-full w-full rounded-md pointer-events-none",
          isEditing && "border-2  border-indigo-600",
          // 2. Hovered (and NOT Active): Dashed Border
          !isEditing &&
            isHovered &&
            isEditable &&
            "border-dashed border-2   border-gray-400"
        )}
      />
      {isEditing ? (
        <AdvancedTextEditor
          initialHtml={description as string}
          onUpdate={handleUpdate}
          className={cn(
            questionTextVariants({
              variant: "description",
              size: currentSize,
            }),
            "text-sm font-medium mb-2"
          )}
        />
      ) : (
        <HtmlParser
          html={description as string}
          isLive={false}
          editorContentClasses={cn(
            questionTextVariants({
              variant: "description",
              size: currentSize,
            }),
            "text-sm font-medium mb-2"
          )}
        />
      )}
    </div>
  );
};

export const MemoizedDescription = React.memo(QuestionDescription);
