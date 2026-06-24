"use client";
import {
  Plus,
  LayoutGrid,
  Settings,
  Palette,
  ListOrdered,
  LayoutList,
  Trash2,
  Trash,
  ChevronRight,
  ShoppingCart,
  Briefcase,
  Folder,
  List,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, extractTextFromHtml } from "@/lib/utils";
import { DialogProvider } from "@/providers/dialog-provider";
import CreateQuestion from "./createQuestion";
import { Switch } from "@/components/ui/switch";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { QuestionField } from "@/stores/pageEditorStore/types";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ScreeningTabElementsDialog from "./screeningTabElementsDialog";

const QuestionsList = () => {
  const [hoveredId, setHoveredId] = useState("");
  const [isAddScreeningTabElementsOpen, setIsAddScreeningTabElementsOpen] =
    useState(false);

  const {
    page,
    questions,
    scoretiers,
    categories,
    selectedQuestion,
    showQuizLeadForm,
    deleteQuestion,
    updatePage,
    setSelectedQuestion,
    setShowQuizLeadForm,
  } = usePageBuilderStore();

  const handleDeleteQuestion = (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteQuestion(questionId);
  };

  const handleQuestionSelected = (question: QuestionField) => {
    setSelectedQuestion(question);
    setShowQuizLeadForm(false);
  };

  const handleShowLeadForm = (val: boolean) => {
    setSelectedQuestion(null);
    setShowQuizLeadForm(val);
  };

  const handlePageSettingsUpdate = (field: string, value: boolean) => {
    if (page) {
      const newPage = {
        ...page,
        settings: {
          ...page.settings,
          [field]: value,
        },
      };
      updatePage(newPage);
    }
  };

  // --- Grouping Logic ---
  // 1. We organize questions by mapping through available categories
  // 2. We find "Uncategorized" questions (those with empty categoryIds)
  const groupedQuestions = useMemo(() => {
    const activeQuestions = questions.filter((q) => q.context === "Quiz_Page");

    // Create groups for each defined category
    const categoryGroups = categories.map((cat) => {
      return {
        ...cat,
        questions: activeQuestions.filter((q) =>
          q.categoryIds?.includes(cat.id)
        ),
      };
    });

    // Find questions that belong to NO category
    const uncategorizedQuestions = activeQuestions.filter(
      (q) => !q.categoryIds || q.categoryIds.length === 0
    );

    return { categoryGroups, uncategorizedQuestions };
  }, [questions, categories]);

  // Helper to render a specific list of questions
  const renderQuestionGroup = (groupQuestions: QuestionField[]) => {
    if (groupQuestions.length === 0) return null;

    return (
      <div className="relative bg-white rounde space-y-1  overflow-hidden  divide-y divide-gray-100">
        {groupQuestions.map((question, index) => {
          const isSelected =
            !showQuizLeadForm &&
            selectedQuestion &&
            selectedQuestion.id === question.id;

          return (
            <div
              key={question.id}
              onClick={() => handleQuestionSelected(question)}
              onMouseEnter={() => setHoveredId(question.id)}
              onMouseLeave={() => setHoveredId("")}
              className={cn(
                "group relative py-1 px-2 flex items-center justify-between w-full rounded cursor-pointer shadow-sm border border-gray-200 transition-colors hover:bg-gray-50",
                isSelected ? "bg-indigo-50/50" : "bg-white"
              )}
            >
              {/* Left side: Icon (circle) + Text */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full border flex-shrink-0 transition-colors",
                    isSelected
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-300 group-hover:border-gray-400"
                  )}
                />
                <div className="flex flex-col overflow-hidden">
                  <p
                    className={cn(
                      "text-xs font-normal truncate",
                      isSelected ? "text-indigo-900" : "text-gray-900"
                    )}
                  >
                    {extractTextFromHtml(question.title)
                      .split(" ")
                      .slice(0, 4)
                      .join(" ")}
                    {extractTextFromHtml(question.title).split(" ").length >
                      4 && "..."}
                  </p>
                  {/* Optional: Show part of description if needed, or remove to match clean iOS look */}
                  {/* <p className="text-xs text-gray-400 truncate">
                    {index + 1}. Question
                  </p> */}
                </div>
              </div>

              {/* Hover Actions (Delete) */}
              {hoveredId === question.id && (
                <div className="absolute right-0 flex items-center">
                  <button
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                    onClick={(e) => handleDeleteQuestion(question.id, e)}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      {/* <div className="px-1  pb-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
          Lists
        </h1>

        <Popover
          open={isAddScreeningTabElementsOpen}
          onOpenChange={setIsAddScreeningTabElementsOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 h-auto hover:bg-transparent text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1"
            >
              <div className="bg-indigo-100 p-1 rounded-full">
                <Plus className="h-4 w-4" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-96 absolute -top-[12rem] right-2 bg-white text-editor-foreground border-b border-editor-border shadow-md"
            side="left"
          >
            <ScreeningTabElementsDialog
              onCancel={() => setIsAddScreeningTabElementsOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div> */}

      {/* SCROLL AREA — Only category + uncategorized groups */}
      <div className="max-h-[291px] overflow-hidden overflow-y-auto px-1 space-y-6">
        {/* CATEGORIES */}
        {groupedQuestions.categoryGroups.map((group) => {
          if (group.questions.length === 0) return null;

          return (
            <div key={group.id} className="mb-2">
              <div className="flex items-center gap-2 mb-2 px-1">
                <Folder
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  fillOpacity={0.2}
                />
                <h2 className="text-sm font-bold text-gray-900 leading-none">
                  {group.title}
                </h2>
                <ChevronRight
                  className="w-5 h-5 text-gray-400 font-bold"
                  strokeWidth={3}
                />
              </div>

              {renderQuestionGroup(group.questions)}
            </div>
          );
        })}

        {/* UNCATEGORIZED */}
        {groupedQuestions.uncategorizedQuestions.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2 px-1">
              <List className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-bold text-gray-900 leading-none">
                Uncategorized
              </h2>
              <ChevronRight
                className="w-5 h-5 text-gray-400 font-bold"
                strokeWidth={3}
              />
            </div>

            {renderQuestionGroup(groupedQuestions.uncategorizedQuestions)}
          </div>
        )}
      </div>

      {/* FIXED FOOTER (Lead Form) */}
      <div className="pt-4 border-t border-gray-100 flex-shrink-0">
        <div
          onClick={() => handleShowLeadForm(true)}
          className={cn(
            "group relative py-3 px-4 flex items-center justify-between w-full bg-white border rounded-xl cursor-pointer shadow-sm transition-all",
            showQuizLeadForm
              ? "border-indigo-600 ring-1 ring-indigo-600"
              : "border-gray-200 hover:border-indigo-300"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700">
              <span className="text-xs font-bold">LF</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Lead Form</p>
              <p className="text-xs text-gray-500">Collect user details</p>
            </div>
          </div>

          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch
              checked={page?.settings?.generate_leads}
              onCheckedChange={(val) =>
                handlePageSettingsUpdate("generate_leads", val)
              }
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;

// const QuestionsList = () => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoveredId, setHoveredId] = useState("");
//   const [isAddScreeningTabElementsOpen, setIsAddScreeningTabElementsOpen] =
//     useState(false);
//   const {
//     page,
//     questions,
//     categories,
//     selectedQuestion,
//     showQuizLeadForm,
//     deleteQuestion,
//     updatePage,
//     deleteCategory,
//     setSelectedQuestion,
//     setShowQuizLeadForm,
//   } = usePageBuilderStore();
//   const [dropDownOpen, setDropDownOpen] = useState(false);

//   // const handleNewQuestion = () => {
//   //   setIsDialogOpen(true);
//   // };
//   // const handleNewCategory = () => {
//   //   setIsCategoryDialogOpen(true);
//   // };

//   const handleDeleteQuestion = (questionId: string, e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent triggering the onClick that sets selected question

//     deleteQuestion(questionId); // This will remove the question
//   };

//   const handleQuestionSelected = (question: QuestionField) => {
//     setSelectedQuestion(question);
//     setShowQuizLeadForm(false);
//   };
//   const handleShowLeadForm = (val: boolean) => {
//     setSelectedQuestion(null);
//     setShowQuizLeadForm(val);
//   };

//   const handlePageSettingsUpdate = (field: string, value: boolean) => {
//     if (page) {
//       const newPage = {
//         ...page,
//         settings: {
//           ...page.settings,
//           [field]: value,
//         },
//       };
//       updatePage(newPage);
//     }
//   };

//   console.log(questions);
//   console.log(categories);

//   return (
//     <>
//       <div className="w-full h-full ">
//         <div className="max-h-[14rem] overflow-y-auto">

//           {questions
//             .filter((q) => q.context === "Quiz_Page")
//             .map((question, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleQuestionSelected(question)}
//                 onMouseEnter={() => setHoveredId(question.id)}
//                 onMouseLeave={() => setHoveredId("")}
//                 className={cn(
//                   "group relative mb-1 py-2 px-1 flex items-center  flex-row  w-full gap-x-1 border bg-white   text-editor-foreground   rounded-sm cursor-pointer",
//                   !showQuizLeadForm &&
//                     selectedQuestion &&
//                     selectedQuestion.id === question.id
//                     ? "border-indigo-600"
//                     : "border-input"
//                 )}
//               >
//                 <p
//                   className={` text-sm font-normal  truncate whitespace-nowrap overflow-hidden cursor-pointer  rounded-md transition-colors `}
//                 >
//                   {index + 1}.
//                 </p>
//                 <p
//                   className={`text-xs font-normal cursor-pointer rounded-md transition-colors`}
//                 >
//                   {extractTextFromHtml(question.title)
//                     .split(" ")
//                     .slice(0, 2)
//                     .join(" ")}
//                   {extractTextFromHtml(question.title).split(" ").length > 3 &&
//                     "..."}
//                 </p>

//                 {hoveredId === question.id && (
//                   <div className="absolute z-30 right-[2px] top-1 p-[0.4rem] bg-editor-component text-editor-foreground border-b border-editor-border shadow-md rounded-md">
//                     <div className="flex flex-row flex-nowrap space-x-1.5">
//                       <button
//                         className="text-destructive"
//                         onClick={(e) => handleDeleteQuestion(question.id, e)}
//                       >
//                         <Trash className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//         </div>
//         <Popover
//           open={isAddScreeningTabElementsOpen}
//           onOpenChange={setIsAddScreeningTabElementsOpen}
//         >
//           <PopoverTrigger asChild>
//             <Button className=" p-1 bg-transparent hover:bg-transparent text-sm font-medium text-indigo-600 hover:text-indigo-500">
//               <Plus className="h-2 w-2" />
//               Add Question
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent
//             className="w-96 absolute -top-[12rem] right-2 bg-white text-editor-foreground border-b border-editor-border shadow-md"
//             side="left"
//           >
//             <ScreeningTabElementsDialog
//               onCancel={() => setIsAddScreeningTabElementsOpen(false)}
//             />
//           </PopoverContent>
//         </Popover>

//         <div className="">

//           <div
//             onClick={() => handleShowLeadForm(true)}
//             className={cn(
//               "group relative mb-1 py-2 px-1 flex items-center  flex-row  w-full gap-x-1 border bg-white   text-editor-foreground  shadow rounded-sm cursor-pointer",
//               showQuizLeadForm ? "border-indigo-600" : "border-input"
//             )}
//           >
//             <p
//               className={` text-sm font-normal  truncate whitespace-nowrap overflow-hidden cursor-pointer  rounded-md transition-colors `}
//             >
//               LF
//             </p>
//             <p
//               className={`text-xs font-normal cursor-pointer rounded-md transition-colors`}
//             >
//               Lead form
//             </p>

//             <div className="lg:flex-grow">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 w-full cursor-pointer  ">
//                   <Switch
//                     checked={page?.settings?.generate_leads}
//                     onCheckedChange={(val) =>
//                       handlePageSettingsUpdate("generate_leads", val)
//                     }
//                     className="h-[18px] w-[30px]"
//                     // thumbClassName="h-[14px] w-[14px] data-[state=checked]:translate-x-[13px] data-[state=unchecked]:translate-x-[2px]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default QuestionsList;
