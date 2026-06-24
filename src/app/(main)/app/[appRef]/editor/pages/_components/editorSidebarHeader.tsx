"use client";
import react, { useCallback, useState } from "react";
import {
  ArrowLeft,
  ChevronsUpDown,
  ExternalLink,
  Eye,
  EyeIcon,
  Loader2Icon,
  Save,
  SidebarIcon,
  X,
} from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BiLinkExternal } from "react-icons/bi";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { NavUser } from "@/app/(main)/workspace/_components/nav-user";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { useRouter } from "next/navigation";
import { DeviceType, ProjectData } from "@/stores/pageEditorStore/types";
import { updateProjectStatus, upsertPageData } from "@/actions/project/project";
import {
  FinalFunnelPage,
  FormField,
  FunnelPageModel,
  PageStatusEnum,
} from "@/lib/types/project";
import { toast } from "sonner";
import { SheetProvider } from "@/providers/sheet-provider";
import PreviewPageComponent from "./previewComponent";
import Link from "next/link";
import React from "react";
import { CiMobile2 } from "react-icons/ci";
import { HiMiniDeviceTablet } from "react-icons/hi2";
import { GoDeviceDesktop } from "react-icons/go";

type EditorLayoutHeaderProps = {
  user: {
    email: string;
    name: string;
    image?: string | null | undefined;
  };
};

interface ScreenOption {
  value: DeviceType;
  label: string;
  description: string;
  minWidth?: number; // Optional for 'and more'
  maxWidth?: number; // Optional for 'up to'
  icon: React.ComponentType<any>;
}

// Ensure "Desktop" covers the rest of the screen sizes logically
const screenOptions: ScreenOption[] = [
  {
    value: "Mobile",
    label: "Phone",
    description: "up to 640px",
    maxWidth: 640,
    icon: CiMobile2,
  },
  {
    value: "Tablet",
    label: "Tablet",
    description: "up to 1080px",
    maxWidth: 1080,
    icon: HiMiniDeviceTablet,
  },
  {
    value: "Desktop",
    label: "Desktop",
    description: "1081px and more", // Adjusted description to be exclusive
    minWidth: 1081,
    icon: GoDeviceDesktop,
  },
];

