// components/editor/question/QuestionComponent.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { Settings2, PlusIcon, Plus, List } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

import QuestionSectionStylist from "../../elementTypes/elementUtils/questionSectionStylist";
import AnswerTypeRenderer from "./AnswerTypeRenderer";
import MediaRenderer from "./MediaRenderer";
import CreateQuestion from "../createQuestion";
import QuizHeader from "./Quiznav";
import LeadFormComponent from "../../elementTypes/formComponent";
import QuestionRenderer from "./QuestionRenderer";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import Image from "next/image";
import ScreeningTabItemRenderer from "./screeningTabItemsRenderer";
import ScreeningTabElementsDialog from "../screeningTabElementsDialog";
import LeadFormItem from "./leadFormRenderer";

// import QuestionSectionStylist from './elementUtils/questionSectionStylist';
// import CreateQuestion from '../helpers/createQuestion';
// import { QuestionHeader } from './QuestionHeader';
// import { MediaRenderer } from './MediaRenderer';
// import { AnswerTypeRenderer } from './AnswerTypeRenderer';

type Props = {
  section: ElementNode;
};

// Selectors for usePageBuilderStore to optimize re-renders.
// Components will only re-render if the returned object from the selector changes.
const useQuestionComponentState = () =>
  usePageBuilderStore(
    useShallow((state) => ({
      page: state.page,
      theme: state.theme,
      livemode: state.livemode,
      previewMode: state.previewMode,
      questions: state.questions,
      scoretiers: state.scoretiers,
      categories: state.categories,
      activeElementId: state.activeElementId,
      selectedQuestion: state.selectedQuestion,
      projectData: state.projectData,
      pageType: state.pageType,
      deleteQuestion: state.deleteQuestion,
      setActiveElementId: state.setActiveElementId,
      setSelectedQuestion: state.setSelectedQuestion,
      updateQuestion: state.updateQuestion,
      showQuizLeadForm: state.showQuizLeadForm,
    }))
  );

