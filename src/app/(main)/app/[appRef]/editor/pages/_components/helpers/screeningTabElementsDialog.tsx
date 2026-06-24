"use client";
import { Plus, LayoutGrid, Settings, Palette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked, Box, House } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCallback, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { debounce } from "lodash";

import { FeaturesTemplates } from "@/templates/pageEditor/features";
import { OverallScoreTemplates } from "@/templates/pageEditor/overallScore";
import { CategoryScoresTemplates } from "@/templates/pageEditor/categoryScores";
import { HeroTemplates } from "@/templates/pageEditor/hero";
import { CallToActionTemplates } from "@/templates/pageEditor/cta";
import { FaqTemplates } from "@/templates/pageEditor/faq";
import { TestimonialTemplates } from "@/templates/pageEditor/testimonials";
import { QuestionTemplates } from "@/templates/pageEditor/questions";
import { NavTemplates } from "@/templates/pageEditor/nav";
import { VideoTemplates } from "@/templates/pageEditor/video";
import { AdvertTemplates } from "@/templates/pageEditor/ads";

import { IndividualScoreTemplates } from "@/templates/pageEditor/individualScore";
import { ProductListingTemplates } from "@/templates/pageEditor/listings";
import { StatsSectionTemplates } from "@/templates/pageEditor/stats";
import { LogosSectionTemplates } from "@/templates/pageEditor/logos";
import { FooterTemplates } from "@/templates/pageEditor/footer";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  FieldType,
  InfoTabTypes,
  QuestionField,
  Quiztype,
  Quiztypes,
  scoring,
  SectionTemplates,
} from "@/stores/pageEditorStore/types";
import {
  cloneTemplateWithUniqueIds,
  updateTemplateWithQuizId,
} from "@/lib/utils";
import Image from "next/image";

interface AddSectionProps {
  atIndex?: boolean;
  index?: string;
  parentContainerId?: string;
  onCancel?: () => void;
  templateOptions?: string[];
}

