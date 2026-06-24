"use client";

import { ChevronDown, Calendar, AppWindow } from "lucide-react";
import { HiMiniArrowTurnDownRight } from "react-icons/hi2";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  MinimalFunnelPage,
  QuestionCategories,
  ScoreTiers,
} from "@/lib/types/project";
import { QuizRedirectLogic } from "@/stores/pageEditorStore/types";

type QuizEndLogicEditorProps = {
  resultPages: MinimalFunnelPage[];
};

const QuizEndLogicEditor = ({ resultPages }: QuizEndLogicEditorProps) => {
  const { projectData, categories, scoretiers, updateTool } =
    usePageBuilderStore();

  const [isExpanded] = useState(true);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  const redirectLogic = projectData?.settings?.quizRedirectLogic;
  const defaultResultPage =
    resultPages?.find((p: any) => p.defaultPage) ?? resultPages?.[0] ?? null;

  const getScoreTier = (tierId: string) =>
    scoretiers.find((tier: ScoreTiers) => tier.id === tierId);

  const getCategory = (catId: string) =>
    categories.find((cat: QuestionCategories) => cat.id === catId);

  const getCurrentPage = (pageId: string) =>
    resultPages?.find((page: any) => page.id === pageId);

  /**
   * Handle change of quiz redirect logic strategy
   */
  const handleStrategyChange = (
    newStrategy: "DEFAULT" | "SCORE_TIER" | "OUTCOME"
  ) => {
    if (!projectData) return;

    // Guard clause for missing required data
    if (
      newStrategy === "SCORE_TIER" &&
      (!scoretiers || scoretiers.length === 0)
    ) {
      setAlert({
        open: true,
        message:
          "You need to create at least one Score Tier before using the 'Score-Based Redirect' strategy.",
      });
      return;
    }

    if (newStrategy === "OUTCOME" && (!categories || categories.length === 0)) {
      setAlert({
        open: true,
        message:
          "You need to create at least one Category before using the 'Outcome-Based Redirect' strategy.",
      });
      return;
    }

    const buildLogic = (): QuizRedirectLogic => {
      const baseConfig = {
        default: { resultPageId: defaultResultPage?.id },
        scoreTier: { fallbackPageId: defaultResultPage?.id, mappings: [] },
        outcome: {
          scoringDirection: "HIGHEST" as const,
          fallbackPageId: defaultResultPage?.id,
          mappings: [],
        },
      };

      if (newStrategy === "SCORE_TIER") {
        const mappings = scoretiers.map((tier) => ({
          tierId: tier.id,
          resultPageId: defaultResultPage?.id,
        }));
        return {
          strategy: newStrategy,
          config: {
            ...baseConfig,
            scoreTier: { ...baseConfig.scoreTier, mappings },
          },
        };
      }

      if (newStrategy === "OUTCOME") {
        const mappings = categories.map((cat) => ({
          categoryId: cat.id,
          resultPageId: defaultResultPage?.id,
        }));
        return {
          strategy: newStrategy,
          config: {
            ...baseConfig,
            outcome: { ...baseConfig.outcome, mappings },
          },
        };
      }

      // DEFAULT strategy
      return { strategy: "DEFAULT", config: baseConfig };
    };

    updateTool({
      ...projectData,
      settings: { ...projectData?.settings, quizRedirectLogic: buildLogic() },
    });
  };

  const handleOverallScoreRedirectPageChange = (
    tierId: string,
    resultPageId: string
  ) => {
    if (!projectData || !redirectLogic) return;
    const updatedMappings = redirectLogic.config.scoreTier.mappings.map((m) =>
      m.tierId === tierId ? { ...m, resultPageId } : m
    );

    updateTool({
      ...projectData,
      settings: {
        ...projectData?.settings,
        quizRedirectLogic: {
          ...redirectLogic,
          config: {
            ...redirectLogic.config,
            scoreTier: {
              ...redirectLogic.config.scoreTier,
              mappings: updatedMappings,
            },
          },
        },
      },
    });
  };

  const handleOutcomeRedirectPageChange = (
    categoryId: string,
    resultPageId: string
  ) => {
    if (!projectData || !redirectLogic) return;
    const updatedMappings = redirectLogic.config.outcome.mappings.map((m) =>
      m.categoryId === categoryId ? { ...m, resultPageId } : m
    );

    updateTool({
      ...projectData,
      settings: {
        ...projectData?.settings,
        quizRedirectLogic: {
          ...redirectLogic,
          config: {
            ...redirectLogic.config,
            outcome: {
              ...redirectLogic.config.outcome,
              mappings: updatedMappings,
            },
          },
        },
      },
    });
  };

  const handleOutcomeLogicChange = (val: string) => {
    if (!projectData || !redirectLogic) return;
    updateTool({
      ...projectData,
      settings: {
        ...projectData?.settings,
        quizRedirectLogic: {
          ...redirectLogic,
          config: {
            ...redirectLogic.config,
            outcome: {
              ...redirectLogic.config.outcome,
              scoringDirection: val as "HIGHEST" | "LOWEST",
            },
          },
        },
      },
    });
  };

  return (
    <>
      <ScrollArea className="max-h-[500px] pr-4 overflow-hidden">
        <div className="w-full flex items-start justify-center space-y-4">
          <div className="w-full p-4 flex flex-col gap-4">
            {/* Redirect Strategy Selection */}
            <div className="w-[600px] flex items-center gap-x-3">
              <label
                htmlFor="condition-type"
                className="text-sm font-semibold whitespace-nowrap"
              >
                Redirect Logic
              </label>
              <div className="w-full">
                <Select
                  value={redirectLogic?.strategy || "DEFAULT"}
                  onValueChange={handleStrategyChange}
                >
                  <SelectTrigger id="redirect-logic-strategy">
                    <SelectValue placeholder="Select Redirect Logic..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEFAULT">
                      Default Redirect (all users go to default result page)
                    </SelectItem>
                    <SelectItem value="SCORE_TIER">
                      Overall Score-Based Redirect
                    </SelectItem>
                    <SelectItem value="OUTCOME">
                      Category Score-Based Redirect
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Existing SCORE_TIER & OUTCOME logic rendering preserved */}
            {redirectLogic?.strategy === "SCORE_TIER" &&
              redirectLogic.config.scoreTier.mappings.map((logic) => (
                <div key={logic.tierId} className="w-full">
                  <span className="mb-1.5 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    If overall score tier is:
                  </span>
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{
                            background:
                              getScoreTier(logic.tierId)?.scoreColour ?? "#000",
                          }}
                        ></div>
                        <p className="font-semibold">
                          {getScoreTier(logic.tierId)?.name ?? "Unknown Tier"}
                        </p>
                        <p>
                          {getScoreTier(logic.tierId)?.scoreFrom ?? 0}%–
                          {getScoreTier(logic.tierId)?.scoreTo ?? 100}%
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    <div className="border-t border-gray-200" />
                    <div className="flex items-center gap-2 px-3 py-2">
                      <HiMiniArrowTurnDownRight className="h-4 w-4 text-gray-400" />
                      <p className="whitespace-nowrap inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                        redirect to
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <AppWindow className="h-4 w-4 text-gray-500" />
                              <span>
                                {getCurrentPage(logic.resultPageId as string)
                                  ?.title ?? "Select page"}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                          <DropdownMenuLabel>Endings</DropdownMenuLabel>
                          <DropdownMenuGroup>
                            {resultPages?.map((page: any) => (
                              <DropdownMenuItem
                                key={page.id}
                                onClick={() =>
                                  handleOverallScoreRedirectPageChange(
                                    logic.tierId,
                                    page.id
                                  )
                                }
                              >
                                {page.title}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}

            {redirectLogic?.strategy === "OUTCOME" && (
              <div className="w-full">
                <div className="w-[600px] flex items-center gap-x-3">
                  <label
                    htmlFor="outcome-strategy"
                    className="text-sm font-semibold whitespace-nowrap"
                  >
                    Outcome strategy
                  </label>
                  <div className="w-full">
                    <Select
                      value={redirectLogic.config.outcome.scoringDirection}
                      onValueChange={handleOutcomeLogicChange}
                    >
                      <SelectTrigger id="outcome-strategy">
                        <SelectValue placeholder="Select Outcome Strategy..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGHEST">
                          Highest Scoring Category
                        </SelectItem>
                        <SelectItem value="LOWEST">
                          Lowest Scoring Category
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {redirectLogic.config.outcome.mappings.map((logic) => (
                  <div key={logic.categoryId}>
                    <span className="mb-1.5 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {redirectLogic.config.outcome.scoringDirection ===
                      "HIGHEST"
                        ? "If highest category is:"
                        : "If lowest category is:"}
                    </span>
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                      <button className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            {getCategory(logic.categoryId)?.title ??
                              "Unknown Category"}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </button>

                      <div className="border-t border-gray-200" />
                      <div className="flex items-center gap-2 px-3 py-2">
                        <HiMiniArrowTurnDownRight className="h-4 w-4 text-gray-400" />
                        <p className="whitespace-nowrap inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                          redirect to
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-full flex items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-50">
                              <div className="flex items-center gap-2">
                                <AppWindow className="h-4 w-4 text-gray-500" />
                                <span>
                                  {getCurrentPage(logic.resultPageId as string)
                                    ?.title ?? "Select page"}
                                </span>
                              </div>
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>Endings</DropdownMenuLabel>
                            <DropdownMenuGroup>
                              {resultPages?.map((page: any) => (
                                <DropdownMenuItem
                                  key={page.id}
                                  onClick={() =>
                                    handleOutcomeRedirectPageChange(
                                      logic.categoryId,
                                      page.id
                                    )
                                  }
                                >
                                  {page.title}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Shadcn Alert Dialog */}
      <AlertDialog
        open={alert.open}
        onOpenChange={(open) => setAlert({ ...alert, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <HiOutlineExclamationTriangle className="h-5 w-5 text-yellow-500" />
              Missing Required Setup
            </AlertDialogTitle>
            <AlertDialogDescription>{alert.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlert({ open: false, message: "" })}
            >
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuizEndLogicEditor;
