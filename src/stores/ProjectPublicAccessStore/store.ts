import { v4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  LeadFormSchemaType,
  LeadFormConfig,
} from "@/lib/pageEditor/editorLeadFormSchema";
import { FetchEditorDataResponse } from "@/lib/querries/project";
import {
  defaultTheme,
  DeviceType,
  dummyProductCatalogue,
  ElementNode,
  FunnelPage,
  OrderTypes,
  PageTheme,
  PageType,
  ProductCatalogType,
  ProjectData,
  QuestionField,
} from "../pageEditorStore/types";
import { getNextQuestionId, organizeQuestions } from "./helpers";
import {
  ProjectInputResponse,
  submitQuizResponse,
  submitLead,
} from "@/actions/submissions";
import {
  ProjectPublicDataMainPageResponse,
  ResultPageData,
} from "@/lib/querries/campaignPublic";

export type PublicAccessProjectConfig = {
  pageType: "Landing_Page" | "Quiz_Page" | "Result_Page";
};

export interface QuestionAnswerSchema {
  questionId: string;
  option_id?: string;
  answer?: string;
  time_spent?: number;
}

export interface LeadFormData {
  [key: string]: any;
}

interface ProjectPublicStore {
  projectData: ProjectData | null;
  editorConfig: PublicAccessProjectConfig | null;
  page: FunnelPage | null;
  pageType: PageType;
  sections: ElementNode[];
  categories: any[];
  scoretiers: any[];
  questions: QuestionField[];
  orderedQuetions: QuestionField[];
  resultData: ResultPageData | null;
  questionSequence: string[];
  currentQuestionIndex: number;
  lastAnsweredQuestionId: string | null;
  quizResponseId: string | null;
  answers: QuestionAnswerSchema[];
  productCatalog: ProductCatalogType[];

  // Lead Gen Specific State
  showQuizLeadForm: boolean;
  leadFormSubmitted: boolean;
  collectedLeadData: LeadFormData | null;

  // Loading State [cite: 1102]
  isSubmitting: boolean;
  submissionText: string;

  theme: PageTheme;
  livemode: boolean;
  isHydrated: boolean;
  previewMode: boolean;
  device: DeviceType;
  selectedSectionId: string | null;
  activeElementId: string | null;
  hoveredSectionId: string | null;
  editingElementId: string | null;

  reset: () => void;
  initialize: (
    config: PublicAccessProjectConfig,
    data: ProjectPublicDataMainPageResponse
  ) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setLastAnsweredQuestionId: (questionId: string | null) => void;
  setAnswers: (
    question: QuestionField,
    answer: QuestionAnswerSchema,
    timeTaken: number
  ) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleOptionClick: (
    optionId?: string,
    optionLabel?: string,
    text?: string
  ) => void;
  handleQuizComplete: () => Promise<void>;
  validateMultipleChoiceAnswers: () => boolean;
  submitLeadForm: (
    data: LeadFormData | null,
    isSkipped?: boolean,
    responseId?: string | null
  ) => void;
  setQuizResponseId: (id: string | null) => void;
}

const initialState = {
  projectData: null,
  editorConfig: null,
  page: null,
  sections: [],
  categories: [],
  scoretiers: [],
  questions: [],
  orderedQuetions: [],
  questionSequence: [],
  answers: [],
  productCatalog: dummyProductCatalogue,
  currentQuestionIndex: 0,
  lastAnsweredQuestionId: null,
  quizResponseId: null,
  showQuizLeadForm: false,
  leadFormSubmitted: false,
  collectedLeadData: null,
  resultData: null,
  // Initial loading state
  isSubmitting: false,
  submissionText: "",
  theme: defaultTheme,
  isHydrated: false,
  livemode: true,
  previewMode: false,
  selectedSectionId: null,
  activeElementId: null,
  device: "Desktop" as DeviceType,
  hoveredSectionId: null,
  editingElementId: null,
  pageType: "Landing_Page" as PageType,
};

