import { format } from "date-fns"; // Optional: if you want pretty date formatting
import { FullProjectData, FullProjectQueryResponse } from "../querries/leads";

// The shape of the raw data coming from getProjectLeadsWithDetails
// Based on the JSON structure in [cite: 49-61]
export interface ProjectLeadsResponse {
  success: boolean;
  data: {
    id: string;
    ref: string;
    quizResponses: Array<{
      id: string;
      overallScore: number;
      completedAt: string;
      leadData: {
        email?: string;
        "First Name"?: string;
        "Last Name"?: string;
        [key: string]: any; // Allow for other dynamic fields
      } | null;
    }>;
  };
}

// The target interface requested for the table
// [cite: 883-891]
export interface TableRowData {
  id: string;
  Name: string;
  email: string;
  date: string;
  score: string;
}

export function prepareLeadsTableData(
  queryResponse: FullProjectQueryResponse
): TableRowData[] {
  if (!queryResponse.success || !queryResponse.data) {
    return [];
  }

  const project = queryResponse.data;

  // Guard clause if there are no responses
  if (!project.quizResponses || project.quizResponses.length === 0) {
    return [];
  }

  return project.quizResponses.map((response) => {
    // 1. Safely cast the JSON leadData
    const leadDetails = response.leadData as Record<string, any> | null;

    // 2. Construct the Name (Dynamic based on your form fields)
    // Check for common variations like "First Name", "Name", "firstName", etc.
    const firstName =
      leadDetails?.["First Name"] ||
      leadDetails?.["firstName"] ||
      leadDetails?.["Name"] ||
      "";
    const lastName =
      leadDetails?.["Last Name"] || leadDetails?.["lastName"] || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Anonymous User";

    // 3. Extract Email
    const email = leadDetails?.["email"] || leadDetails?.["Email"] || "";

    // 4. Format Date
    const dateStr = response.completedAt
      ? new Date(response.completedAt).toLocaleDateString()
      : new Date(response.startedAt).toLocaleDateString();

    return {
      id: response.id,
      Name: fullName,
      email: email,
      date: dateStr,
      score: String(response.overallScore ?? 0),

      // 5. Pass the complex nested arrays needed for the Drawer
      // We explicitly map these to ensure they match the strict frontend interface
      quizAnswers: response.quizAnswers.map((ans) => ({
        id: ans.id,
        answer: ans.answer,
        timeSpent: ans.timeSpent ?? 0,
        projectQuizField: {
          id: ans.projectQuizField.id,
          title: ans.projectQuizField.title,
          categoryIds: ans.projectQuizField.categoryIds as string, // Ensure string type for JSON parsing
        },
      })),

      scores: response.scores.map((s) => ({
        id: s.id,
        categoryId: s.categoryId,
        score: s.score,
        scorePotential: s.scorePotential,
        scorePercentage: s.scorePercentage,
        category: s.category
          ? {
              id: s.category.id,
              title: s.category.title,
              description: s.category.description ?? "",
            }
          : null,
      })),
    };
  });
}
