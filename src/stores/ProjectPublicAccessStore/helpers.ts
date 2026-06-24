import { QuestionCategories } from "@/lib/types/project";
import { QuestionField } from "../pageEditorStore/types";

export const organizeQuestions = (
  questions: QuestionField[],
  categories: QuestionCategories[],
  orderType: string
): QuestionField[] => {
  switch (orderType) {
    case "asc_categories": {
      const singleCategoryQuestionsMap = new Map<string, QuestionField[]>();
      const multiCategoryQuestions: QuestionField[] = [];
      const uncategorizedQuestions: QuestionField[] = [];

      // 1. Categorize questions based on question.categoryIds
      questions.forEach((question) => {
        if (!question.categoryIds || question.categoryIds.length === 0) {
          uncategorizedQuestions.push(question);
        } else if (question.categoryIds.length === 1) {
          const catId = question.categoryIds[0];
          if (!singleCategoryQuestionsMap.has(catId)) {
            singleCategoryQuestionsMap.set(catId, []);
          }
          singleCategoryQuestionsMap.get(catId)!.push(question);
        } else {
          // question.categoryIds.length > 1
          multiCategoryQuestions.push(question);
        }
      });

      const result: QuestionField[] = [];

      // 2. Process known single-category questions, ordered by the main categories array
      const sortedCategories = [...categories].sort(
        (a, b) => a.order - b.order
      );

      sortedCategories.forEach((category) => {
        if (singleCategoryQuestionsMap.has(category.id)) {
          const catQuestions = singleCategoryQuestionsMap.get(category.id)!;
          result.push(...catQuestions.sort((a, b) => a.order - b.order));
          singleCategoryQuestionsMap.delete(category.id); // Mark as processed
        }
      });

      // 3. Process "orphaned" single-category questions
      // (category ID present in question.categoryIds but not in the main categories array)
      // These are sorted by their category ID (string) for stability, then by question order.
      const orphanedCategoryIds = Array.from(
        singleCategoryQuestionsMap.keys()
      ).sort();

      orphanedCategoryIds.forEach((catId) => {
        const catQuestions = singleCategoryQuestionsMap.get(catId)!;
        result.push(...catQuestions.sort((a, b) => a.order - b.order));
      });

      // 4. Add sorted multi-category questions
      multiCategoryQuestions.sort((a, b) => a.order - b.order);
      result.push(...multiCategoryQuestions);

      // 5. Add sorted uncategorized questions
      uncategorizedQuestions.sort((a, b) => a.order - b.order);
      result.push(...uncategorizedQuestions);

      return result;
      // const categorizedQuestions: { [key: string]: question[] } = {};
      // const multiCategoryQuestions: question[] = [];
      // const uncategorizedQuestions: question[] = [];

      // // First pass - categorize questions
      // questions.forEach((question) => {
      //   if (!question.scoring || question.scoring.length === 0) {
      //     uncategorizedQuestions.push(question);
      //     return;
      //   }

      //   const uniqueCategories = new Set(
      //     question.scoring.map((score) => score.category_id)
      //   );

      //   if (uniqueCategories.size > 1) {
      //     multiCategoryQuestions.push(question);
      //   } else {
      //     const categoryId = question.scoring[0].category_id;
      //     if (categoryId) {
      //       if (!categorizedQuestions[categoryId]) {
      //         categorizedQuestions[categoryId] = [];
      //       }
      //       categorizedQuestions[categoryId].push(question);
      //     } else {
      //       console.log("No CatId");
      //     }
      //   }
      // });

      // // Sort questions within each category by order
      // const sortedQuestions = categories
      //   .sort((a, b) => a.order - b.order)
      //   .flatMap((category) => {
      //     const categoryQuestions = categorizedQuestions[category.id] || [];
      //     return categoryQuestions.sort((a, b) => a.order - b.order);
      //   });

      // return [
      //   ...sortedQuestions,
      //   ...multiCategoryQuestions.sort((a, b) => a.order - b.order),
      //   ...uncategorizedQuestions.sort((a, b) => a.order - b.order),
      // ];
    }

    case "random":
      return [...questions].sort(() => Math.random() - 0.5);

    case "branching_logic":
      return questions; // Original order, branching handled separately

    default: // "asc"
      return [...questions].sort((a, b) => a.order - b.order);
  }
};

export const getNextQuestionId = (
  currentQuestion: QuestionField,
  selectedOptionId: string | undefined
): string | null => {
  if (!currentQuestion.logicBranch) return null;

  // Check for matching "if" conditions first
  const ifLogic = currentQuestion.logicBranch.find(
    (logic) => logic.statement === "if" && logic.option_id === selectedOptionId
  );

  if (ifLogic?.outcome_id) {
    return ifLogic.outcome_id;
  }

  // Check for "always" condition
  const alwaysLogic = currentQuestion.logicBranch.find(
    (logic) => logic.statement === "Always"
  );

  return alwaysLogic?.outcome_id || null;
};
