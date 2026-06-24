//import { Section, Template } from "@/types/pageEditor";
import { v4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  addBtnElement,
  addItemToSmartLayout,
  findAndRemoveSection,
  findTopLevelSectionId,
  removeSmartLayoutItem,
  updateElementById,
  updateNestedElement,
} from "./helpers";
import {
  defaultTheme,
  DeviceType,
  dummyProductCatalogue,
  ElementNode,
  FunnelPage,
  GeneratedSampleData,
  Logicbranch,
  OrderTypes,
  PageTheme,
  PageType,
  ProductCatalogType,
  ProjectData,
  QuestionField,
  scoring,
} from "./types";
import {
  FinalFunnelPage,
  FormField,
  FunnelPageModel,
  QuestionCategories,
  ScoreTiers,
} from "@/lib/types/project";
import { FetchEditorDataResponse } from "@/lib/querries/project";
import { LeadFormSchemaType } from "@/lib/pageEditor/editorLeadFormSchema";
import CategoryScoreStylist from "@/app/(main)/app/[appRef]/editor/pages/_components/elementTypes/elementUtils/scoreCategoriesStylist";
import { generateSampleDataFromTiers } from "@/lib/dummyData/fakeChartData";
import { generateQuizDummyData } from "@/lib/utils/quiz-simulator";

export type EditorConfig = {
  pageType: PageType;
  organizationId: string;
  allowCustomSections: boolean;
  enableDynamicContent: boolean;
  dataDependencies: ("scoreTiers" | "questions" | "categories")[];
};

interface PageBuilderStore {
  projectData: ProjectData | null;
  editorConfig: EditorConfig | null;
  page: FunnelPage | null;
  pageType: PageType;
  sections: ElementNode[];
  categories: QuestionCategories[];
  scoretiers: ScoreTiers[];
  questions: QuestionField[];
  selectedQuestion: QuestionField | null;
  showQuizLeadForm: boolean;
  theme: PageTheme;
  resultDummyData: GeneratedSampleData[];
  productCatalog: ProductCatalogType[];
  livemode: boolean;
  isHydrated: boolean;
  previewMode: boolean;
  isEditorLoading: boolean;
  device: DeviceType;
  selectedSectionId: string | null;
  activeElementId: string | null;
  hoveredSectionId: string | null;
  editingElementId: string | null;
  reset: () => void;
  initialize: (config: EditorConfig, data: FetchEditorDataResponse) => void;
  addButtonToSection: (sectionId: string) => void;
  setPageType: (type: PageType) => void;
  updateTheme: (updates: Partial<PageTheme>) => void;
  updateGlobalProperty: <K extends keyof PageBuilderStore>(
    key: K,
    value: PageBuilderStore[K]
  ) => void;
  setHoveredSectionId: (id: string | null) => void;
  setSelectedSectionId: (id: string | null) => void;
  setActiveElementId: (id: string | null) => void;
  setEditingElementId: (id: string | null) => void;
  findParentSectionId: (elementId: string) => string | null;
  addSection: (template: ElementNode) => void;
  addSectionAtIndex: (
    template: ElementNode,
    afterId: string,
    parentContainerElementId: string
  ) => void;
  updatePage: (
    updates:
      | Partial<FunnelPage>
      | ((section: FunnelPage) => Partial<FunnelPage>)
  ) => void;
  updateTool: (updates: Partial<ProjectData>) => void;
  updateSection: (
    id: string,
    updates:
      | Partial<ElementNode>
      | ((section: ElementNode) => Partial<ElementNode>)
  ) => void;
  updateSectionStyles: (
    sectionId: string,
    styles: Partial<React.CSSProperties>
  ) => void;
  updateElementProperty: (
    elementId: string,
    property: string,
    value: any,
    mainSectionId?: string
  ) => void;
  removeSmartLayoutItem: (
    parentId: string,
    itemId: string,
    mainParentId?: string
  ) => void;
  addLayoutItem: (parentSectionId: string, data: ElementNode) => void;
  addBtnItem: (
    sectionId: string,
    parentElementId: string,
    layoutType: string
  ) => void;
  reorderSections: (sections: ElementNode[]) => void;
  removeSection: (id: string) => void;
  setLiveMode: (livemode: boolean) => void;
  setPreviewMode: (previewMode: boolean) => void;
  duplicateSection: (id: string) => void;
  toggleSectionVisibility: (id: string) => void;
  setDevice: (device: DeviceType) => void;
  addQuestion: (question: QuestionField) => void;
  deleteQuestion: (questionId: string) => void;
  addCategory: (category: Partial<QuestionCategories>) => void;
  updateCategory: (
    categoryId: string,
    updates: Partial<QuestionCategories>
  ) => void;
  deleteCategory: (catId: string) => void;
  setSelectedQuestion: (question: QuestionField | null) => void;
  setShowQuizLeadForm: (show: boolean) => void;
  updateQuestion: (questionId: string, updates: Partial<QuestionField>) => void;
  updateQuestionLogic: (
    questionId: string,
    logicBranches: Logicbranch[]
  ) => void;
  updateQuestionScoring: (questionId: string, scoring: scoring[]) => void;
  updateScoreTiers: (tiers: ScoreTiers[]) => void;
}

