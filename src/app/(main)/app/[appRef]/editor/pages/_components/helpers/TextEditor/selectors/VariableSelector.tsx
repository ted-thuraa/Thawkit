import React, { useState, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronRight, Database, ArrowLeft } from "lucide-react";
import { resultDataDummy } from "@/lib/dummyData/resultPage";

// --- Data Transformation Logic ---
// We transform your dummy data into a standard navigable structure
type MenuItem = {
  id: string;
  label: string;
  children?: MenuItem[];
  value?: string; // The path string for the parser
  category?: string;
};

const buildMenuData = (): MenuItem[] => {
  // 1. Lead Data
  const leadItems: MenuItem[] = [
    {
      id: "lead-fn",
      label: "First Name",
      value: "leadData.firstName",
      category: "Lead",
    },
    {
      id: "lead-ln",
      label: "Last Name",
      value: "leadData.lastName",
      category: "Lead",
    },
    {
      id: "lead-em",
      label: "Email",
      value: "leadData.email",
      category: "Lead",
    },
  ];

  // 2. Scores (Dynamic based on Category Scores)
  const scoreItems: MenuItem[] = resultDataDummy.categoryScores.map((cat) => ({
    id: cat.categoryId,
    label: cat.categoryTitle,
    children: [
      {
        id: `${cat.categoryId}-tier`,
        label: "Score Tier",
        value: `categoryScores.${cat.categoryId}.scoreTierName`,
        category: "Scores",
      },
      {
        id: `${cat.categoryId}-pct`,
        label: "Percentage",
        value: `categoryScores.${cat.categoryId}.score_percentage`,
        category: "Scores",
      },
      {
        id: `${cat.categoryId}-val`,
        label: "Raw Score",
        value: `categoryScores.${cat.categoryId}.score`,
        category: "Scores",
      },
    ],
  }));

  // 3. Answers (Dynamic based on Questions)
  const answerItems: MenuItem[] = resultDataDummy.questionsData.map((q) => ({
    id: q.id,
    label: q.title.length > 30 ? q.title.substring(0, 30) + "..." : q.title,
    children: [
      {
        id: `${q.id}-title`,
        label: "Question Title",
        value: `questionsData.${q.id}.title`,
        category: "Answers",
      },
      // Assuming QuizAnswers[0] is the user's answer
      {
        id: `${q.id}-ans`,
        label: "User Answer",
        value: `questionsData.${q.id}.QuizAnswers.0.answer`,
        category: "Answers",
      },
      {
        id: `${q.id}-score`,
        label: "Score Awarded",
        value: `questionsData.${q.id}.QuizAnswers.0.score`,
        category: "Answers",
      },
    ],
  }));

  return [
    { id: "grp-lead", label: "Lead Info", children: leadItems },
    { id: "grp-scores", label: "Category Scores", children: scoreItems },
    { id: "grp-answers", label: "Quiz Answers", children: answerItems },
  ];
};

interface VariableSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: { label: string; id: string; category: string }) => void;
}

export const VariableSelector = ({
  open,
  onOpenChange,
  onSelect,
}: VariableSelectorProps) => {
  const [activeMenu, setActiveMenu] = useState<MenuItem | null>(null);
  const rootItems = useMemo(() => buildMenuData(), []);

  // Determine which items to show: Root or Children of Active
  const currentItems = activeMenu ? activeMenu.children || [] : rootItems;

  const handleSelect = (item: MenuItem) => {
    if (item.children) {
      setActiveMenu(item);
    } else {
      // Leaf node - actually insert the variable
      onSelect({
        label: item.label, // Display text
        id: item.value || "", // The data path
        category: item.category || "Data",
      });
      onOpenChange(false);
      setActiveMenu(null);
    }
  };

  const handleBack = () => {
    setActiveMenu(null);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        if (!val) setActiveMenu(null); // Reset on close
        onOpenChange(val);
      }}
    >
      {/* Trigger is hidden, controlled externally by Editor */}
      <PopoverTrigger asChild>
        <div className="w-0 h-0" />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start" side="bottom">
        <Command>
          <div className="flex items-center border-b px-3">
            {activeMenu ? (
              <button
                onClick={handleBack}
                className="mr-2 hover:bg-muted p-1 rounded"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <Database className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            )}
            <CommandInput
              placeholder={
                activeMenu
                  ? `Search ${activeMenu.label}...`
                  : "Search variables..."
              }
              className="flex-1 border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup
              heading={activeMenu ? activeMenu.label : "Data Sources"}
            >
              {currentItems.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="cursor-pointer"
                >
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.children && (
                    <ChevronRight className="ml-2 h-4 w-4 opacity-50" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