const ScreeningTabElementsDialog = ({
  atIndex,
  index,
  parentContainerId,
  onCancel,
  templateOptions,
}: AddSectionProps) => {
  const {
    questions,
    categories,
    addQuestion,
    addSection,
    addSectionAtIndex,
    pageType,
  } = usePageBuilderStore();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleAddScreeningTabElement = useCallback(
    (type: FieldType) => {
      const quizLength = questions.length;
      const newId = v4();

      // 1. Create options first, as scoring depends on it
      const newQuestionOptions =
        type === "YES_NO"
          ? [
              {
                id: v4(),
                order: 0,
                label: "Yes",
                projectQuizFieldId: newId,
                showIcon: false,
                mediaType: null,
                mediaSrc: "",
              },
              {
                id: v4(),
                order: 1,
                label: "No",
                projectQuizFieldId: newId,
                showIcon: false,
                mediaType: null,
                mediaSrc: "",
              },
            ]
          : type === "MULTIPLE_CHOICE" || type === "IMAGE_BUTTON"
            ? [
                {
                  id: v4(),
                  order: 0,
                  label: "Option 1",
                  projectQuizFieldId: newId,
                  showIcon: false,
                  mediaType: null,
                  mediaSrc: "",
                },
                {
                  id: v4(),
                  order: 1,
                  label: "Option 2",
                  projectQuizFieldId: newId,
                  showIcon: false,
                  mediaType: null,
                  mediaSrc: "",
                },
              ]
            : [];

      // 2. Create scoring
      const hasOptions = type === "MULTIPLE_CHOICE" || type === "YES_NO";
      let defaultScoring: scoring[];

      if (hasOptions) {
        // FIX: Corrected .map syntax (implicit return)
        defaultScoring = newQuestionOptions.map((option) => ({
          id: v4(),
          field_Id: newId,
          category_id: "overall_score",
          option_id: option.id,
          category_title: "Overall",
          score: 0,
        }));
      } else {
        defaultScoring = [
          {
            id: v4(),
            field_Id: newId,
            category_id: "overall_score",
            option_id: "",
            category_title: "Overall",
            score: 0,
          },
        ];
      }

      // 3. Create settings
      const newSettings = {
        optionsLayout:
          type === "YES_NO" ||
          type === "MULTIPLE_CHOICE" ||
          type === "TEXT" ||
          type === "RANGE"
            ? "column"
            : "grid",
        ...(type === "TEXT" && {
          multiple_line_text_input: false,
        }),
        ...(type === "INFO_SCREEN" && {
          show_instruction: true,
        }),
      };

      // 4. Assemble the final field object
      const newFormField: QuestionField = {
        id: newId,
        order: quizLength + 1,
        title: "<h3>Click to edit Question</h3>",
        description: '<p style="">click to edit description</p>',
        type: type,
        context: "Quiz_Page",
        scoring: defaultScoring,
        logicBranch: [
          {
            id: v4(),
            statement: "Always",
            op: null,
            option_id: null,
            outcome_type: "field",
            outcome_id: null,
          },
        ],
        settings: newSettings as QuestionField["settings"],
        options: newQuestionOptions,
        formFieldType: type === "INFO_SCREEN" ? "INFO_ITEM" : "QUESTION_ITEM",
        displayPage: "Quiz_Page",
        attachment: "",
        validations: "",
      };

      // 5. Add to store and show feedback
      try {
        console.log("adding", newFormField);
        addQuestion(newFormField);
        // toast({
        //   title: "Success",
        //   description: "New question added successfully",
        // });
        // setOpen(false);
      } catch (error) {
        console.error("Error adding question:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to add new question",
        //   variant: "destructive",
        // });
      }
    },
    [questions.length, addQuestion] // Dependencies for useCallback
  );

  const elementsByCategory = [
    {
      id: "quiz",
      name: "Quiz",
      elements: Quiztypes,
    },
    {
      id: "info_tab",
      name: "Info Tab",
      elements: InfoTabTypes,
    },
  ];

  return (
    <div className="w-full  rounded-lg font-sans">
      <Tabs defaultValue="elements" className="w-full ">
        {/* Tab navigation list */}
        <TabsList className="grid w-fit grid-cols-3">
          {/* <TabsTrigger value="layouts">Layouts</TabsTrigger> */}
          <TabsTrigger value="elements">Elements</TabsTrigger>
          {/* <TabsTrigger value="components">Components</TabsTrigger> */}
        </TabsList>
        <ScrollArea className="h-96">
          {/* Content panel for the 'Layouts' tab */}
          <TabsContent
            value="elements"
            className="mt-2 rounded-none border-y bg-white p-0"
          >
            <Accordion type="single" collapsible className="w-full">
              {elementsByCategory.map((elementType, index) => (
                <AccordionItem
                  key={elementType.id}
                  value={`item-${index + 1}`}
                  // The default AccordionItem includes a bottom border.
                  // We remove it from the last item for a clean finish.
                  className={
                    index === elementsByCategory.length - 1 ? "border-b-0" : ""
                  }
                >
                  {/* The trigger for each accordion item */}
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                    {elementType.name}
                  </AccordionTrigger>
                  {/* Placeholder content that appears when an item is expanded */}
                  <AccordionContent className="px-4 grid grid-cols-2 gap-2">
                    {elementType.elements.map((element: Quiztype) => (
                      <div key={element.type} className="group relative">
                        <button
                          onClick={() =>
                            handleAddScreeningTabElement(element.type)
                          }
                          className="w-full text-left"
                        >
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            {element.preview && (
                              <Image
                                src={element.preview}
                                alt={element.name}
                                height={600}
                                width={600}
                                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                              />
                            )}
                          </div>
                          <h3 className="mt-2 text-xs ">{element.name}</h3>
                        </button>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Placeholder content for other tabs */}
          <TabsContent value="layouts">
            <div className="mt-2 flex items-center justify-center rounded-md border bg-white p-4">
              <p className="text-sm text-slate-500">
                Elements will be displayed here.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="components">
            <div className="mt-2 flex items-center justify-center rounded-md border bg-white p-4">
              <p className="text-sm text-slate-500">
                Components will be displayed here.
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Failed</AlertDialogTitle>
            <AlertDialogDescription>
              This section only works when you’re using categories. You can add
              some categories here first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScreeningTabElementsDialog;
