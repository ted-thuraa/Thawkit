"use client";

import React, { useCallback } from "react";
import { v4 } from "uuid";
import Image from "next/image";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useDialog } from "@/providers/dialog-provider";
import {
  FieldType,
  QuestionField,
  Quiztypes,
  scoring,
} from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

// Define the type for a single quiz type from the imported array
type QuizType = (typeof Quiztypes)[0];

interface QuizTypeButtonProps {
  typeInfo: QuizType;
  onAdd: (type: FieldType) => void;
}

/**
 * A memoized button component for selecting a quiz type.
 * This prevents re-renders when the parent component updates,
 * unless its specific props (typeInfo or onAdd) change.
 */
const QuizTypeButton: React.FC<QuizTypeButtonProps> = React.memo(
  ({ typeInfo, onAdd }) => {
    // Memoize the click handler to avoid creating a new function on each render
    const handleClick = useCallback(() => {
      onAdd(typeInfo.type as FieldType);
    }, [typeInfo, onAdd]);

    return (
      <div className="group relative">
        <button
          onClick={handleClick}
          className="w-full p-2 flex flex-col items-center text-left rounded-lg overflow-hidden"
        >
          <div className="relative w-full flex flex-col items-center p-2 bg-muted rounded-lg">
            {/* FIX: Removed 'aspect-square' as it conflicts with w-[10rem] h-[5rem].
              This container is now correctly sized.
            */}
            <div className="relative w-[10rem] h-[5rem] overflow-hidden">
              {typeInfo.preview && (
                <Image
                  src={typeInfo.preview}
                  alt={typeInfo.name}
                  fill
                  className="w-full h-full object-contain group-hover:opacity-75 transition-opacity"
                />
              )}
            </div>
          </div>
          <h3 className="mt-2 text-xs ">{typeInfo.name}</h3>
        </button>
      </div>
    );
  }
);
QuizTypeButton.displayName = "QuizTypeButton"; // Helps in debugging

interface CreateQuestionProps {}

const CreateQuestion: React.FC<CreateQuestionProps> = () => {
  const { questions, addQuestion } = usePageBuilderStore();

  /**
   * Memoized function to create and add a new question to the store.
   */
  const handleAddQuiz = useCallback(
    (type: FieldType) => {
      const quizLength = questions.length;
      const newId = v4();

      // 1. Create options first, as scoring depends on it
      const newQuestionOptions =
        type === "YES_NO"
          ? [
              {
                id: v4(),
                order: 0,
                label: "Yes",
                projectQuizFieldId: newId,
                showIcon: false,
                mediaType: null,
                mediaSrc: "",
              },
              {
                id: v4(),
                order: 1,
                label: "No",
                projectQuizFieldId: newId,
                showIcon: false,
                mediaType: null,
                mediaSrc: "",
              },
            ]
          : type === "MULTIPLE_CHOICE" || type === "IMAGE_BUTTON"
            ? [
                {
                  id: v4(),
                  order: 0,
                  label: "Option 1",
                  projectQuizFieldId: newId,
                  showIcon: false,
                  mediaType: null,
                  mediaSrc: "",
                },
                {
                  id: v4(),
                  order: 1,
                  label: "Option 2",
                  projectQuizFieldId: newId,
                  showIcon: false,
                  mediaType: null,
                  mediaSrc: "",
                },
              ]
            : [];

      // 2. Create scoring
      const hasOptions = type === "MULTIPLE_CHOICE" || type === "YES_NO";
      let defaultScoring: scoring[];

      if (hasOptions) {
        // FIX: Corrected .map syntax (implicit return)
        defaultScoring = newQuestionOptions.map((option) => ({
          id: v4(),
          field_Id: newId,
          category_id: "overall_score",
          option_id: option.id,
          category_title: "Overall",
          score: 0,
        }));
      } else {
        defaultScoring = [
          {
            id: v4(),
            field_Id: newId,
            category_id: "overall_score",
            option_id: "",
            category_title: "Overall",
            score: 0,
          },
        ];
      }

      // 3. Create settings
      const newSettings = {
        optionsLayout:
          type === "YES_NO" ||
          type === "MULTIPLE_CHOICE" ||
          type === "TEXT" ||
          type === "RANGE"
            ? "column"
            : "grid",
        ...(type === "TEXT" && {
          multiple_line_text_input: false,
        }),
        ...(type === "INFO_SCREEN" && {
          show_instruction: true,
        }),
      };

      // 4. Assemble the final field object
      const newFormField: QuestionField = {
        id: newId,
        order: quizLength + 1,
        title: "<h3>Click to edit Question</h3>",
        description:
          '<p style="text-align: center">click to edit description</p>',
        type: type,
        context: "Quiz_Page",
        scoring: defaultScoring,
        logicBranch: [
          {
            id: v4(),
            statement: "Always",
            op: null,
            option_id: null,
            outcome_type: "field",
            outcome_id: null,
          },
        ],
        settings: newSettings as QuestionField["settings"],
        options: newQuestionOptions,
        formFieldType: "QUESTION_ITEM",
        displayPage: "Quiz_Page",
        attachment: "",
        validations: "",
      };

      // 5. Add to store and show feedback
      try {
        addQuestion(newFormField);
        // toast({
        //   title: "Success",
        //   description: "New question added successfully",
        // });
        // setOpen(false);
      } catch (error) {
        console.error("Error adding question:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to add new question",
        //   variant: "destructive",
        // });
      }
    },
    [questions.length, addQuestion] // Dependencies for useCallback
  );

  return (
    <div>
      <ScrollArea className="h-96">
        <div className="flex flex-col gap-y-6 p-1">
          <div className="grid grid-cols-2 gap-2">
            {Quiztypes.map((type) => (
              <QuizTypeButton
                // FIX: Use a stable, unique key instead of index
                key={type.type}
                typeInfo={type}
                onAdd={handleAddQuiz}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CreateQuestion;