const QuestionComponent = ({ section }: Props) => {
  const {
    page,
    theme,
    livemode,
    previewMode,
    questions,
    scoretiers,
    categories,
    activeElementId,
    selectedQuestion,
    projectData,
    pageType,
    deleteQuestion,
    setActiveElementId,
    setSelectedQuestion,
    updateQuestion,
    showQuizLeadForm,
  } = useQuestionComponentState();

  const { id, content, settings, styles } = section;
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [isAddTabItemOpen, setIsAddTabItemOpen] = useState(false);

  const backgroundType = settings?.backgroundType ?? "color"; // Default to color
  const backgroundValue = settings?.backgroundValue;
  const defaultBackgroundColor = theme.colors.background.page; // Get default from theme
  const overlayColor = settings?.overlayColor;
  const overlayEffect = settings?.overlayEffect ?? "none";
  const bgIsMedia =
    section.settings?.backgroundType === "image" ||
    section.settings?.backgroundType === "video";

  const showOverlay = bgIsMedia && overlayColor && overlayEffect !== "none";
  // Determine the actual color to apply if type is 'color'
  const effectiveBackgroundColor =
    backgroundType === "color" && backgroundValue
      ? backgroundValue
      : defaultBackgroundColor;

  // Memoize the question element section to avoid re-calculating on every render.
  const questionElementSection = useMemo(
    () =>
      Array.isArray(content)
        ? content.find((el) => el.type === "questions")
        : undefined,
    [content]
  );

  const leadContactElementSection = useMemo(
    () =>
      Array.isArray(content)
        ? content.find((el) => el.type === "form")
        : undefined,
    [content]
  );

  // Effect to select the first quiz page question if none is selected.
  useEffect(() => {
    if (!selectedQuestion) {
      const quizPageQuestions = questions.filter(
        (q) => q.context === "Quiz_Page" && q.formFieldType === "QUESTION_ITEM"
      );

      if (quizPageQuestions.length > 0) {
        setSelectedQuestion(quizPageQuestions[0]);
      }
    }
  }, [questions, selectedQuestion, setSelectedQuestion]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!livemode && !previewMode) {
      setActiveElementId(id);
    }
  };

  const handleMouseEnter = () => {
    if (!livemode && !previewMode) setHoveredItemId(id);
  };

  const handleMouseLeave = () => {
    if (!livemode && !previewMode) setHoveredItemId(null);
  };

  const isSelected = !livemode && !previewMode && activeElementId === id;
  const showEditorUI =
    !livemode && !previewMode && (isSelected || hoveredItemId === id);

  const containerClasses = cn(
    "relative mx-auto w-full cursor-pointer  max-w-full focus:outline-none w-full flex flex-col items-center",
    !livemode && !previewMode && "p-1",
    !livemode &&
      !previewMode &&
      hoveredItemId === id &&
      !isSelected &&
      "outline-dashed outline-1 outline-indigo-600 rounded-sm",
    !livemode &&
      !previewMode &&
      isSelected &&
      "outline outline-2 outline-indigo-600 rounded-sm"
  );

  return (
    <>
      {questions.length > 0 ? (
        <div
          className={containerClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{
            backgroundColor:
              backgroundType === "color" ? effectiveBackgroundColor : undefined,
          }}
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
                        <Settings2 className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <QuestionSectionStylist
                        question={selectedQuestion as QuestionField}
                        section={section}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
          {/* Background image and overlay */}
          {/* --- Background & Overlay Container --- */}
          <div
            className="absolute inset-0 z-0 overflow-hidden" // Positioned behind content
          >
            {/* Background Image */}
            {backgroundType === "image" && backgroundValue && (
              <Image
                key={backgroundValue} // Add key for re-render on change
                src={backgroundValue}
                alt={`Section background`}
                layout="fill"
                objectFit="cover" // Consider making this configurable too
                quality={100}
                priority={section.sectionType === "hero"} // Example: Prioritize hero images
              />
            )}
            {/* Background Video */}
            {backgroundType === "video" && backgroundValue && (
              <video
                key={backgroundValue}
                playsInline
                autoPlay
                muted
                loop
                className="absolute top-0 left-0 w-full h-full object-cover"
              >
                <source src={backgroundValue} type="video/mp4" />
              </video>
            )}

            {/* --- NEW: Overlay Div --- */}
            {showOverlay && (
              <div
                className={cn(
                  "absolute inset-0", // Cover the container
                  overlayEffect === "faded" && "opacity-50", // Apply fade effect
                  overlayEffect === "frosted" && "backdrop-blur-sm" // Apply frost effect (adjust blur amount as needed)
                )}
                style={{
                  backgroundColor: overlayColor, // Apply the overlay color
                }}
              />
            )}
            {/* --- End Overlay Div --- */}
          </div>

          <div className="max-w-[40rem] w-full flex flex-col h-screen font-sans overflow-hidden relative">
            <>
              {showQuizLeadForm ? (
                <LeadFormItem section={questionElementSection as ElementNode} />
              ) : (
                <>
                  <QuizHeader
                    total={10}
                    current={4}
                    showProgress={section?.settings?.showQuizProgressBar}
                    className="pt-12 pb-4"
                  />
                  <div className="flex-1 flex flex-col items-center px-6">
                    <ScreeningTabItemRenderer
                      section={questionElementSection as ElementNode}
                      item={selectedQuestion as QuestionField}
                    />
                  </div>
                </>
              )}
            </>
          </div>

          {showEditorUI && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-50">
              <DialogWrapper
                trigger={
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-white bg-indigo-500 hover:text-white hover:bg-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                }
                title="Templates"
                description="Select a section template to add it to the page."
                className="bg-editor-component text-editor-foreground border-b border-editor-border shadow-md"
              >
                <CreateQuestion />
              </DialogWrapper>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full ">
          <Empty className="max-w-4xl m-auto mt-14 bg-white border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <List />
              </EmptyMedia>
              <EmptyTitle>No content on your page yet</EmptyTitle>
              <EmptyDescription>Add content to get started.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Popover
                  open={isAddTabItemOpen}
                  onOpenChange={setIsAddTabItemOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      className="flex flex-row items-center"
                      onClick={() => setIsAddTabItemOpen(true)}
                    >
                      <Plus />
                      Add content
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-96 absolute -top-[12rem] right-2 bg-white text-editor-foreground border-b border-editor-border shadow-md"
                    //side="left"
                  >
                    <ScreeningTabElementsDialog
                      onCancel={() => setIsAddTabItemOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </EmptyContent>
          </Empty>
        </div>
      )}
    </>
  );
};

export default React.memo(QuestionComponent);
