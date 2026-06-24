import { QuestionField } from "@/stores/pageEditorStore/types";

export interface QuestionOption {
  id: string;
  order: number;
  label: string;
  fieldId: string;
}

export interface ScoringRule {
  id: string;
  field_Id: string;
  category_id: string;
  option_id: string;
  category_title: string;
  score: number;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  order: number;
  fieldType: string;
  options: QuestionOption[];
  categoryIds: string[];
  logic_branch: any[];
  scoring: ScoringRule[];
  settings: any;
}

export interface SimulatedAnswer {
  questionId: string;
  selectedOptionId: string;
  score: number;
  categoryId: string | null;
}

export interface SimulationResult {
  answers: SimulatedAnswer[];
  totalScore: number;
  categoryScores: {
    [categoryId: string]: {
      score: number;
      title: string;
    };
  };
}

export interface SimulatedResponse {
  id: string;
  title: string;
  answer: string;
  score: number;
}
/**
 * Simulates responses for a given set of quiz questions.
 *
 * This function takes a JSON string of questions, parses it, and then for each question,
 * it randomly selects an answer option. It determines the score for the selected
 * option based on the scoring rules provided within each question.
 *
 * The function is designed to be efficient and robust, handling variations in the
 * question data, such as questions without options or scoring rules.
 *
 * @param questionsJson - A JSON string representing an array of Question objects.
 * @returns An object containing the simulated answers, the calculated total score,
 *          and a breakdown of scores by category. Returns an empty result for invalid JSON.
 */
export const simulateQuizResponses1 = (
  questionsJson: QuestionField[]
): SimulationResult => {
  let questions: QuestionField[];
  try {
    // The input is a JSON string, so it must be parsed first.
    questions = questionsJson;
  } catch (error) {
    console.error("Invalid JSON string provided for questions:", error);
    return {
      answers: [],
      totalScore: 0,
      categoryScores: {},
    };
  }

  const answers: SimulatedAnswer[] = [];
  const categoryScores: SimulationResult["categoryScores"] = {};

  // Using a Map for scoring rules for faster lookups, which is beneficial
  // if a question has a very large number of options.
  for (const question of questions) {
    if (!question.options || question.options.length === 0) {
      continue;
    }

    const randomIndex = Math.floor(Math.random() * question.options.length);
    const selectedOption = question.options[randomIndex];

    const scoringRulesMap = new Map(
      question.scoring.map((rule) => [rule.option_id, rule])
    );
    const scoringRule = scoringRulesMap.get(selectedOption.id);

    let score = 0;
    let categoryId: string | null = null;

    if (scoringRule) {
      score = scoringRule.score as number;
      categoryId = scoringRule.category_id as string;

      if (categoryId && scoringRule.category_title) {
        if (!categoryScores[categoryId]) {
          categoryScores[categoryId] = {
            score: 0,
            title: scoringRule.category_title,
          };
        }
        categoryScores[categoryId].score += score;
      }
    }

    answers.push({
      questionId: question.id,
      selectedOptionId: selectedOption.id,
      score,
      categoryId,
    });
  }

  // Calculate total score once at the end for efficiency.
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);

  return {
    answers,
    totalScore,
    categoryScores,
  };
};

export const simulateQuizResponses2 = (
  questionsJson: QuestionField[]
): SimulatedResponse[] => {
  let questions: QuestionField[];
  try {
    questions = questionsJson;
  } catch (error) {
    console.error("Invalid JSON string provided for questions:", error);
    return [];
  }

  const simulatedResponses: SimulatedResponse[] = [];

  for (const question of questions) {
    if (!question.options || question.options.length === 0) {
      continue;
    }

    const randomIndex = Math.floor(Math.random() * question.options.length);
    const selectedOption = question.options[randomIndex];

    const scoringRulesMap = new Map(
      question.scoring.map((rule) => [rule.option_id, rule])
    );
    const scoringRule = scoringRulesMap.get(selectedOption.id);

    const score = scoringRule ? scoringRule.score : 0;

    simulatedResponses.push({
      id: question.id,
      title: question.title,
      answer: selectedOption.label,
      score: score as number,
    });
  }

  return simulatedResponses;
};