export const useProjectPublicStore = create<ProjectPublicStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => set(initialState),
      initialize: (config, data) => {
        const questionsData = data.formFields;
        const categories = data.categories;
        const scoretiers = data.scoreTiersData;
        const pageData = data.funnelPages[0];

        let orderedQuetions: QuestionField[] = [];
        let questionSequence: string[] = [];
        let currentQuestionIndex = 0;

        const funnelForm: LeadFormSchemaType | undefined = data.projectData
          ?.leadOptinForm
          ? (data.projectData.leadOptinForm as unknown as LeadFormSchemaType)
          : undefined;

        const refinedProjectData: ProjectData = {
          id: data.projectData?.id || "",
          ref: data.projectData?.ref || "",
          domain: data.projectData.domain,
          title: data.projectData?.title as string,
          draftMode: data.projectData?.draftMode as boolean,
          questionOrder: data.projectData?.questionOrder as OrderTypes,
          settings: data.projectData?.settings || {},
          leadOptinForm: funnelForm,
        };

        const funnelPageSections = pageData.content
          ? JSON.parse(pageData.content)
          : [];
        const pageSettings = pageData.settings
          ? JSON.parse(pageData.settings)
          : {};
        const funnelPageTheme = pageData.theme
          ? JSON.parse(pageData.theme)
          : defaultTheme;

        const refinedPageData: FunnelPage = {
          id: pageData.id,
          title: pageData.title,
          type: pageData.type,
          status: pageData.status,
          defaultPage: pageData.defaultPage,
          order: pageData.order,
          pathName: pageData.pathName,
          metaTitle: pageData.metaTitle,
          metaDescription: pageData.metaDescription,
          previewImage: pageData.previewImage,
          theme: funnelPageTheme,
          settings: pageSettings,
          content: funnelPageSections,
        };

        const questions: QuestionField[] =
          questionsData.map((field) => ({
            id: field.id,
            title: field.title,
            description: field.description || "",
            order: field.order,
            type: field.type,
            formFieldType: field.formFieldType,
            displayPage: field.displayPage,
            attachment: field.attachment as string,
            validations: field.validations as string,
            context: field.context,
            options: field.options.map((opt) => ({
              id: opt.id,
              order: opt.order,
              projectQuizFieldId: opt.projectQuizFieldId,
              label: opt.label,
              mediaType: opt.mediaType as "image",
              mediaSrc: opt.mediaSrc,
              showIcon: opt.showIcon,
            })),
            categoryIds: field.categoryIds ? JSON.parse(field.categoryIds) : [],
            logicBranch: field.logicBranch ? JSON.parse(field.logicBranch) : [],
            scoring: field.scoring ? JSON.parse(field.scoring) : [],
            settings: field.settings ? JSON.parse(field.settings) : null,
          })) || [];

        if (config.pageType === "Quiz_Page") {
          if (questions && categories && refinedProjectData?.questionOrder) {
            const organized = organizeQuestions(
              questions,
              categories,
              refinedProjectData?.questionOrder || "asc"
            );
            orderedQuetions = organized;
            questionSequence = organized.map((q) => q.id);
          }
        }

        // --- Lead Gen Logic: Initialization Check ---
        let showQuizLeadForm = false;
        const isLeadGenEnabled =
          refinedPageData.settings?.generate_leads === true;
        const leadConfig = refinedProjectData.leadOptinForm?.config;
        const entryPoint = leadConfig?.leadform_entry;

        if (
          config.pageType === "Quiz_Page" &&
          isLeadGenEnabled &&
          entryPoint === "before"
        ) {
          showQuizLeadForm = true;
        }

        set({
          projectData: refinedProjectData,
          editorConfig: config,
          page: refinedPageData,
          sections: funnelPageSections,
          theme: funnelPageTheme,
          pageType: config.pageType,
          categories: categories ?? [],
          scoretiers: scoretiers ?? [],
          questions: questions,
          resultData: data.resultData || null,
          orderedQuetions,
          questionSequence,
          currentQuestionIndex,
          showQuizLeadForm,
          leadFormSubmitted: false,
          collectedLeadData: null,
          isSubmitting: false, // Reset
          submissionText: "",
        });
      },

      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setLastAnsweredQuestionId: (questionId) =>
        set({ lastAnsweredQuestionId: questionId }),

      setAnswers: (question, answer, timeTaken) =>
        set((state) => {
          if (
            question?.type === "MULTIPLE_CHOICE" &&
            question?.settings?.allow_multiple_selection
          ) {
            const existingAnswer = state.answers.find(
              (a) => a.questionId === answer.questionId
            );

            if (existingAnswer) {
              const optionIds = existingAnswer.option_id?.split(",") || [];
              const optionLabels = existingAnswer.answer?.split(",") || [];
              const optionIndex = optionIds.indexOf(answer.option_id!);

              if (optionIndex === -1) {
                optionIds.push(answer.option_id!);
                optionLabels.push(answer.answer!);
              } else {
                optionIds.splice(optionIndex, 1);
                optionLabels.splice(optionIndex, 1);
              }

              return {
                answers: [
                  ...state.answers.filter(
                    (a) => a.questionId !== answer.questionId
                  ),
                  {
                    ...answer,
                    option_id: optionIds.join(","),
                    answer: optionLabels.join(","),
                    time_spent: timeTaken,
                  },
                ],
              };
            }
          }

          return {
            answers: [
              ...state.answers.filter(
                (a) => a.questionId !== answer.questionId
              ),
              { ...answer, time_spent: timeTaken },
            ],
          };
        }),

      /**
       * Handles Lead Form Submission.
       */
      submitLeadForm: async (
        data: LeadFormData | null,
        isSkipped: boolean = false,
        responseId: string | null = null
      ) => {
        const { projectData } = get();
        const config = projectData?.leadOptinForm?.config;
        const optinType = config?.optin_type || "Explicit_Optional";
        const entryPoint = config?.leadform_entry || "after";

        // Security / Validation Check
        if (optinType === "Explicit_Required" && (isSkipped || !data)) {
          console.error("Lead form is required. Cannot skip.");
          return;
        }

        // --- Start Loading [cite: 1102] ---
        set({
          isSubmitting: true,
          submissionText: "Submitting your details...",
        });

        // Save Lead to DB (Call Server Action)
        if (data && projectData?.id) {
          try {
            const leadRes = await submitLead({
              projectId: projectData.id as string,
              leadData: data,
              existingResponseId: get().quizResponseId || undefined,
            });

            if (leadRes.success) {
              set({ quizResponseId: leadRes.quizResponseId });
            } else {
              console.error(leadRes.error);
            }
          } catch (e) {
            console.error("Failed to submit lead", e);
          }
        }

        set({
          collectedLeadData: data,
          leadFormSubmitted: true,
          showQuizLeadForm: false,
        });

        // Determine Next Step based on Entry Point
        if (entryPoint === "before") {
          // Just remove loading and let user continue quiz
          set({
            currentQuestionIndex: 0,
            isSubmitting: false,
            submissionText: "Good to go",
          });
        } else if (entryPoint === "after") {
          // Proceed to submit quiz logic (which handles loading its own text)
          // We keep isSubmitting true or call handleQuizComplete which sets it
          await get().handleQuizComplete();
        }
      },

      setQuizResponseId: (id) => set({ quizResponseId: id }),
      handleQuizComplete: async () => {
        const {
          projectData,
          answers,
          leadFormSubmitted,
          page,
          quizResponseId,
        } = get();

        if (!projectData?.id) return;

        const isLeadGenEnabled = page?.settings?.generate_leads === true;
        const leadConfig = projectData.leadOptinForm?.config;
        const optinType = leadConfig?.optin_type || "Explicit_Optional";

        // Security Check
        if (
          isLeadGenEnabled &&
          optinType === "Explicit_Required" &&
          !leadFormSubmitted
        ) {
          console.error("Security Block: Quiz without lead form.");
          set({ showQuizLeadForm: true, isSubmitting: false });
          return;
        }

        // --- Start Loading [cite: 1102] ---
        set({
          isSubmitting: true,
          submissionText: "Calculating your results...",
        });

        const submissionData: ProjectInputResponse = {
          projectId: projectData.id as string,
          quizResponseId: quizResponseId || "",
          answers: answers as ProjectInputResponse["answers"],
          duration: 0,
        };

        try {
          const res = await submitQuizResponse(submissionData);
          if (res.success) {
            console.log("Quiz Submitted Successfully", res);

            // --- Redirection Logic [cite: 1103, 1134] ---
            if (res.resultPageId) {
              set({
                quizResponseId: null,
              });
              // Perform the redirect.
              // FIX: Changed res.quizResponseId to res.resultPageId for correct redirection.
              window.location.href = `/result/${res.quizResponseId}`;
            } else {
              // Fallback if no ID is returned (Shouldn't happen with correct logic)
              set({ isSubmitting: false, submissionText: "Done!" });
            }
          } else {
            console.error("Submission failed:", res.error);
            set({ isSubmitting: false, submissionText: "Error submitting." });
          }
        } catch (err) {
          console.error("Network or Unexpected Error:", err);
          set({ isSubmitting: false, submissionText: "Error." });
        }
      },

      handleNext: () => {
        const {
          projectData,
          orderedQuetions,
          currentQuestionIndex,
          questionSequence,
          answers,
          page,
          leadFormSubmitted,
          validateMultipleChoiceAnswers,
          setCurrentQuestionIndex,
          handleQuizComplete,
        } = get();

        // 1. Basic Validation
        if (!orderedQuetions.length) return;
        const currentQuestion = orderedQuetions[currentQuestionIndex];
        if (!currentQuestion) return;

        if (!validateMultipleChoiceAnswers()) return;

        // 2. Logic for Branching or Linear progression
        let nextIndex = -1;

        if (projectData?.questionOrder === "branching_logic") {
          const currentAnswer = answers.find(
            (a) => a.questionId === currentQuestion.id
          );
          const nextQuestionId = getNextQuestionId(
            currentQuestion,
            currentAnswer?.option_id
          );

          if (nextQuestionId) {
            nextIndex = questionSequence.findIndex(
              (id) => id === nextQuestionId
            );
          } else {
            nextIndex = currentQuestionIndex + 1;
          }
        } else {
          nextIndex = currentQuestionIndex + 1;
        }

        // 3. Determine if we are at the end of the questions
        const isQuizFinished =
          (projectData?.questionOrder === "branching_logic" &&
            nextIndex === -1) ||
          (projectData?.questionOrder !== "branching_logic" &&
            nextIndex >= orderedQuetions.length);

        if (!isQuizFinished) {
          setCurrentQuestionIndex(nextIndex);
        } else {
          // 4. End of Quiz - Check for "After" Lead Form
          const isLeadGenEnabled = page?.settings?.generate_leads === true;
          const leadConfig = projectData?.leadOptinForm?.config;
          const entryPoint = leadConfig?.leadform_entry || "after";

          if (
            isLeadGenEnabled &&
            entryPoint === "after" &&
            !leadFormSubmitted
          ) {
            set({ showQuizLeadForm: true });
          } else {
            handleQuizComplete();
          }
        }
      },

      handlePrevious: () => {
        const {
          currentQuestionIndex,
          setCurrentQuestionIndex,
          showQuizLeadForm,
        } = get();

        if (showQuizLeadForm) {
          set({ showQuizLeadForm: false });
          return;
        }

        if (currentQuestionIndex > 0) {
          set({ lastAnsweredQuestionId: null });
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
      },

      validateMultipleChoiceAnswers: () => {
        const { orderedQuetions, currentQuestionIndex, answers } = get();
        const currentQuestion = orderedQuetions[currentQuestionIndex];
        if (!currentQuestion) return true;

        if (
          currentQuestion.type === "MULTIPLE_CHOICE" &&
          currentQuestion.settings?.allow_multiple_selection
        ) {
          const currentAnswer = answers.find(
            (a) => a.questionId === currentQuestion.id
          );
          const selectedCount = currentAnswer?.option_id
            ? currentAnswer.option_id.split(",").length
            : 0;
          const minCount =
            currentQuestion.settings.multiple_selection_min_count;
          const maxCount =
            currentQuestion.settings.multiple_selection_max_count;

          if (minCount && selectedCount < minCount) {
            console.warn(`Please select at least ${minCount} options`);
            return false;
          }
          if (maxCount && selectedCount > maxCount) {
            console.warn(`Please select no more than ${maxCount} options`);
            return false;
          }
        }
        return true;
      },

      handleOptionClick: (optionId, optionLabel, text) => {
        const {
          orderedQuetions,
          currentQuestionIndex,
          setAnswers,
          setLastAnsweredQuestionId,
          handleNext,
        } = get();

        const currentQuestion = orderedQuetions[currentQuestionIndex];
        if (!currentQuestion) return;

        let answer: QuestionAnswerSchema | null = null;
        if (currentQuestion.type === "TEXT") {
          answer = { questionId: currentQuestion.id, answer: text };
        } else if (currentQuestion.type === "YES_NO") {
          answer = {
            questionId: currentQuestion.id,
            option_id: optionId,
            answer: optionLabel,
          };
        } else if (currentQuestion.type === "MULTIPLE_CHOICE") {
          answer = {
            questionId: currentQuestion.id,
            option_id: optionId,
            answer: optionLabel,
          };
        }

        if (!answer) return;

        const timeTaken = 0;
        setAnswers(currentQuestion, answer, timeTaken);
        setLastAnsweredQuestionId(answer.questionId);

        if (
          currentQuestion.type === "YES_NO" ||
          (currentQuestion.type === "MULTIPLE_CHOICE" &&
            !currentQuestion.settings?.allow_multiple_selection)
        ) {
          setTimeout(() => handleNext(), 300);
        }
      },
    }),
    {
      name: "project-public-access-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        quizResponseId: state.quizResponseId,
        leadFormSubmitted: state.leadFormSubmitted,
      }),
    }
  )
);
