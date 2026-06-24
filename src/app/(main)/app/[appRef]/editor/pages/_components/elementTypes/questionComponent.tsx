"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { v4 } from "uuid";

import {
  Cog,
  Copy,
  Ellipsis,
  Eye,
  MoreHorizontal,
  Palette,
  Pencil,
  PlusIcon,
  Settings2,
  Trash,
} from "lucide-react";

import TextStylist from "./elementUtils/textStylist";
import {
  MultipleChoiceComponent,
  SingleChoiceComponent,
  TextAnsTypeComponent,
  DateComponent,
  DropdownComponent,
  NumericComponent,
  SliderComponent,
  ImageButtonComponent,
} from "../answerTypes";
import { DialogProvider } from "@/providers/dialog-provider";
import CreateQuestion from "../helpers/createQuestion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageChoiceComponent from "../answerTypes/imageChoiceComponent";
import QuestionSectionStylist from "./elementUtils/questionSectionStylist";
import Image from "next/image";
import { cva } from "class-variance-authority";
import LeadFormComponent from "./formComponent";
import QuizProgressBarHeader from "./quizProgressBar";
import MediaPicker from "../helpers/mediaEditor";
import QuizPageLeadFormComponent from "../answerTypes/quizPageLeadForm";
import ReactPlayer from "react-player";
import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import QuestionOptionsStylist from "./elementUtils/questionOptionsStylist";

type Props = { section: ElementNode };