export function EditorLayoutHeader({ user }: EditorLayoutHeaderProps) {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // Removed unused state: const [isPickerOpen, setIsPickerOpen] = React.useState(true);
  const {
    projectData,
    sections,
    theme,
    page,
    questions,
    categories,
    scoretiers,
    device,
    setDevice,
    setPreviewMode,
  } = usePageBuilderStore();

  const handleSave = async () => {
    if (!page) {
      toast.error("Missing page data. Please try reloading the editor.");

      return;
    }

    setIsSaving(true);
    try {
      const pageData: FinalFunnelPage = {
        id: page.id,
        title: page.title,
        type: page.type as FinalFunnelPage["type"],
        status: (page.status as PageStatusEnum) ?? "Draft",
        defaultPage: page.defaultPage ?? false,
        order: page.order,
        pathName: page.pathName,
        settings: JSON.stringify(page.settings),
        content: JSON.stringify(sections),
        theme: JSON.stringify(theme),
        previewImage: page.previewImage,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
      };
      const firsSectionId =
        sections.length > 0 && sections[0].id ? sections[0].id : null;

      const refinedQuestions: FormField[] =
        questions.map((field) => ({
          id: field.id,
          title: field.title,
          description: field.description || "",
          order: field.order,
          type: field.type as FormField["type"],
          formFieldType: field.formFieldType,
          displayPage: field.displayPage,
          attachment: field.attachment,
          validations: field.validations,
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
            ? JSON.stringify(field.categoryIds)
            : "",
          logicBranch: field.logicBranch
            ? JSON.stringify(field.logicBranch)
            : "",
          scoring: field.scoring ? JSON.stringify(field.scoring) : "",
          settings: field.settings ? JSON.stringify(field.settings) : "",
        })) || [];

      const projectDatavalues = {
        projectData: projectData as ProjectData,
        questions: refinedQuestions,
        categories: categories,
        scoretiers: scoretiers,
      };

      const savedPageData = await upsertPageData(pageData, projectDatavalues);

      if (!savedPageData || !savedPageData.success) {
        throw new Error("Failed to save page");
      }

      toast.success("Page was saved successfullly");
      router.refresh();
    } catch (error) {
      console.error("Failed to save page:", error);
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishProject = async (newVal: boolean) => {
    try {
      console.log(newVal);
      const result = await updateProjectStatus(
        projectData?.id as string,
        newVal
      );

      if (result?.success) {
        toast.success("Page status updated successfully");
        //toast.success("Page status updated successfully");
        // Let Next.js handle the revalidation
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      //setIsLoading(false);
    }
  };

  const handlePreviewClick = () => {
    setPreviewMode(true);
    setIsPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewMode(false);
    setIsPreviewOpen(false);
  };

  // The useCallback needs to accept a string from CommandItem's onSelect
  // and ensure it's a valid DeviceType before calling setDevice.
  const handleDeviceChange = useCallback(
    (value: string) => {
      // Type guard/check to ensure the string value is a valid DeviceType
      if (value === "Mobile" || value === "Tablet" || value === "Desktop") {
        setDevice(value as DeviceType);
      }
    },
    [setDevice]
  );

  // Find the currently selected option to display its label
  const currentDeviceOption = screenOptions.find((op) => op.value === device);
  const currentDeviceLabel = currentDeviceOption
    ? currentDeviceOption.label
    : "Select Device";
  const CurrentDeviceIcon = currentDeviceOption
    ? currentDeviceOption.icon
    : GoDeviceDesktop;

  return (
    <header className="bg-background sticky top-0 z-50 min-h-12 flex w-full items-center border-b">
      <div className="flex h-[--header-height] w-full flex-row shrink-0 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2 ">
          <Button
            asChild
            className="h-8 w-8 bg-gray-200"
            variant="ghost"
            size="icon"
          >
            <Link
              href={`http://localhost:3000/app/${projectData?.ref}/`}
              className="flex flex-row flex-nowrap items-center gap-x-2 hover:text-indigo-600 group"
            >
              <IoMdArrowRoundBack />
            </Link>
          </Button>

          {/* <Button
						className="h-8 w-8"
						variant="ghost"
						size="icon"
						onClick={toggleSidebar}
					>
						<SidebarIcon />
					</Button> */}
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-row items-center gap-x-3">
            <h4 className="text-lg font-semibold">{projectData?.title}</h4>
            <div className="flex flex-row flex-nowrap items-center justify-center gap-x-4">
              <Link
                href={`http://${projectData?.domain}.localhost:3000/`}
                passHref
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row flex-nowrap items-center gap-x-2 hover:text-indigo-600 group"
              >
                <BiLinkExternal className="w-5 h-5 text-indigo-600" />
              </Link>
            </div>
          </div>
        </div>

        {/* KEEPING THE SHADCN/UI POPOVER IMPLEMENTATION for device selection */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-fit h-8 justify-between text-xs"
              >
                {/* 1. **ERROR FIX:** Wrap the expression in {} and safely access .label */}
                <CurrentDeviceIcon className="h-4 w-4" />
                {currentDeviceLabel}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[150px]" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {screenOptions.map((option, index) => (
                      <CommandItem
                        key={index}
                        value={option.value} // CommandItem value is a string
                        onSelect={handleDeviceChange}
                        className="flex flex-row items-center gap-2"
                      >
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className=" px-3 flex items-center gap-x-2">
          <NavUser user={user} />
          <SheetProvider
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="px-[8px] py-[4px] min-h-[28px] h-fit border border-editor-border rounded-[6px] hover:bg-transparent "
                onClick={handlePreviewClick}
              >
                <EyeIcon className="h-4 w-4" />
                {/* Preview */}
              </Button>
            }
            side="bottom"
            className="min-h-[42rem] h-[60vh] w-[100vw] max-w-none p-0 overflow-hidden"
            showDefaultClose={false} // Hides the default 'X'
            customCloseButton={
              <Button
                variant="outline"
                className="absolute top-4 right-4 z-50 rounded-lg p-2 bg-white text-editor-foreground border border-editor-border hover:bg-transparent "
              >
                <X className="h-4 w-4" />
              </Button>
            }
            onOpenChange={(isOpen) => {
              if (isOpen) {
                //handlePreviewClose();
                setPreviewMode(true);
              } else {
                setPreviewMode(false);
              }
            }}
          >
            <PreviewPageComponent />
          </SheetProvider>
          {isSaving ? (
            <Button
              variant="outline"
              size="sm"
              className="px-[8px] py-[4px] min-h-[28px] h-fit border border-editor-border rounded-[6px] hover:bg-transparent "
            >
              <Loader2Icon className="animate-spin" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="px-[8px] py-[4px] min-h-[28px] h-fit border border-editor-border rounded-[6px] hover:bg-transparent "
              disabled={isSaving} // Added disabled state for saving
            >
              <Save size={16} /> {/* Save icon size adjustment */}
            </Button>
          )}

          {projectData && projectData.draftMode === true ? (
            <Button
              size="sm"
              onClick={() => handlePublishProject(!projectData.draftMode)}
            >
              Publish
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handlePublishProject(!projectData?.draftMode)}
            >
              Make draft
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// 3. **CLEANUP:** Removed the redundant ScreenTypePicker component as it's not used.
// const ScreenTypePicker: React.FC = () => { ... }
