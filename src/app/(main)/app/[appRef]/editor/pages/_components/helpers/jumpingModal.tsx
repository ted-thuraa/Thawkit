"use client";
import { Plus, Trash2, ArrowBigDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";
import { Label } from "@/components/ui/label";
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
import { DialogProvider, useDialog } from "@/providers/dialog-provider";
import Link from "next/link";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { Logicbranch } from "@/stores/pageEditorStore/types";

const JumpingDialog = ({}) => {
  const {
    questions,
    categories,
    selectedQuestion,
    updateQuestionLogic,
    updateQuestionScoring,
  } = usePageBuilderStore();

  const filtered_questions = questions.filter((q) => q.context === "Quiz_Page");
  // Reuse existing handlers from main component
  const addJumpingRule = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const newRule: Logicbranch = {
      id: v4(),
      statement: "if",
      op: "is",
      option_id: "",
      outcome_type: "field",
      outcome_id: "",
    };

    updateQuestionLogic(questionId, [...(question.logicBranch || []), newRule]);
  };

  const updateJumpingRule = (
    questionId: string,
    ruleIndex: number,
    field: keyof Logicbranch,
    value: string
  ) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const updatedLogicBranch = question.logicBranch.map((rule, index) =>
      index === ruleIndex ? { ...rule, [field]: value } : rule
    );

    updateQuestionLogic(questionId, updatedLogicBranch);
  };

  const deleteJumpingRule = (questionId: string, ruleIndex: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const updatedLogicBranch = question.logicBranch.filter(
      (_, index) => index !== ruleIndex
    );

    updateQuestionLogic(questionId, updatedLogicBranch);
  };

  return (
    <>
      <ScrollArea className="h-[500px] pr-4 overflow-hidden">
        <div className="space-y-4">
          {filtered_questions.map((question, questionIndex) => (
            <div key={question.id} className="space-y-2 bg-card p-4 rounded-xl">
              <h3 className="font-semibold">
                {question.order}. {extractTextFromHtml(question.title)}
              </h3>
              <div className="ml-8 space-y-2">
                {question.logicBranch.map((rule, ruleIndex) => (
                  <div key={ruleIndex} className="  p-2 rounded">
                    {rule.statement === "if" && (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Select
                              value={"if"}
                              // onValueChange={(value) =>
                              //   updateJumpingRule(
                              //     question.id,
                              //     ruleIndex,
                              //     "op",
                              //     value
                              //   )
                              // }
                            >
                              <SelectTrigger className="w-[20%] bg-sidebar">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="if">iF</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={question.title || ""}
                              // onValueChange={(value) =>
                              //   updateJumpingRule(
                              //     question.id,
                              //     ruleIndex,
                              //     "option_id",
                              //     value
                              //   )
                              // }
                            >
                              <SelectTrigger className="w-[80%] bg-sidebar">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={question.title}>
                                  {extractTextFromHtml(question.title)}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className=" flex items-center space-x-2">
                            <div className="w-[20%]"></div>
                            <Select
                              value={(rule?.op as string) || ""}
                              onValueChange={(value) =>
                                updateJumpingRule(
                                  question.id,
                                  ruleIndex,
                                  "op",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-[20%] bg-sidebar">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="is">is</SelectItem>
                                <SelectItem value="is not">is not</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={rule.option_id || ""}
                              onValueChange={(value) =>
                                updateJumpingRule(
                                  question.id,
                                  ruleIndex,
                                  "option_id",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-[60%] bg-sidebar">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                {question.options?.map((option) => (
                                  <SelectItem key={option.id} value={option.id}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="my-4 w-full flex items-center justify-center">
                          {/* <ArrowDown className="w-6 h-6" /> */}
                          <ArrowBigDown className="w-6 h-6" />
                        </div>
                        <div className="">
                          <div className="flex items-center space-x-2">
                            <span className="w-[20%]">Then</span>
                            <Select
                              value={rule.outcome_type}
                              onValueChange={(value) =>
                                updateJumpingRule(
                                  question.id,
                                  ruleIndex,
                                  "outcome_type",
                                  value as "field" | "page"
                                )
                              }
                            >
                              <SelectTrigger className=" w-[20%] bg-sidebar">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="field">
                                  Go to field
                                </SelectItem>
                                <SelectItem value="page">Go to page</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={rule.outcome_id || ""}
                              onValueChange={(value) =>
                                updateJumpingRule(
                                  question.id,
                                  ruleIndex,
                                  "outcome_id",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-[60%] bg-sidebar">
                                <SelectValue placeholder="Select destination" />
                              </SelectTrigger>
                              <SelectContent>
                                {questions.map((q, qIndex) => (
                                  <SelectItem key={q.id} value={q.id}>
                                    {qIndex + 1}: {extractTextFromHtml(q.title)}
                                  </SelectItem>
                                ))}
                                {/* Add page options here if available */}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            deleteJumpingRule(question.id, ruleIndex)
                          }
                          className="mt-4 p-1 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-" />
                          Delete rule
                        </Button>
                      </>
                    )}
                    {rule.statement === "Always" && (
                      <>
                        <div className="flex items-center space-x-2 w-full pb-4 border-b">
                          <span className="w-[20%]">Always go to</span>
                          <Select
                            value={rule.outcome_id || ""}
                            onValueChange={(value) =>
                              updateJumpingRule(
                                question.id,
                                ruleIndex,
                                "outcome_id",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="max-w-[80%] bg-sidebar">
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                              {questions.map((q) => (
                                <SelectItem key={q.id} value={q.id}>
                                  Question: {extractTextFromHtml(q.title)}
                                </SelectItem>
                              ))}
                              {/* Add page options here if available */}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {(question.type === "MULTIPLE_CHOICE" ||
                  question.type === "YES_NO") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-blue-600"
                    onClick={() => addJumpingRule(question.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add rule
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {/* <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </div> */}
    </>
  );
};

export default JumpingDialog;