const questionComponentVariants = cva("", {
  variants: {
    variant: {
      default: "", // Base variants have no styles
      title: "",
      description: "",
    },
    size: {
      sm: "",
      lg: "",
    },
  },
  // Use compoundVariants for styles that depend on a combination
  compoundVariants: [
    // Title variants
    {
      variant: "title",
      size: "lg",
      className: "text-3xl sm:text-4xl",
    },
    {
      variant: "title",
      size: "sm",
      className: "text-2xl sm:text-3xl",
    },
    // Description variants
    {
      variant: "description",
      size: "lg",
      className: "text-lg/8",
    },
    {
      variant: "description",
      size: "sm",
      className: "text-lg/6",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "lg",
  },
});

const QuestionComponent = ({ section }: Props) => {
  const {
    pageType,
    livemode,
    questions,
    categories,
    scoretiers,
    activeElementId, // <--- Get activeElementI
    selectedQuestion,
    setSelectedSectionId,
    setActiveElementId,
    setSelectedQuestion,
    setEditingElementId,
    previewMode,
  } = usePageBuilderStore();

  const { id, content, settings, styles, className } = section;
  const questionElementSection = Array.isArray(section.content)
    ? section.content.filter((el) => el.type === "questions")[0]
    : null;

  //const [isHovered, setIsHovered] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [hoveredItemId, setHoveredItemId] = useState<number | string | null>(
    null
  );

  const questionsMap = useMemo(() => {
    const map = new Map<string, QuestionField>();
    questions.forEach((question) => {
      map.set(question.id, question);
    });
    return map;
  }, [questions]);

  useEffect(() => {
    if (selectedQuestion === null) {
      const filtered_questions = questions.filter(
        (q) => q.context === "Quiz_Page"
      );
      if (!filtered_questions.length) return;
      setSelectedQuestion(filtered_questions[0] as QuestionField);
    }
  }, [settings, content, questionsMap, setSelectedQuestion]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!livemode && !previewMode) {
      setSelectedSectionId(id);
      setActiveElementId(null);
      setEditingElementId(null);
    }
  };

  const handleMouseEnter = (itemId: string) => {
    if (!livemode && !previewMode) {
      setHoveredItemId(itemId);
    }
  };
  const handleMouseLeave = () => {
    if (!livemode && !previewMode) {
      setHoveredItemId(null);
    }
  };

  const isSelected = !livemode && !previewMode && activeElementId === id;
  const showEditorUI =
    !livemode && !previewMode && (hoveredItemId === id || isSelected);

  //let optionsContainerId =

  return (
    <div
      ref={componentRef}
      className={cn(
        "relative mx-auto w-full cursor-pointer min-h-[400px]",
        // "outline outline-1",
        "focus:outline-none",
        !livemode && !previewMode && "p-1",
        !livemode &&
          !previewMode &&
          hoveredItemId === id &&
          activeElementId !== id &&
          "outline-dashed outline-1 outline-indigo-600 rounded-sm",
        !livemode &&
          !previewMode &&
          activeElementId === id &&
          " outline-2 outline-indigo-600 rounded-sm "
      )}
      onMouseEnter={() => handleMouseEnter(id)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {selectedQuestion && showEditorUI && (
        <div
          className={cn(
            "absolute z-50 right-2 top-3 left-2 -translate-y-1/3 tr transition-opacity",
            showEditorUI ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex flex-row flex-nowrap justify-between text-black">
            <div className="flex flex-row flex-nowrap space-x-1.5 bg-card shadow-md rounded-md">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-muted">
                    <Settings2 className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className=" absolute -left-4 p-4  bg-card text-card-foreground rounded-lg shadow-lg w-[320px]">
                  <QuestionSectionStylist
                    question={selectedQuestion as QuestionField}
                    section={section}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto h-full max-w-7xl px-6 lg:px-8">
        {/* {section?.settings?.showQuizProgressBar && (
          <div className="relative w-full mb-4">
            <QuizProgressBarHeader
              currentStep={4}
              totalSteps={10}
              title="Embrace your potential"
              
            />
          </div>
        )} */}

        {selectedQuestion !== null ? (
          <>
            <RenderQuestion element={questionElementSection as ElementNode} />
          </>
        ) : (
          <div className="">
            <DialogWrapper
              trigger={
                <div>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          // size="icon"
                          className="mx-auto my-4 flex size-16 cursor-pointer items-center justify-center rounded-full border bg-white text-gray-400 shadow-md outline-none transition-all hover:scale-110 hover:border-indigo-500 hover:text-indigo-500"
                          aria-label="Open edit menu"
                        >
                          <PlusIcon size={16} aria-hidden="true" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs">
                        Add Question
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              }
              title="Add New Question"
              description="Create a new question"
              className="bg-sidebar "
            >
              <CreateQuestion />
            </DialogWrapper>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionComponent;

// --- New React components (moved from plain functions to components so hooks are used correctly)

const RenderQuestion: React.FC<{ element: ElementNode | null }> = ({
  element,
}) => {
  if (!element) return null;

  const {
    pageType,
    livemode,
    projectData,
    editingElementId,
    selectedQuestion,
    setEditingElementId,
    setActiveElementId,
    setSelectedQuestion,
    updateQuestion,
    previewMode,
  } = usePageBuilderStore();
  const { id, content, settings, styles, className } = element;

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [hoveredItemId, setHoveredItemId] = useState<number | string | null>(
    null
  );
  const [hoveredEditableId, setHoveredEditableId] = useState<string | null>(
    null
  );
  const currentSize = pageType === "Quiz_Page" ? "lg" : "sm";

  //if (!selectedQuestion) return null;

  const handleBlur = (
    field: "title" | "description",
    value: string,
    maxLength: number
  ) => {
    if (!selectedQuestion) return;

    const trimmedValue = value.trim();
    if (trimmedValue.length > maxLength) return;

    updateQuestion(selectedQuestion.id, { [field]: trimmedValue });
  };

  const updateQuestionSettingsProperty = (field: string, value: string) => {
    if (!selectedQuestion) return;
    const updatedSettings = {
      ...selectedQuestion.settings,
      [field]: value,
    };

    console.log(updatedSettings);

    updateQuestion(selectedQuestion.id, { ["settings"]: updatedSettings });
  };

  return (
    <div
      className={cn(
        "relative h-full flex flex-col items-center  gap-[20px]  lg:gap-[72px]",
        selectedQuestion?.settings?.show_media &&
          "flex-row flex-nowrap justify-center"
      )}
    >
      <div className="w-full block  ">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div
            className={cn(
              "mt-2  rounded-md focus:outline-none",
              !livemode && "cursor-text p-1",
              !livemode &&
                hoveredEditableId === `title-${selectedQuestion?.id}` &&
                editingElementId !== `title-${selectedQuestion?.id}` &&
                "outline-dashed outline-2 outline-offset-2 outline-gray-400 ",
              !livemode &&
                editingElementId === `title-${selectedQuestion?.id}` &&
                " outline-2 outline-offset-2 outline-indigo-700 rounded-sm"
            )}
            onClick={(e) => {
              if (!livemode) {
                e.stopPropagation();
                setEditingElementId(`title-${selectedQuestion?.id}`);
                setActiveElementId(`title-${selectedQuestion?.id}`);
              }
            }}
            onMouseEnter={(e) => {
              if (!livemode) {
                e.stopPropagation();
                setHoveredEditableId(`title-${selectedQuestion?.id}`);
              }
            }}
            onMouseLeave={(e) => {
              if (!livemode) {
                e.stopPropagation();
                setHoveredEditableId(null);
              }
            }}
          >
            <EditableElement
              key={selectedQuestion?.id as string}
              elementId={`title-${selectedQuestion?.id}`}
              value={selectedQuestion?.title as string}
              fieldType="title"
              style={styles}
              className={cn(
                questionComponentVariants({
                  variant: "title",
                  size: currentSize,
                }),
                " font-semibold tracking-tight text-pretty   lg:text-balance   rounded-md"
              )}
              onHtmlUpdate={(val) => {
                if (!livemode) {
                  handleBlur("title", val || "", 400);
                  setHtmlContent(val || "");
                }
              }}
              htmlContent={selectedQuestion?.title as string}
            />
          </div>
          {selectedQuestion?.settings?.show_instruction && (
            <div
              className={cn(
                "mt-6  rounded-md focus:outline-none",
                !livemode && "cursor-text p-1",
                !livemode &&
                  hoveredEditableId === `description-${selectedQuestion?.id}` &&
                  editingElementId !== `description-${selectedQuestion?.id}` &&
                  "outline-dashed outline-2 outline-offset-2 outline-gray-400 rounded-sm",
                !livemode &&
                  editingElementId === `description-${selectedQuestion?.id}` &&
                  " outline-2 outline-offset-2 outline-indigo-700 rounded-sm"
              )}
              onClick={(e) => {
                if (!livemode) {
                  e.stopPropagation();
                  setEditingElementId(`description-${selectedQuestion?.id}`);
                  setActiveElementId(`description-${selectedQuestion?.id}`);
                }
              }}
              onMouseEnter={(e) => {
                if (!livemode) {
                  e.stopPropagation();
                  setHoveredEditableId(`description-${selectedQuestion?.id}`);
                }
              }}
              onMouseLeave={(e) => {
                if (!livemode) {
                  e.stopPropagation();
                  setHoveredEditableId(null);
                }
              }}
            >
              <EditableElement
                key={selectedQuestion?.id as string}
                elementId={`description-${selectedQuestion?.id}`}
                value={selectedQuestion?.description as string}
                fieldType="description"
                style={styles}
                className={cn(
                  questionComponentVariants({
                    variant: "description",
                    size: currentSize,
                  }),
                  " "
                )}
                onHtmlUpdate={(val) => {
                  if (!livemode) {
                    handleBlur("description", val || "", 800);
                    //setHtmlContent(val || "");
                  }
                }}
                htmlContent={selectedQuestion?.description as string}
              />
            </div>
          )}
        </div>
        <RenderAnswerType element={element as ElementNode} />
      </div>
      {selectedQuestion?.settings?.show_media && (
        <>
          {selectedQuestion?.settings?.media_type === "image" && (
            <>
              {!livemode && !previewMode && (
                <div className="w-full block items-center justify-center">
                  <MediaPicker
                    workspaceId={projectData?.workspace.id as string}
                    mediaType={selectedQuestion?.settings?.media_type}
                    mediaSource={"upload"}
                    mediaSrc={selectedQuestion?.settings?.media_url as string}
                    mediaOptions={"image_only"}
                    onMediaChange={(newSrc) =>
                      updateQuestionSettingsProperty("media_url", newSrc)
                    }
                    editorTrigger={
                      <div className="group/questionMedia relative">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/questionMedia:opacity-100 rounded-md z-[100]">
                          <Pencil className="h-4 w-4 text-white" />
                        </div>
                        <Image
                          src={
                            selectedQuestion?.settings?.media_url ||
                            "/assets/imageplaceholder.svg"
                          }
                          alt="image"
                          className=" aspect-square rounded-sm object-cover"
                          width={800}
                          height={800}
                        />
                      </div>
                    }
                  />
                </div>
              )}
              {previewMode && (
                <div className="w-full block items-center justify-center">
                  <Image
                    src={
                      selectedQuestion?.settings?.media_url ||
                      "/assets/imageplaceholder.svg"
                    }
                    alt="image"
                    className=" aspect-square rounded-sm object-cover"
                    width={800}
                    height={800}
                  />
                </div>
              )}
            </>
          )}
          {selectedQuestion?.settings?.media_type === "video" && (
            <>
              {!livemode && !previewMode && (
                <div className="w-full block items-center justify-center">
                  <MediaPicker
                    workspaceId={projectData?.workspace.id as string}
                    mediaType={selectedQuestion?.settings?.media_type}
                    mediaSource={"url"}
                    mediaSrc={selectedQuestion?.settings?.media_url as string}
                    mediaOptions={"video_only"}
                    onMediaChange={(newSrc) =>
                      updateQuestionSettingsProperty("media_url", newSrc)
                    }
                    editorTrigger={
                      <div className="group/questionMedia relative">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/questionMedia:opacity-100 rounded-md z-[100]">
                          <Pencil className="h-4 w-4 text-white" />
                        </div>
                        <div className={cn("aspect-video w-full")}>
                          <ReactPlayer
                            url={selectedQuestion?.settings?.media_url}
                            width="100%"
                            height="100%"
                            controls={true}
                            light={selectedQuestion?.settings?.media_url} // Optional thumbnail
                            playing={false} // Don't autoplay by default
                            config={{
                              youtube: {
                                playerVars: { showinfo: 1 },
                              },
                              vimeo: {
                                playerOptions: { title: true },
                              },
                            }}
                          />
                        </div>
                      </div>
                    }
                  />
                </div>
              )}
              {previewMode && (
                <div className="w-full block items-center justify-center">
                  <div className={cn("aspect-video w-full")}>
                    <ReactPlayer
                      url={selectedQuestion?.settings?.media_url}
                      width="100%"
                      height="100%"
                      controls={true}
                      light={selectedQuestion?.settings?.media_url} // Optional thumbnail
                      playing={false} // Don't autoplay by default
                      config={{
                        youtube: {
                          playerVars: { showinfo: 1 },
                        },
                        vimeo: {
                          playerOptions: { title: true },
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const RenderAnswerType: React.FC<{ element: ElementNode | null }> = ({
  element,
}) => {
  if (!element) return null;

  const {
    pageType,
    livemode,
    projectData,
    sections,
    questions,
    scoretiers,
    activeElementId, // <--- Get activeElementId
    editingElementId,
    selectedQuestion,
    setEditingElementId,
    setActiveElementId,
    setSelectedQuestion,
    updateQuestion,
    previewMode,
  } = usePageBuilderStore();
  const [hoveredEditableId, setHoveredEditableId] = useState<string | null>(
    null
  );
  const [optionsContainerSelectedId, setOptionsContainerSelectedId] = useState<
    number | string | null
  >(null);
  const [optionsContainerHoveredId, setOptionsContainerHoveredId] = useState<
    number | string | null
  >(null);

  const answersElementSection =
    element && Array.isArray(element.content)
      ? element.content.find((el) => el.type === "question_options")
      : undefined;

  const handleOptionsContainerMouseEnter = (id: string) => {
    if (!livemode && !previewMode && answersElementSection) {
      setOptionsContainerHoveredId(answersElementSection.id);
    }
  };

  const handleOptionsContainerMouseLeave = () => {
    if (!livemode && !previewMode) {
      setOptionsContainerHoveredId(null);
    }
  };

  if (!selectedQuestion || !answersElementSection) {
    return null;
  }

  const handleOptionsContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!livemode && !previewMode) {
      setActiveElementId(answersElementSection.id);
    }
  };

  const isOptionsBoxSelected =
    !livemode && !previewMode && activeElementId === answersElementSection.id;

  const showOptionsBoxEditorUI =
    !livemode &&
    !previewMode &&
    (optionsContainerHoveredId === answersElementSection.id ||
      isOptionsBoxSelected);

  const handleOptionLabelBlur = (optionId: string, newLabel: string) => {
    if (!selectedQuestion) return;

    const trimmedLabel = newLabel.trim();
    if (!trimmedLabel) return; // Don't allow empty labels

    const updatedOptions =
      selectedQuestion.options &&
      selectedQuestion.options.map((opt) =>
        opt.id === optionId ? { ...opt, label: trimmedLabel } : opt
      );

    updateQuestion(selectedQuestion.id, {
      options: updatedOptions,
    });
  };

  const handleOptionMediaUpdate = (
    optionId: string,
    mediaType: string,
    mediaSrc: string
  ) => {
    if (!selectedQuestion) return;
    //if (!mediaSrc || !mediaType) return; // Don't allow empty labels

    const updatedOptions =
      selectedQuestion.options &&
      selectedQuestion.options.map((opt) =>
        opt.id === optionId
          ? {
              ...opt,
              media: mediaType as "image" | undefined,
              mediaSrc: mediaSrc,
            }
          : opt
      );

    updateQuestion(selectedQuestion.id, {
      options: updatedOptions,
    });
  };

  const handleAddOption = () => {
    if (!selectedQuestion) return;

    const newOption = {
      id: v4(),
      order: selectedQuestion.options
        ? selectedQuestion.options.length + 1
        : 0 + 1,
      label: `Option ${selectedQuestion.options ? selectedQuestion.options.length + 1 : 0 + 1}`,
      fieldId: selectedQuestion.id,
    };

    updateQuestion(selectedQuestion.id, {
      options: selectedQuestion?.options
        ? ([...selectedQuestion?.options, newOption] as options[])
        : [newOption],
    });
  };

  const handleDeleteOption = (optionId: string) => {
    if (!selectedQuestion) return;

    const updatedOptions = selectedQuestion?.options?.filter(
      (opt) => opt.id !== optionId
    );

    updateQuestion(selectedQuestion.id, {
      options: updatedOptions,
    });
  };

  const commonProps = {
    element: answersElementSection,
    question: selectedQuestion,
    livemode: livemode,
    previewMode: previewMode,
    onOptionLabelBlur: handleOptionLabelBlur,
    onMediaChange: handleOptionMediaUpdate,
    onAddOption: handleAddOption,
    onDeleteOption: handleDeleteOption,
  };

  const getAnswerType = () => {
    switch (selectedQuestion.type) {
      case "MULTIPLE_CHOICE":
      case "YES_NO":
        return selectedQuestion.settings?.allow_multiple_selection ? (
          <MultipleChoiceComponent {...commonProps} />
        ) : (
          <SingleChoiceComponent {...commonProps} />
        );
      case "IMAGE_BUTTON":
        return (
          <ImageChoiceComponent
            {...commonProps}
            workspaceId={projectData?.workspace.id as string}
          />
        );
      case "TEXT":
        return <TextAnsTypeComponent question={selectedQuestion} />;
      case "RANGE": // Assuming RANGE might cover SLIDER
        return <SliderComponent question={selectedQuestion} />;
      case "CONTACT_FORM": // Assuming RANGE might cover SLIDER
        return <QuizPageLeadFormComponent section={element} />;
      default:
        // Also assuming you might have other field types to handle
        // For now, returning unsupported for unhandled cases.
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div
      className={cn(
        "relative max-w-2xl mx-auto mt-16 p-2 flex justify-center items-center",
        // "outline outline-1",
        "focus:outline-none",
        !livemode && !previewMode && "cursor-pointer  p-2",
        !livemode &&
          !previewMode &&
          showOptionsBoxEditorUI &&
          "outline-dashed outline-1 outline-indigo-600 rounded-sm",
        !livemode &&
          !previewMode &&
          isOptionsBoxSelected &&
          " outline-1 outline-indigo-600 rounded-sm "
      )}
      onMouseEnter={() =>
        handleOptionsContainerMouseEnter(answersElementSection?.id as string)
      }
      onMouseLeave={handleOptionsContainerMouseLeave}
      onClick={handleOptionsContainerClick}
    >
      {showOptionsBoxEditorUI && (
        <Badge
          className={cn(
            "absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent"
          )}
          // Prevent badge click from deselecting the container
          //onClick={(e) => e.stopPropagation()}
          onClick={handleOptionsContainerClick}
        >
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                aria-label="Edit Item"
                //onClick={(e) => handleOptionsContainerClick(e)}
                //onClick={handleOptionsContainerClick}
              >
                <Cog className="w-3 h-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-transparent p-0 z-[50]  absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none ">
              <QuestionOptionsStylist
                element={answersElementSection as ElementNode}
              />
            </PopoverContent>
          </Popover>
        </Badge>
      )}
      {getAnswerType()}
    </div>
  );
};
