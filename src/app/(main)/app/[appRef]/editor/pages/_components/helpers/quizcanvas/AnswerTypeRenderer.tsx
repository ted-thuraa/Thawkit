// components/editor/question/AnswerTypeRenderer.tsx
"use client";

import React, { useMemo, useCallback } from "react";
import { v4 } from "uuid";
import { useShallow } from "zustand/react/shallow";

import {
  MultipleChoiceComponent,
  SingleChoiceComponent,
  SliderComponent,
  TextAnsTypeComponent,
} from "../../answerTypes";
import ImageChoiceComponent from "../../answerTypes/imageChoiceComponent";
import QuizPageLeadFormComponent from "../../answerTypes/quizPageLeadForm";
import { cn } from "@/lib/utils";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { QuestionOption } from "@/lib/types/project";
import QuestionOptionsEditor from "./QuestionOptionsEditor";
import { THEME_CLASSES } from "@/lib/constants/theme";

const useAnswerTypeState = () =>
  usePageBuilderStore(
    useShallow((state) => ({
      livemode: state.livemode,
      previewMode: state.previewMode,
      selectedQuestion: state.selectedQuestion,
      projectData: state.projectData,
      updateQuestion: state.updateQuestion,
    }))
  );

type Props = {
  element: ElementNode;
};

const AnswerTypeRenderer = ({ element }: Props) => {
  const {
    livemode,
    previewMode,
    selectedQuestion,
    projectData,
    updateQuestion,
  } = useAnswerTypeState();

  // Find the specific section for answers/options
  const answersElementSection = useMemo(
    () =>
      Array.isArray(element.content)
        ? element.content.find((el) => el.type === "question_options")
        : undefined,
    [element.content]
  );

  // Handlers wrapped in useCallback to maintain reference equality, preventing child re-renders
  const handleOptionLabelBlur = useCallback(
    (optionId: string, newLabel: string) => {
      if (!selectedQuestion) return;
      const trimmedLabel = newLabel.trim();
      if (!trimmedLabel) return;

      const updatedOptions = selectedQuestion.options?.map((opt) =>
        opt.id === optionId ? { ...opt, label: trimmedLabel } : opt
      );
      updateQuestion(selectedQuestion.id, { options: updatedOptions });
    },
    [selectedQuestion, updateQuestion]
  );

  const handleOptionMediaUpdate = useCallback(
    (optionId: string, mediaType: string, mediaSrc: string) => {
      if (!selectedQuestion) return;
      const updatedOptions = selectedQuestion.options?.map((opt) =>
        opt.id === optionId
          ? { ...opt, media: mediaType as "image" | undefined, mediaSrc }
          : opt
      );
      updateQuestion(selectedQuestion.id, { options: updatedOptions });
    },
    [selectedQuestion, updateQuestion]
  );

  const handleAddOption = useCallback(() => {
    if (!selectedQuestion) return;
    const options = selectedQuestion.options || [];
    const newOption = {
      id: v4(),
      order: options.length + 1,
      label: `Option ${options.length + 1}`,
      fieldId: selectedQuestion.id,
    };
    updateQuestion(selectedQuestion.id, {
      options: [...options, newOption] as QuestionOption[],
    });
  }, [selectedQuestion, updateQuestion]);

  const handleDeleteOption = useCallback(
    (optionId: string) => {
      if (!selectedQuestion) return;
      const updatedOptions = selectedQuestion.options?.filter(
        (opt) => opt.id !== optionId
      );
      updateQuestion(selectedQuestion.id, { options: updatedOptions });
    },
    [selectedQuestion, updateQuestion]
  );

  // Props object memoized to ensure stability for child components
  const commonProps = useMemo(
    () => ({
      question: selectedQuestion,
      livemode,
      previewMode,
      onOptionLabelBlur: handleOptionLabelBlur,
      onMediaChange: handleOptionMediaUpdate,
      onAddOption: handleAddOption,
      onDeleteOption: handleDeleteOption,
    }),
    [
      selectedQuestion,
      livemode,
      previewMode,
      handleOptionLabelBlur,
      handleOptionMediaUpdate,
      handleAddOption,
      handleDeleteOption,
    ]
  );

  if (!selectedQuestion || !answersElementSection) return null;

  const getAnswerComponent = () => {
    switch (selectedQuestion.type) {
      case "MULTIPLE_CHOICE":
      case "YES_NO":
        return selectedQuestion.settings?.allow_multiple_selection ? (
          <MultipleChoiceComponent
            {...commonProps}
            element={answersElementSection}
          />
        ) : (
          <SingleChoiceComponent
            {...commonProps}
            element={answersElementSection}
          />
        );
      case "IMAGE_BUTTON":
        return (
          <ImageChoiceComponent
            {...commonProps}
            element={answersElementSection}
            workspaceId={projectData?.id as string}
          />
        );
      case "TEXT":
        return <TextAnsTypeComponent question={selectedQuestion} />;
      case "RANGE":
        return <SliderComponent question={selectedQuestion} />;
      case "CONTACT_FORM":
        return <QuizPageLeadFormComponent section={element} />;
      case "INFO_SCREEN":
        return (
          <div className="w-full">
            <button
              className={cn(
                "w-full h-10 px-4 py-2  inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",

                THEME_CLASSES.button
              )}
            >
              <span>Continue</span>
            </button>
          </div>
        );
      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <QuestionOptionsEditor elementSection={answersElementSection}>
      {getAnswerComponent()}
    </QuestionOptionsEditor>
  );
};

export default React.memo(AnswerTypeRenderer);