const initialState = {
  projectData: null,
  editorConfig: null,
  page: null,
  sections: [],
  categories: [],
  scoretiers: [],
  questions: [],
  resultDummyData: [],
  productCatalog: dummyProductCatalogue,
  selectedQuestion: null,
  showQuizLeadForm: false,
  theme: defaultTheme,
  isHydrated: false,
  livemode: true,
  previewMode: false,
  isEditorLoading: true,
  selectedSectionId: null,
  activeElementId: null,
  device: "Desktop" as DeviceType,
  hoveredSectionId: null,
  editingElementId: null,
  pageType: "Landing_Page" as PageType,
};

export const usePageBuilderStore = create<PageBuilderStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => set(initialState),
      addButtonToSection: (sectionId: string) => {
        const { sections } = get();
        const newSections = sections.map((section) => {
          if (section.id === sectionId) {
            const buttonElement = {
              id: v4(),
              styles: {},
              className: "",
              name: "",
              type: "buttons",
              layoutType: "",
              isHidden: false,
              settings: {
                itemsHorizontalAlignment: "center",
              },
              content: [
                {
                  id: v4(),
                  styles: {},
                  className:
                    "inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
                  name: "",
                  type: "button_item",
                  isHidden: false,
                  settings: {
                    btn_action: "go_to_questions",
                    btn_style: "default",
                  },
                  content: {
                    href: "/questions",
                    innerText: "GET YOUR FREE ANALYSIS",
                  },
                },
              ],
            };

            return {
              ...section,
              content: Array.isArray(section.content)
                ? [...section.content, buttonElement]
                : [buttonElement],
            };
          }
          return section;
        });

        set({ sections: newSections });
      },

      initialize: (config, data) => {
        const questionsData = data.formFields;
        const categories = data.categories;
        const scoretiers = data.scoreTiersData;
        const pageData = data.funnelPages[0];

        const funnelForm: LeadFormSchemaType | undefined = data.projectData
          ?.leadOptinForm
          ? (data.projectData.leadOptinForm as unknown as LeadFormSchemaType)
          : undefined;

        const refinedProjectData: ProjectData = {
          id: data.projectData?.id || "",
          ref: data.projectData?.ref || "",
          title: data.projectData?.title as string,
          domain: data.projectData?.domain as string,
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
          : [];
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
          scripts: {
            headScript: "",
            bodyScript: "",
          },
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
            categoryIds: field.categoryIds
              ? (JSON.parse(field.categoryIds) as string[])
              : ([] as string[]),
            logicBranch: field.logicBranch ? JSON.parse(field.logicBranch) : [],

            scoring: field.scoring ? JSON.parse(field.scoring) : [],
            settings: field.settings ? JSON.parse(field.settings) : null,
          })) || [];
        let resultDummy;

        if (config.pageType === "Result_Page" && scoretiers && categories) {
          resultDummy = generateQuizDummyData(
            scoretiers,
            questions,
            categories
          );
          //resultDummy = generateSampleDataFromTiers(scoretiers, categories);
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
          resultDummyData: resultDummy ?? [],
          questions: questions,
          selectedQuestion: null,
          isEditorLoading: false,
        });
      },
      setPageType: (type) => set({ pageType: type }),
      setHoveredSectionId: (id) => set({ hoveredSectionId: id }),
      setSelectedSectionId: (id) => set({ selectedSectionId: id }),
      setActiveElementId: (id) => set({ activeElementId: id }),
      setEditingElementId: (id) => set({ editingElementId: id }),
      setDevice: (device) => set({ device: device }),
      setShowQuizLeadForm: (show) => set({ showQuizLeadForm: show }),
      findParentSectionId: (elementId: string) => {
        const state = get();
        return findTopLevelSectionId(state.sections, elementId);
      },
      addSection: (template) =>
        set((state) => ({
          sections: [...state.sections, { ...template }],
        })),
      addSectionAtIndex: (template, afterId, parentContainerElementId) =>
        set((state) => {
          const newSection = { ...template };

          if (parentContainerElementId) {
            return {
              sections: updateElementById(
                state.sections,
                parentContainerElementId,
                {
                  addItemAtIndex: {
                    afterIndex: afterId,
                    data: newSection,
                  },
                }
              ),
            };
          } else {
            const index = state.sections.findIndex((s) => s.id === afterId);
            const newSections = [
              ...state.sections.slice(0, index + 1),
              newSection,
              ...state.sections.slice(index + 1),
            ];
            return {
              sections: newSections,
              selectedSectionId: template.id,
            };
          }
        }),
      updateGlobalProperty: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),
      updatePage: (updates) => {
        const state = get();
        const newPage = {
          ...state.page,
          ...updates,
        };
        set({
          page: newPage as FunnelPage,
        });
      },
      updateTool: (updates) => {
        const state = get();
        const newTool = {
          ...state.projectData,
          ...updates,
        };
        set({
          projectData: newTool as ProjectData,
        });
      },

      updateSection: (id, updates) =>
        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.id === id) {
              const updatedSection =
                typeof updates === "function" ? updates(section) : updates;
              return { ...section, ...updatedSection };
            }
            return section;
          }),
        })),
      updateTheme: (updates: Partial<PageTheme>) => {
        const state = get();
        const newTheme = {
          ...state.theme,
          ...updates,
        };
        set({
          theme: newTheme,
          //   themeHistory: [...state.themeHistory, newTheme],
          //   themeHistoryIndex: state.themeHistory.length,
          isHydrated: true,
        });
      },
      updateSectionStyles: (sectionId, newStyles) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  styles: { ...section.styles, ...newStyles },
                }
              : section
          ),
        })),
      updateElementProperty: (elementId, property, value, mainSectionId) =>
        set((state) => {
          return {
            sections: updateElementById(state.sections, elementId, {
              updateProperty: {
                property: property,
                value: value,
              },
            }),
          };
        }),
      addLayoutItem: (parentSectionId: string, data: ElementNode) =>
        set((state) => {
          return {
            sections: updateElementById(state.sections, parentSectionId, {
              addItem: {
                data: data,
              },
            }),
          };
        }),
      addBtnItem: (sectionId: string, parentElementId, layoutType: string) =>
        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.id === sectionId) {
              return addBtnElement(section, parentElementId, layoutType);
            }
            return section;
          }),
        })),
      reorderSections: (sections) => set({ sections }),
      removeSection: (id: string) =>
        set((state) => {
          let updatedData = findAndRemoveSection(state.sections, id);
          let quizIds_to_delete = updatedData.removedQuizIds;

          if (!quizIds_to_delete || quizIds_to_delete.length === 0) {
            return {
              sections: updatedData.updatedNodes,
              selectedSectionId:
                state.selectedSectionId === id ? null : state.selectedSectionId,
              activeElementId:
                state.activeElementId === id ? null : state.activeElementId,
            };
          }

          // Build a Set for O(1) lookups
          const toDelete = new Set(quizIds_to_delete);

          return {
            sections: updatedData.updatedNodes,
            questions: state.questions.filter((q) => !toDelete.has(q.id)),
            selectedSectionId:
              state.selectedSectionId === id ? null : state.selectedSectionId,
            activeElementId:
              state.activeElementId === id ? null : state.activeElementId,
            hasUnsavedChanges: true,
          };
        }),

      removeSmartLayoutItem: (
        parentId: string,
        itemId: string,
        mainParentId?: string
      ) =>
        set((state) => {
          return {
            sections: updateElementById(state.sections, parentId, {
              removeItem: {
                elementId: itemId,
              },
            }),
          };
        }),
      duplicateSection: (id) =>
        set((state) => {
          const sectionToDuplicate = state.sections.find(
            (section) => section.id === id
          );
          if (!sectionToDuplicate) return state;
          const duplicateSection = {
            ...sectionToDuplicate,
            id: v4(),
            name: `${sectionToDuplicate.name || "Section"} (Copy)`,
          };
          return {
            sections: [...state.sections, duplicateSection],
          };
        }),
      toggleSectionVisibility: (id: string) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id
              ? { ...section, isHidden: !section.isHidden }
              : section
          ),
        })),
      addQuestion: (question) =>
        set((state) => ({
          questions: [...state.questions, { ...question }],
          selectedQuestion: question,
          hasUnsavedChanges: true,
        })),

      updateQuestion: (questionId, updates) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId ? { ...q, ...updates } : q
          ),
          selectedQuestion:
            state.selectedQuestion?.id === questionId
              ? { ...state.selectedQuestion, ...updates }
              : state.selectedQuestion,
          hasUnsavedChanges: true,
        })),
      deleteQuestion: (questionId: string) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== questionId),
          selectedQuestion:
            state.selectedQuestion?.id === questionId
              ? null
              : state.selectedQuestion,
          hasUnsavedChanges: true,
        })),

      addCategory: (cat) =>
        set((state) => {
          const newState = {
            categories: [...state.categories, { ...cat }],
            hasUnsavedChanges: true,
          };
          return newState;
        }),
      updateCategory: (categoryId, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId ? { ...c, ...updates } : c
          ),
          hasUnsavedChanges: true,
        })),
      deleteCategory: (catId: string) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== catId),
          hasUnsavedChanges: true,
        })),

      setSelectedQuestion: (question) =>
        set((state) => ({
          selectedQuestion: question,
        })),
      updateQuestionLogic: (questionId, logicBranches) =>
        set((state) => {
          const updatedQuestions = state.questions.map((q) =>
            q.id === questionId ? { ...q, logic_branch: logicBranches } : q
          );

          return {
            questions: updatedQuestions,
            hasUnsavedChanges: true,
            selectedQuestion:
              state.selectedQuestion?.id === questionId
                ? { ...state.selectedQuestion, logic_branch: logicBranches }
                : state.selectedQuestion,
          };
        }),

      updateQuestionScoring: (questionId: string, scoringDetails: scoring[]) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId ? { ...q, scoring: scoringDetails } : q
          ),
        })),

      updateScoreTiers: (tiers) => set({ scoretiers: tiers }),

      setLiveMode: (livemode) => set({ livemode }),
      setPreviewMode: (previewMode) => set({ previewMode }),
    }),
    {
      name: "page-builder-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
