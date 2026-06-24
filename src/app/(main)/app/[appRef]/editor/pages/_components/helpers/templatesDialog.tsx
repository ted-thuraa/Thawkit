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
  QuestionField,
  SectionTemplates,
} from "@/stores/pageEditorStore/types";
import {
  cloneTemplateWithUniqueIds,
  updateTemplateWithQuizId,
} from "@/lib/utils";
import { ProductsCatalogueTemplates } from "@/templates/pageEditor/productCatalogue";

interface AddSectionProps {
  atIndex?: boolean;
  index?: string;
  parentContainerId?: string;
  onCancel?: () => void;
  templateOptions?: string[];
}

const SectionTemplatesDialog = ({
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

  const handleAddSection = (template: SectionTemplates) => {
    let templateToAdd = cloneTemplateWithUniqueIds(template.templateContent);

    const isScoreTemplate =
      template.type === "categoryScore" ||
      template.type === "overallScore" ||
      template.type === "individualScore";

    // If it's a score template, check for existing categories
    if (isScoreTemplate && categories.length === 0) {
      setIsAlertOpen(true); // Open the alert dialog
      return; // Stop further execution
    }

    if (template.properties && template.properties.hasQuiz === true) {
      const quizLength = questions.length;
      const newQuizId = v4();
      const qType = template.properties.quizType as FieldType;
      //create question and update template.templateContent
      const newFormField: QuestionField = {
        id: newQuizId,
        order: quizLength + 1,
        title: "<p>Click to edit Question</p>",
        description:
          '<p style="text-align: center">click to edit description</p>',
        type: qType,
        context: "Landing_Page",
        formFieldType: "QUESTION_ITEM",
        displayPage: "Landing_Page",
        attachment: "",
        validations: "",
        scoring: [],
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

        settings: {
          optionsLayout:
            qType === "YES_NO" ||
            qType === "MULTIPLE_CHOICE" ||
            qType === "TEXT" ||
            qType === "RANGE"
              ? "column"
              : "grid",
          ...(qType === "TEXT" && {
            line_type: "Single line",
          }),
        },

        options:
          qType === "YES_NO"
            ? [
                {
                  id: v4(),
                  order: 0,
                  label: "Yes",
                  projectQuizFieldId: newQuizId,
                  showIcon: false,
                  mediaType: null,
                  mediaSrc: "",
                },
                {
                  id: v4(),
                  order: 1,
                  label: "No",
                  projectQuizFieldId: newQuizId,
                  showIcon: false,
                  mediaType: null,
                  mediaSrc: "",
                },
              ]
            : qType === "MULTIPLE_CHOICE" || qType === "IMAGE_BUTTON"
              ? [
                  {
                    id: v4(),
                    order: 0,
                    label: "Option 1",
                    projectQuizFieldId: newQuizId,
                    showIcon: false,
                    mediaType: null,
                    mediaSrc: "",
                  },
                  {
                    id: v4(),
                    order: 1,
                    label: "Option 2",
                    projectQuizFieldId: newQuizId,
                    showIcon: false,
                    mediaType: null,
                    mediaSrc: "",
                  },
                ]
              : [],
      };

      addQuestion(newFormField);

      templateToAdd = updateTemplateWithQuizId(templateToAdd, newQuizId);
      console.log("template to add with quiz id", newQuizId);
      console.log("template to add with quiz id", templateToAdd);
    }

    if (atIndex === true) {
      // console.log("adding");
      // console.log("template to add", template);
      // console.log("after index", index);
      addSectionAtIndex(
        templateToAdd,
        index as string,
        parentContainerId as string
      );
    } else {
      console.log(templateToAdd);
      addSection(templateToAdd);
    }
    // Close the popover after adding a section
    if (onCancel) {
      onCancel();
    }
  };

  const templatesByCategory = {
    overall: {
      name: "Overall Score",
      templates: OverallScoreTemplates,
    },
    individual_scores: {
      name: "Individual Scores",
      templates: IndividualScoreTemplates,
    },
    category_scores: {
      name: "Category Scores",
      templates: CategoryScoresTemplates,
    },
    nav: {
      name: "Navigation",
      templates: NavTemplates,
    },
    hero: {
      name: "Banner",
      templates: HeroTemplates,
    },
    features: {
      name: "Features",
      templates: FeaturesTemplates,
    },
    stats: {
      name: "Stats",
      templates: StatsSectionTemplates,
    },
    video: {
      name: "Video",
      templates: VideoTemplates,
    },
    cta: {
      name: "Call To Action",
      templates: CallToActionTemplates,
    },
    faq: {
      name: "FAQ",
      templates: FaqTemplates,
    },
    testimonials: {
      name: "Testimonials",
      templates: TestimonialTemplates,
    },
    logos: {
      name: "Logos",
      templates: LogosSectionTemplates,
    },
    quiz: {
      name: "Quiz",
      templates: QuestionTemplates,
    },
    productCatalogue: {
      name: "Product Catalogue",
      templates: ProductsCatalogueTemplates,
    },
    advert: {
      name: "Ad banner",
      templates: AdvertTemplates,
    },
    footer: {
      name: "Footer",
      templates: FooterTemplates,
    },
  };

  // Filter categories based on pageType
  let filteredCategories: [string, any][] = Object.entries(templatesByCategory);
  if (templateOptions && templateOptions.length > 0) {
    filteredCategories = filteredCategories.filter(([key]) =>
      templateOptions.includes(key)
    );
  } else if (pageType === "Landing_Page") {
    filteredCategories = filteredCategories.filter(([key]) =>
      [
        "nav",
        "hero",
        "features",
        "cta",
        "video",
        "faq",
        "testimonials",
        "logos",
        "stats",
        "footer",
      ].includes(key)
    );
  } else if (pageType === "Quiz_Page") {
    filteredCategories = filteredCategories.filter(([key]) =>
      ["nav", "quiz", "footer"].includes(key)
    );
  } else if (pageType === "Result_Page") {
    filteredCategories = filteredCategories.filter(([key]) =>
      [
        "overall",
        "individual_scores",
        "category_scores",
        "nav",
        "hero",
        "features",
        "productCatalogue",
        "cta",
        "video",
        "faq",
        "testimonials",
        "footer",
      ].includes(key)
    );
  }

  return (
    <div className="w-full  rounded-lg font-sans">
      <Tabs defaultValue="layouts" className="w-full ">
        {/* Tab navigation list */}
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="elements">Elements</TabsTrigger>
          {/* <TabsTrigger value="components">Components</TabsTrigger> */}
        </TabsList>
        <ScrollArea className="h-96">
          {/* Content panel for the 'Layouts' tab */}
          <TabsContent
            value="layouts"
            className="mt-2 rounded-none border-y bg-white p-0"
          >
            <Accordion type="single" collapsible className="w-full">
              {filteredCategories.map(([categoryKey, categoryData], index) => (
                <AccordionItem
                  key={categoryKey}
                  value={`item-${index + 1}`}
                  // The default AccordionItem includes a bottom border.
                  // We remove it from the last item for a clean finish.
                  className={
                    index === filteredCategories.length - 1 ? "border-b-0" : ""
                  }
                >
                  {/* The trigger for each accordion item */}
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                    {categoryData.name}
                  </AccordionTrigger>
                  {/* Placeholder content that appears when an item is expanded */}
                  <AccordionContent className="px-4 grid grid-cols-2 gap-2">
                    {categoryData.templates.map(
                      (template: SectionTemplates) => (
                        <div key={template.id} className="group relative">
                          <button
                            onClick={() => handleAddSection(template)}
                            className="w-full text-left"
                          >
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              {template.preview && (
                                <img
                                  src={template.preview}
                                  alt={template.name}
                                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                />
                              )}
                            </div>
                            <h3 className="mt-2 text-xs ">{template.name}</h3>
                          </button>
                        </div>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Placeholder content for other tabs */}
          <TabsContent value="elements">
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

      {/* <ScrollArea className="h-96">

        <div className="flex flex-col gap-y-6 p-1">
          {filteredCategories.map(([categoryKey, categoryData]) => (
            <div key={categoryKey}>
              <h4 className="text-md mb-2 font-semibold tracking-tight">
                {categoryData.name}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {categoryData.templates.map((template: SectionTemplates) => (
                  <div key={template.id} className="group relative">
                    <button
                      onClick={() => handleAddSection(template)}
                      className="w-full text-left"
                    >
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        {template.preview && (
                          <img
                            src={template.preview}
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                          />
                        )}
                      </div>
                      <h3 className="mt-2 text-xs ">{template.name}</h3>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea> */}
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

export default SectionTemplatesDialog;
