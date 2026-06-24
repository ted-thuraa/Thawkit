// components/editor/question/QuestionRenderer.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import {
  Settings2,
  PlusIcon,
  Plus,
  Cog,
  Sparkle,
  ArrowLeft,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogProvider } from "@/providers/dialog-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import QuestionSectionStylist from "../../elementTypes/elementUtils/questionSectionStylist";
import { QuestionDescription, QuestionTitle } from "./QuestionHeader";
import AnswerTypeRenderer from "./AnswerTypeRenderer";
import MediaRenderer from "./MediaRenderer";
import CreateQuestion from "../createQuestion";
import QuestionSettingsEditor from "../questionSettings";
import QuizHeader from "./Quiznav";
import LeadFormComponent from "../../elementTypes/formComponent";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";
import { THEME_CLASSES } from "@/lib/constants/theme";
import DialogWrapper from "@/wrappers/dialog-wrapper";

// import QuestionSectionStylist from './elementUtils/questionSectionStylist';
// import CreateQuestion from '../helpers/createQuestion';
// import { QuestionHeader } from './QuestionHeader';
// import { MediaRenderer } from './MediaRenderer';
// import { AnswerTypeRenderer } from './AnswerTypeRenderer';

type Props = {
  section: ElementNode;
  selectedQuestion: QuestionField;
};

// Selectors for usePageBuilderStore to optimize re-renders.
// Components will only re-render if the returned object from the selector changes.
const useQuestionRendererState = () =>
  usePageBuilderStore(
    useShallow((state) => ({
      page: state.page,
      livemode: state.livemode,
      previewMode: state.previewMode,
      questions: state.questions,
      activeElementId: state.activeElementId,
      selectedQuestion: state.selectedQuestion,
      projectData: state.projectData,
      pageType: state.pageType,
      setActiveElementId: state.setActiveElementId,
      setSelectedQuestion: state.setSelectedQuestion,
      updateQuestion: state.updateQuestion,
      showQuizLeadForm: state.showQuizLeadForm,
    }))
  );

const QuestionRendererTab = ({ section, selectedQuestion }: Props) => {
  const {
    page,
    livemode,
    previewMode,
    questions,
    activeElementId,

    projectData,
    pageType,
    setActiveElementId,
    setSelectedQuestion,
    updateQuestion,
    showQuizLeadForm,
  } = useQuestionRendererState();

  const { id, content, settings, styles } = section;
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  const containerId = id;
  const isEditable = !livemode && !previewMode;
  const isContainerActive = isEditable && activeElementId === containerId;
  const isContainerHovered = isEditable && hoveredElementId === containerId;

  // Effect to select the first quiz page question if none is selected.
  // useEffect(() => {
  //   if (!selectedQuestion) {
  //     const quizPageQuestions = questions.filter(
  //       (q) => q.context === "Quiz_Page"
  //     );
  //     if (quizPageQuestions.length > 0) {
  //       setSelectedQuestion(quizPageQuestions[0]);
  //     }
  //   }
  // }, [questions, selectedQuestion, setSelectedQuestion]);

  const handleClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (isEditable) {
      setActiveElementId(elementId);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (isEditable) {
      setHoveredElementId(elementId);
    }
  };

  // Generic mouse leave handler to clear the local hover state.
  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditable) {
      setHoveredElementId(null);
    }
  };

  //   const isSelected = !livemode && !previewMode && activeElementId === id;
  const showEditorUI =
    !livemode && !previewMode && (isContainerActive || hoveredElementId === id);

  const containerClasses = cn(
    "relative mx-auto  h-auto max-w-7xl min-w-[42rem] px-1 lg:px-8",
    !livemode && !previewMode && "p-1",
    isEditable &&
      isContainerHovered &&
      !isContainerActive &&
      "outline-dashed outline-1 outline-indigo-600 rounded-sm",
    isEditable &&
      isContainerActive &&
      "outline outline-2 outline-indigo-600 rounded-sm"
  );

  return (
    <>
      <div className="flex flex-col h-screen bg-[#EAF7F1] text-[#1A3C2B] font-sans overflow-hidden relative">
        {/* --- Header --- */}
        <header className="flex items-center px-6 pt-12 pb-4">
          <button className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
            <ArrowLeft size={24} className="text-[#1A3C2B]" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 mx-8 h-1.5 bg-[#D1E5D9] rounded-full overflow-hidden">
            <div className="w-[20%] h-full bg-[#407056] rounded-full" />
          </div>

          {/* Placeholder for symmetry or right action */}
          <div className="w-8" />
        </header>

        {/* --- Main Content --- */}
        <main className="flex-1 flex flex-col items-center px-6">
          {/* Question Title */}
          <h1 className="text-[28px] leading-tight font-bold text-center mb-10 mt-4 text-[#1A3C2B]">
            How happy are you with your physical activity?
          </h1>

          {/* --- Custom Vertical Slider Component --- */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-h-[500px]">
            options here
          </div>
        </main>

        {/* --- Footer --- */}
        <footer className="p-6 pb-10 w-full">
          <button className="w-full bg-[#2A4F38] text-white font-bold py-4 rounded-full shadow-lg active:scale-[0.98] transition-transform text-lg">
            Next
          </button>
        </footer>
      </div>
    </>
  );
};

export default React.memo(QuestionRendererTab);
