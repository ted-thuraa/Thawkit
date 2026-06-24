"use client";
import {
  Plus,
  LayoutGrid,
  Settings,
  Palette,
  X,
  CirclePercent,
  GitBranch,
  PlusIcon,
  TypeIcon,
  Group,
  ListOrdered,
  LayoutList,
  Layers2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked, Box, House } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CategoryScoresTemplates } from "@/templates/pageEditor/categoryScores";
import { HeroTemplates } from "@/templates/pageEditor/hero";
import { debounce } from "lodash";
import { FeaturesTemplates } from "@/templates/pageEditor/features";
import { CallToActionTemplates } from "@/templates/pageEditor/cta";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SectionTemplatesDialog from "./helpers/templatesDialog";
import ThemeDialog from "./helpers/themeDialog";
import ScoringDialog from "./helpers/scoringModal";
import JumpingDialog from "./helpers/jumpingModal";
import CreateCategory from "./helpers/categoryEditor";
import CreateQuestion from "./helpers/createQuestion";
import ScoreTiersEditor from "./helpers/scoreTiersModal";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { PageTheme } from "@/stores/pageEditorStore/types";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import PageSettingsModal from "./helpers/pageSettings";
import { SheetProvider } from "@/providers/sheet-provider";
import ScreeningTabElementsDialog from "./helpers/screeningTabElementsDialog";

export const tools = [
  { icon: <Plus className="h-4 w-4" />, label: "Add Element", action: "add" },
  {
    icon: <Palette className="h-4 w-4" />,
    label: "Page theme",
    action: "theme",
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
    action: "settings",
  },
];

const RightToolbar = () => {
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isAddScreeningTabElementsOpen, setIsAddScreeningTabElementsOpen] =
    useState(false);
  const {
    pageType,

    previewMode,
    addSection,
    theme,
    updateTheme,
    setPreviewMode,
  } = usePageBuilderStore();

  const debouncedUpdateTheme = useCallback(
    debounce((updates: Partial<PageTheme>) => {
      updateTheme(updates);
    }, 100),
    []
  );

  const handlePreviewClick = () => {
    setPreviewMode(true);
    //setIsPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewMode(false);
    //setIsPreviewOpen(false);
  };

  return (
    <>
      <div className="fixed z-20 right-2 top-1/2 -translate-y-1/2  rounded-md shadow-lg bg-white text-editor-foreground border border-editor-border">
        <div className=" p-1 flex flex-col gap-1">
          <TooltipProvider>
            {pageType === "Quiz_Page" ? (
              <>
                <Popover
                  open={isAddScreeningTabElementsOpen}
                  onOpenChange={setIsAddScreeningTabElementsOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 rounded-md p-0 hover:bg-gray-100 hover:text-editor-foreground"
                      onClick={() => setIsAddScreeningTabElementsOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogWrapper
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 rounded-md p-0 hover:bg-gray-100 hover:text-editor-foreground"
                        >
                          <CirclePercent className="h-4 w-4 " />
                        </Button>
                      }
                      title="Scoring"
                      description="Score questions"
                      className="max-w-[100vw] w-[80vw] min-h-[500px] max-h-[95vh] bg-white text-editor-foreground border-b border-editor-border shadow-md"
                    >
                      <ScoringDialog />
                    </DialogWrapper>
                  </TooltipTrigger>
                  <TooltipContent side="right">scoring</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogWrapper
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 rounded-md p-0 hover:bg-gray-100 hover:text-editor-foreground"
                        >
                          <Group className="h-4 w-4 " />
                        </Button>
                      }
                      //title="Score tiers"
                      //description="Score tiers for this quiz"
                      className="max-w-[60vw] w-fit min-h-[500px] max-h-[95vh] bg-white text-editor-foreground border-b border-editor-border shadow-md"
                    >
                      <ScoreTiersEditor />
                    </DialogWrapper>
                  </TooltipTrigger>
                  <TooltipContent side="right">Score tiers</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogWrapper
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 rounded-md p-0 hover:bg-gray-100 hover:text-editor-foreground"
                        >
                          <GitBranch className="h-4 w-4 " />
                        </Button>
                      }
                      title="Add jumping logic"
                      description="add jumping logic to questions"
                      className="bg-sidebar max-w-[100vw] w-[80vw] min-h-[600px] max-h-[95vh]"
                    >
                      <JumpingDialog />
                    </DialogWrapper>
                  </TooltipTrigger>
                  <TooltipContent side="right">jumping logic</TooltipContent>
                </Tooltip>
              </>
            ) : (
              <Popover
                open={isAddSectionOpen}
                onOpenChange={setIsAddSectionOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-md p-0 hover:bg-gray-100 hover:text-editor-foreground"
                    onClick={() => setIsAddSectionOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-96 absolute -top-[12rem] right-2 bg-white text-editor-foreground border-b border-editor-border shadow-md"
                  side="left"
                >
                  <SectionTemplatesDialog
                    onCancel={() => setIsAddSectionOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            )}

            <SheetProvider
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 rounded-md p-0 hover:bg-gray-100 hover:text-editor-foreground"
                  onClick={handlePreviewClick}
                >
                  <Palette className="h-4 w-4" />
                </Button>
              }
              customCloseButton={
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 z-50 rounded-md p-2 bg-transparent text-editor-foreground border-none hover:bg-transparent hover:text-editor-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              }
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  handlePreviewClose();
                }
              }}
              showDefaultClose={false}
              side="bottom"
              className="min-h-[40rem]  w-[100vw] max-w-none p-0 overflow-hidden bg-white text-editor-foreground border-b border-editor-border shadow-md"
            >
              <ThemeDialog />
            </SheetProvider>

            <DialogWrapper
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 rounded-md p-0 hover:bg-gray-100 hover:text-editor-foreground"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              }
              title="Page Settings"
              description="Configure page settings"
              className="max-w-[100vw] w-[80vw] min-h-[500px] max-h-[95vh] bg-white text-editor-foreground border-b border-editor-border shadow-md"
            >
              {/* Add page settings content here */}
              <PageSettingsModal />
            </DialogWrapper>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export default RightToolbar;
