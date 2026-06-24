"use client";
import React, { useMemo, useCallback } from "react";
import { Plus, ChevronsUpDown, Check, Trash2 } from "lucide-react";
import { v4 } from "uuid";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn, extractTextFromHtml } from "@/lib/utils";
import { QuestionCategories } from "@/lib/types/project";
import { QuestionField, scoring } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

// --- Extracted Reusable Component ---

interface CategorySelectorProps {
  categories: QuestionCategories[];
  currentCategoryId: string;
  onSelectCategory: (category: QuestionCategories) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = React.memo(
  ({ categories, currentCategoryId, onSelectCategory }) => {
    const currentCategoryTitle =
      categories.find((cat) => cat.id === currentCategoryId)?.title ||
      "Select category...";

    return (
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between bg-sidebar"
          >
            {currentCategoryTitle}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent asChild className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.id as string}
                    onSelect={() => onSelectCategory(cat)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentCategoryId === cat.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {cat.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
CategorySelector.displayName = "CategorySelector";

// --- Extracted Question Item Component ---

interface ScoringQuestionItemProps {
  question: QuestionField;
  categories: QuestionCategories[];
  onAddScoring: (
    context: "RANGE" | "MULTIPLE_CHOICE",
    questionId: string,
    optionId?: string
  ) => void;
  onUpdateScoring: (
    scoreId: string,
    questionId: string,
    type: "category" | "score",
    val: QuestionCategories | number
  ) => void;
  onDeleteScoring: (scoreId: string, questionId: string) => void;
}

const ScoringQuestionItem: React.FC<ScoringQuestionItemProps> = React.memo(
  ({
    question,
    categories,
    onAddScoring,
    onUpdateScoring,
    onDeleteScoring,
  }) => {
    return (
      <div key={question.id} className="bg-card p-4 rounded-xl space-y-2">
        <h3 className="font-semibold">
          {question.order}. {extractTextFromHtml(question.title)}
        </h3>

        {/* --- UI for RANGE Questions --- */}
        {question.type === "RANGE" ? (
          <>
            <div className="flex items-center justify-between">
              <div className="p-4 flex flex-row items-center">
                {question.settings?.rangeMax != null &&
                  [...Array(question.settings.rangeMax + 1)].map((_, index) => (
                    <div
                      key={index}
                      className="p-2 w-6 flex items-center justify-center"
                    >
                      <div
                        className={cn(
                          "mt-2 flex items-start justify-between space-x-2 min-w-[100%]"
                        )}
                      >
                        <span>{index}</span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col items-start gap-y-1">
                <div className="flex items-center space-x-2 ml-4">
                  {question.scoring[0] && (
                    <CategorySelector
                      categories={categories}
                      currentCategoryId={
                        question.scoring[0].category_id as string
                      }
                      onSelectCategory={(cat) =>
                        onUpdateScoring(
                          question.scoring[0].id,
                          question.id,
                          "category",
                          cat
                        )
                      }
                    />
                  )}
                </div>
                <Button
                  variant="link"
                  className="text-indigo-600 hover:underline "
                  onClick={() => onAddScoring("RANGE", question.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add scoring
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* --- UI for MULTIPLE_CHOICE / YES_NO Questions --- */
          <>
            <div className="space-y-1 ml-6">
              {(question.options || []).map((option, optionIndex) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "mt-2 flex items-start justify-between space-x-2 min-w-[100%]",
                        {
                          "border-b":
                            optionIndex !== (question.options?.length || 0) - 1,
                        }
                      )}
                    >
                      <span>{option.label}</span>
                      <div className="flex flex-col items-start gap-y-1">
                        {(question.scoring || [])
                          .filter((score) => score?.option_id === option.id)
                          .map((score) => (
                            <div
                              key={score.id}
                              className="flex items-center space-x-2 ml-4"
                            >
                              <CategorySelector
                                categories={categories}
                                currentCategoryId={score.category_id as string}
                                onSelectCategory={(cat) =>
                                  onUpdateScoring(
                                    score.id,
                                    question.id,
                                    "category",
                                    cat
                                  )
                                }
                              />
                              <Input
                                type="number"
                                value={score?.score}
                                onChange={(e) =>
                                  onUpdateScoring(
                                    score.id,
                                    question.id,
                                    "score",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-20 bg-sidebar"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  onDeleteScoring(score.id, question.id)
                                }
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        <Button
                          variant="link"
                          className="text-indigo-600 hover:underline "
                          onClick={() =>
                            onAddScoring(
                              "MULTIPLE_CHOICE",
                              question.id,
                              option.id
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                          Add scoring
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
);
ScoringQuestionItem.displayName = "ScoringQuestionItem";

// --- Main Component ---

const ScoringDialog = () => {
  const questions = usePageBuilderStore((state) => state.questions);
  const categories = usePageBuilderStore((state) => state.categories);
  const updateQuestionScoring = usePageBuilderStore(
    (state) => state.updateQuestionScoring
  );
  // Ensure your store exports updateQuestion. If not, you must add it to the store actions.
  const updateQuestion = usePageBuilderStore((state) => state.updateQuestion);

  // --- Helpers ---

  /**
   * Recalculates the unique category IDs for a question based on its scoring array.
   * This ensures that if a category is added via scoring, it appears in categoryIds.
   * If it is removed from scoring (or changed to Overall), it is removed from categoryIds.
   */
  const syncCategories = useCallback(
    (questionId: string, updatedScoring: scoring[]) => {
      // 1. Extract all category IDs from the new scoring configuration
      const usedCategoryIds = updatedScoring
        .map((s) => s.category_id)
        .filter((id) => id && id !== "overall_score" && id !== ""); // Exclude overall & empty

      // 2. Create a unique list
      const uniqueCategoryIds = Array.from(new Set(usedCategoryIds));

      // 3. Update the question's categoryIds field
      // We assume updateQuestion takes (id, partialObject)
      updateQuestion(questionId, {
        categoryIds: uniqueCategoryIds as string[],
      });
    },
    [updateQuestion]
  );

  // --- Memoized Derived State ---

  const ScoringCategories: QuestionCategories[] = useMemo(
    () => [
      {
        id: "overall_score",
        order: 0,
        icon: "",
        title: "Overall",
        description: "Overall score",
      },
      ...categories,
    ],
    [categories]
  );

  const scorableQuestions = useMemo(() => {
    return questions.filter(
      (q) =>
        q.context === "Quiz_Page" &&
        (q.type === "MULTIPLE_CHOICE" ||
          q.type === "YES_NO" ||
          q.type === "RANGE")
    );
  }, [questions]);

  // --- Handlers ---

  const handleAddScoring = useCallback(
    (
      context: "RANGE" | "MULTIPLE_CHOICE",
      questionId: string,
      optionId?: string
    ) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return;

      const newScoring: scoring = {
        id: v4(),
        field_Id: questionId,
        category_id: "", // Empty initially, so it won't affect categoryIds yet
        option_id: context === "MULTIPLE_CHOICE" ? optionId || "" : "",
        category_title: "",
        score: 0,
      };

      const updatedScoringList = [...(question.scoring || []), newScoring];

      updateQuestionScoring(questionId, updatedScoringList);
      // No need to sync categories here as category_id is empty
    },
    [questions, updateQuestionScoring]
  );

  const handleUpdateScoring = useCallback(
    (
      scoreid: string,
      questionId: string,
      type: "category" | "score",
      val: QuestionCategories | number
    ) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return;

      const updatedScoring = (question.scoring || []).map((score) =>
        score?.id === scoreid
          ? {
              ...score,
              category_id:
                type === "category"
                  ? (val as QuestionCategories).id
                  : score?.category_id,
              category_title:
                type === "category"
                  ? (val as QuestionCategories).title
                  : score?.category_title,
              score: type === "score" ? (val as number) : score?.score,
            }
          : score
      );

      // 1. Update the scoring array
      updateQuestionScoring(questionId, updatedScoring);

      // 2. If we changed the category, we need to sync the question.categoryIds
      if (type === "category") {
        syncCategories(questionId, updatedScoring);
      }
    },
    [questions, updateQuestionScoring, syncCategories]
  );

  const handleDeleteScoring = useCallback(
    (scoreid: string, questionId: string) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return;

      const updatedScoring = (question.scoring || []).filter(
        (score) => score?.id !== scoreid
      );

      // 1. Update Scoring
      updateQuestionScoring(questionId, updatedScoring);

      // 2. Sync Categories (If we delete the only score for a category, that category should be removed from the question)
      syncCategories(questionId, updatedScoring);
    },
    [questions, updateQuestionScoring, syncCategories]
  );

  return (
    <>
      <ScrollArea className="h-[500px] pr-4 overflow-hidden">
        <div className="space-y-6">
          {scorableQuestions.map((question) => (
            <ScoringQuestionItem
              key={question.id}
              question={question}
              categories={ScoringCategories}
              onAddScoring={handleAddScoring}
              onUpdateScoring={handleUpdateScoring}
              onDeleteScoring={handleDeleteScoring}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default ScoringDialog;
