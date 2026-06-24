"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { v4 } from "uuid";
import { debounce } from "lodash";
import TextStylist from "./elementUtils/textStylist";
import {
  MultipleChoiceComponent,
  SingleChoiceComponent,
  TextAnsTypeComponent,
  DateComponent,
  DropdownComponent,
  NumericComponent,
  SliderComponent,
  ImageButtonComponent,
} from "../answerTypes";
import { DialogProvider } from "@/providers/dialog-provider";
import CreateQuestion from "../helpers/createQuestion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageChoiceComponent from "../answerTypes/imageChoiceComponent";
import QuestionSectionStylist from "./elementUtils/questionSectionStylist";
import Image from "next/image";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { section: ElementNode };

const QuizComponent = ({ section }: Props) => {
  const {
    pageType,
    livemode,
    sections,
    questions,
    scoretiers,
    selectedSectionId,
    activeElementId, // <--- Get activeElementId
    editingElementId,
    selectedQuestion,
    setSelectedQuestion,
    setEditingElementId,
    setSelectedSectionId,
    setActiveElementId,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
    findParentSectionId,
    updateElementProperty,
    updateQuestion,
    previewMode,
  } = usePageBuilderStore();
  const [isHovered, setIsHovered] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const { id, content, settings, styles, className } = section;
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [hoveredItemIndex, setHoveredItemIndex] = useState<
    number | string | null
  >(null);
  const [hoveredEditableId, setHoveredEditableId] = useState<string | null>(
    null
  );
  const isItemActive = !livemode && !previewMode && activeElementId === id;
  //for a faster questions lookup: might have to put it on store
  const questionsMap = useMemo(() => {
    const map = new Map<string, QuestionField>();
    questions.forEach((question) => {
      map.set(question.id, question);
    });
    return map;
  }, [questions]);

  // Array of roof options to be displayed
  useEffect(() => {
    if (pageType === "Landing_Page") {
      if (settings?.quizContext && settings?.quizContext === "Landing_Page") {
        if (selectedQuestion === null) {
          const questionId = !Array.isArray(content) && content.quizId;
          if (questionId) {
            const question = questionsMap.get(questionId);
            if (question) {
              setSelectedQuestion(question);
            }
          }
        }
      }
    }
  }, [settings, content, questionsMap, setSelectedQuestion]);

  const roofOptions: string[] = [
    "Gable Roof",
    "Flat Roof",
    "Pitched Roof",
    "I don't know",
  ];
  return (
    // Main container with dark background, centered content, and padding
    <div className="bg-[#2B2B2B] flex min-h-screen w-full items-center justify-center p-4 antialiased">
      {selectedQuestion !== null ? (
        <section className="mx-auto w-full max-w-md text-center">
          {/* Header section with icon and link */}
          <header className="mb-8 flex flex-col items-center gap-2">
            <FaFileInvoiceDollar
              className="text-[#FDB813] text-4xl"
              aria-hidden="true"
            />
            <a
              href="#"
              className="text-[#FDB813] text-lg font-semibold transition-colors hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-brand-gold rounded-sm"
            >
              Get a Free Quote
            </a>
          </header>

          <main>
            {/* Main question heading */}
            <h2
              id="roof-shape-question"
              className="mb-8 text-3xl font-bold text-white sm:text-4xl"
            >
              {selectedQuestion.title}
            </h2>

            {/* Group of selectable buttons */}
            <div
              role="group"
              aria-labelledby="roof-shape-question"
              className="flex flex-col gap-4"
            >
              {roofOptions.map((option) => (
                <button
                  key={option}
                  //nClick={() => onSelect(option)}
                  className="w-full rounded-lg bg-[#F9A826] px-6 py-4 text-lg font-bold text-gray-900 transition-all duration-200 ease-in-out hover:bg-orange-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-[#2B2B2B]"
                >
                  {option}
                </button>
              ))}
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default QuizComponent;
