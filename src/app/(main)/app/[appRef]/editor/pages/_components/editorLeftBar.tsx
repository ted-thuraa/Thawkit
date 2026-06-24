"use client";
import {
  Plus,
  LayoutGrid,
  Settings,
  Palette,
  Grip,
  Eye,
  Trash,
  GripVertical,
  EyeClosed,
  EyeOff,
  List,
  X,
  Layers,
  FileQuestion,
  ListOrdered,
  Layers2,
  LayoutList,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useCallback, useState } from "react";
import { v4 } from "uuid";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import QuestionsList from "./helpers/questionsList";
import CategoryList from "./helpers/categoriesList";
import SectionsTree from "./helpers/sectionsTree";
import { FaColumns, FaThLarge } from "react-icons/fa";
import { DialogProvider } from "@/providers/dialog-provider";
import CreateCategory from "./helpers/categoryEditor";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import DialogWrapper from "@/wrappers/dialog-wrapper";

const LeftToolbar = () => {
  const [showSections, setShowSections] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const {
    livemode,
    sections,
    pageType,
    reorderSections,
    removeSection,
    toggleSectionVisibility,
    theme,
    updateTheme,
  } = usePageBuilderStore();

  // const handleToolClick = (action: string) => {
  //   if (action === "add") {
  //     setIsDialogOpen(true);
  //   }
  //   if (action === "theme") {
  //     setIsThemeDialogOpen(true);
  //   }
  //   // Handle other actions as needed
  // };

  const handleRemoveSection = (id: string) => {
    removeSection(id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);

    const reorderedSections = arrayMove(sections, oldIndex, newIndex);
    reorderSections(reorderedSections);
  };

  const defaultLayersTab = pageType === "Quiz_Page" ? "questions" : "sections";

  return (
    <>
      <div className="w-auto h-auto absolute z-20 left-[0.2rem] top-1/2 -translate-y-1/2 bg-white text-editor-foreground rounded-lg shadow-lg border border-editor-border">
        {!showSections && (
          <div className=" p-1 flex flex-col gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild className="px-2 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-lg p-0 hover:bg-editor-background hover:text-editor-foreground"
                    onClick={() => setShowSections(true)}
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-editor-background">
                  Sections
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        {showSections && (
          <div className="w-60 h-[30rem]">
            <div className="p-1.5 pb-32 space-y-1 w-full h-full">
              <Tabs defaultValue={defaultLayersTab} className="w-full h-full">
                <div className="flex w-full">
                  <TabsList className="bg-editor-background flex  flex-row items-center rounded-lg px-1">
                    {pageType === "Quiz_Page" ? (
                      <>
                        <TabsTrigger
                          value="questions"
                          className="rounded-sm p-1 hover:bg-editor-background hover:text-editor-foreground data-[state=active]:bg-white data-[state=active]:text-editor-foreground"
                        >
                          <ListOrdered className="h-4 w-4" />
                          {/* Question */}
                        </TabsTrigger>
                        <TabsTrigger
                          value="categories"
                          className="rounded-sm p-1 hover:bg-editor-background hover:text-editor-foreground data-[state=active]:bg-white data-[state=active]:text-editor-foreground"
                        >
                          {/* Category */}
                          <LayoutList className="h-4 w-4" />
                        </TabsTrigger>
                      </>
                    ) : (
                      <TabsTrigger
                        value="sections"
                        className="rounded-sm p-1 hover:bg-editor-background hover:text-editor-foreground data-[state=active]:bg-white data-[state=active]:text-editor-foreground"
                      >
                        {/* Sections */}
                        <Layers2 className="h-4 w-4" />
                      </TabsTrigger>
                    )}
                  </TabsList>
                  <div
                    style={{ marginInlineStart: "auto" }}
                    className="flex items-center justify-end ml-2"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-fit rounded-lg hover:bg-transparent hover:text-editor-foreground"
                      onClick={() => setShowSections(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <TabsContent value="questions">
                  <div className="p-1 h-full ">
                    <QuestionsList />
                  </div>
                </TabsContent>
                <TabsContent value="categories" className="">
                  <div className="p-1 bg-editor-background max-h-[14rem] overflow-y-auto">
                    <CategoryList />
                  </div>
                  <DialogWrapper
                    trigger={
                      <Button className="mt-1 p-1 bg-transparent hover:bg-transparent text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        <Plus className="h-2 w-2" />
                        Add Category
                      </Button>
                    }
                    title="Create Category"
                    description="add a new category"
                    className="bg-sidebar"
                  >
                    <CreateCategory />
                  </DialogWrapper>
                </TabsContent>
                <TabsContent
                  value="sections"
                  className="p-1 bg-editor-background max-h-[14rem] overflow-y-auto"
                >
                  <div className="p-1 bg-editor-background max-h-[14rem] overflow-y-auto">
                    <SectionsTree />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeftToolbar;
