import {
  AIHighlight,
  CharacterCount,
  CodeBlockLowlight,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  Mathematics,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Twitter,
  UpdatedImage,
  UploadImagesPlugin,
  Youtube,
} from "novel";
import { Extension } from "@tiptap/core";
import Underline from "@tiptap/extension-underline";
import { generateJSON } from "@tiptap/core";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list"; // Import the base
import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";
import { VariableExtension } from "./extensions/variable";

const GlobalClass = Extension.create({
  name: "globalClass",
  addGlobalAttributes() {
    return [
      {
        types: [
          "heading",
          "paragraph",
          "listItem",
          "image",
          "textStyle",
          "link",
        ],
        attributes: {
          class: {
            default: null,
            // Parse the HTML: look for class or className
            parseHTML: (element) =>
              element.getAttribute("class") ||
              element.getAttribute("className"),
            // Render the HTML: add the class back to the tag
            renderHTML: (attributes) => {
              if (!attributes.class) return {};
              return {
                class: attributes.class,
              };
            },
          },
        },
      },
    ];
  },
});

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects
const aiHighlight = AIHighlight;
//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
    ),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 "),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2 pl-6 mb-4"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2 pl-6 mb-4"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary"),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx(
        "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium"
      ),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

// 2. NEW: Circle Check List Extension
export const CircleCheckList = BulletList.extend({
  name: "circleCheckList",
  addOptions() {
    return {
      ...this.parent?.(),
      itemTypeName: "listItem",
      HTMLAttributes: {
        // Unique class for styling
        class: "circle-check-list",
      },
    };
  },
  parseHTML() {
    return [
      {
        // 1. We tell Tiptap: Only match <ul> tags that have this specific class
        tag: "ul.circle-check-list",
        // 2. We set priority higher than the default BulletList (which is 50)
        // This ensures Tiptap checks this rule BEFORE falling back to the standard list
        priority: 51,
      },
    ];
  },
});

// 3. NEW: Tick List Extension
export const TickList = BulletList.extend({
  name: "tickList",
  addOptions() {
    return {
      ...this.parent?.(),
      itemTypeName: "listItem",
      HTMLAttributes: {
        // Unique class for styling
        class: "tick-list",
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "ul.tick-list",
        priority: 51,
      },
    ];
  },
});

const codeBlockLowlight = CodeBlockLowlight.configure({
  // configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
  // common: covers 37 language grammars which should be good enough in most cases
  lowlight: createLowlight(common),
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
  inline: false,
});

const twitter = Twitter.configure({
  HTMLAttributes: {
    class: cx("not-prose"),
  },
  inline: false,
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: cx("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
  },
  katexOptions: {
    throwOnError: false,
  },
});

const characterCount = CharacterCount.configure();

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  codeBlockLowlight,
  youtube,
  twitter,
  mathematics,
  characterCount,
  TiptapUnderline,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  CircleCheckList, // Add new extension
  TickList,
  VariableExtension,
  GlobalClass,
];

export function getJson(htmlContent: string) {
  if (!htmlContent) return null;

  // 3. Pre-process: Convert React className to HTML class
  // DOMParser (used by generateJSON) treats 'className' as a custom attribute, not the class list.
  const processedHtml = htmlContent.replace(/className="/g, 'class="');

  // Generate JSON from the HTML content using the defined extensions
  const jsonData = generateJSON(processedHtml, [
    Document,
    Paragraph,
    Text,
    Bold,
    starterKit,
    placeholder,
    tiptapLink,
    tiptapImage,
    UpdatedImage,
    taskList,
    taskItem,
    CircleCheckList, // Add new extension
    TickList,
    horizontalRule,
    Underline,
    TextStyle,
    Color,
    // FontSize,
    // LineHeight,
    // LetterSpacing,
    // TextAlign.configure({
    //   defaultAlignment: "", // This prevents automatic left alignment
    //   types: ["heading", "paragraph"], // Limit which nodes can receive alignment
    // }),

    youtube,
    twitter,
    VariableExtension,
    GlobalClass,
  ]);

  return jsonData;
}
