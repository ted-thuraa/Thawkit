// components/editor/question/QuestionRenderer.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { Settings2, PlusIcon, Plus, Cog, Sparkle } from "lucide-react";
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

const QuestionRenderer = ({ section, selectedQuestion }: Props) => {
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
    "relative w-full",
    // !livemode && !previewMode && "p-1",
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
      <div
        className={containerClasses}
        onMouseEnter={(e) => handleMouseEnter(e, containerId)}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => handleClick(e, containerId)}
      >
        {showEditorUI && (
          <div className="absolute z-50 right-2 top-3 left-2 -translate-y-1/3 transition-opacity opacity-100">
            <div className="flex flex-row flex-nowrap justify-between text-black">
              <div className="flex flex-row flex-nowrap space-x-1.5 bg-card shadow-md rounded-md">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="p-2 rounded-md text-white bg-[#2463eb] hover:bg-[#2463eb]"
                      aria-label="Open Section Settings"
                    >
                      <Cog className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <QuestionSettingsEditor
                      question={selectedQuestion as QuestionField}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
        {selectedQuestion && section ? (
          <div className="">
            {/* desktop */}
            <div className="hidden md:block">
              <div
                className={cn(
                  "relative h-full flex flex-col items-center gap-[20px] lg:gap-[72px]",
                  selectedQuestion.settings?.show_media &&
                    "flex-row flex-nowrap justify-center"
                )}
              >
                <div className="w-full block px-4">
                  <QuestionTitle
                    question={selectedQuestion}
                    pageType={pageType}
                    styles={styles}
                  />
                  <QuestionDescription
                    question={selectedQuestion}
                    pageType={pageType}
                    styles={styles}
                  />
                  <AnswerTypeRenderer element={section} />
                  {/* button next */}
                  <div className="w-full">
                    <div className="mx-auto  w-full flex items-center mt-8 ">
                      <button
                        className={cn(
                          "px-[8px] py-[4px] min-h-[28px]  w-full md:w-24 h-fit rounded-[6px]",
                          THEME_CLASSES.button
                        )}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
                {selectedQuestion.settings?.show_media && projectData && (
                  <MediaRenderer
                    settings={selectedQuestion.settings}
                    onMediaChange={(newSrc) => {
                      const updatedSettings = {
                        ...selectedQuestion.settings,
                        media_url: newSrc,
                      };
                      updateQuestion(selectedQuestion.id, {
                        settings: updatedSettings,
                      });
                    }}
                  />
                )}
              </div>
            </div>

            {/* mobile */}
            <div className="md:hidden block max-w-screen w-full  relative">
              <div className="mb-8 mt-4">
                <QuestionTitle
                  question={selectedQuestion}
                  pageType={pageType}
                  styles={styles}
                />
                {selectedQuestion.settings?.show_media && projectData && (
                  <MediaRenderer
                    settings={selectedQuestion.settings}
                    onMediaChange={(newSrc) => {
                      const updatedSettings = {
                        ...selectedQuestion.settings,
                        media_url: newSrc,
                      };
                      updateQuestion(selectedQuestion.id, {
                        settings: updatedSettings,
                      });
                    }}
                  />
                )}
                {/* Action List */}
                <div className="flex flex-col gap-4">
                  <QuestionDescription
                    question={selectedQuestion}
                    pageType={pageType}
                    styles={styles}
                  />
                  <AnswerTypeRenderer element={section} />
                </div>
              </div>
              {/* button next */}
              <div className="w-full">
                <div className="mx-auto  w-full flex items-center mt-8 px-14">
                  <button
                    className={cn(
                      "px-[8px] py-[4px] min-h-[28px]  w-full md:w-24 h-fit rounded-[6px]",
                      THEME_CLASSES.button
                    )}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full pt-10">
            <DialogWrapper
              trigger={
                <div>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="mx-auto my-4 flex size-16 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-400 shadow-md outline-none transition-all hover:scale-110 hover:border-indigo-500 hover:text-indigo-500"
                          aria-label="Add New Question"
                        >
                          <PlusIcon size={16} aria-hidden="true" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs">
                        Add Question
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              }
              title="Add New Question"
              description="Create a new question"
              className="bg-sidebar"
            >
              <CreateQuestion />
            </DialogWrapper>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(QuestionRenderer);
