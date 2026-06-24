"use client";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  useEditor,
} from "novel";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions, getJson } from "./extensions"; // Ensure getJson handles empty strings
import { cn, hierarchicalClasses } from "@/lib/utils";
import { slashCommand, suggestionItems } from "./slash-command";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { Separator } from "@/components/ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";
import { VariableExtension } from "./extensions/variable";
import { Braces } from "lucide-react";
import { VariableSelector } from "./selectors/VariableSelector";
import { Editor } from "@tiptap/core";

// ... imports (Slash commands, etc)

type Props = {
  initialHtml: string;
  onUpdate: (html: string) => void;
  className?: string;
  styles?: React.CSSProperties;
};

const AdvancedTextEditor = ({
  initialHtml,
  onUpdate,
  className,
  styles,
}: Props) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();
  const [openVariables, setOpenVariables] = useState(false);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    const handler = () => setOpenVariables(true);
    window.addEventListener("open-variable-menu", handler);
    return () => window.removeEventListener("open-variable-menu", handler);
  }, []);

  const extensions = [...defaultExtensions, slashCommand, VariableExtension];
  // 1. Parse Initial JSON only once.
  // We do NOT update this if initialHtml changes later (to prevent typing resets)
  const initialJson = useMemo((): JSONContent | undefined => {
    if (!initialHtml) {
      // Cast this to JSONContent to fix the "Type '{...}' is not assignable" error
      return defaultTextEditorContent as JSONContent;
    }

    try {
      const json = getJson(initialHtml);
      // If getJson returns null, fallback to default or undefined
      if (!json) return defaultTextEditorContent as JSONContent;

      return json;
    } catch (e) {
      console.error("Failed to parse HTML to JSON", e);
      return defaultTextEditorContent as JSONContent;
    }
  }, []); // Empty dependency array = only runs on mount

  // 2. Handle Updates
  // Debounce the callback to the parent to avoid freezing the UI on large documents
  const debouncedUpdate = useDebouncedCallback((editor) => {
    const html = editor.getHTML();
    onUpdate(html);
  }, 500);

  const triggerVariableMenu = () => setOpenVariables(true);

  // We need to inject the trigger into the NodeSelector and Slash Items
  // Note: To modify slash items dynamically, we might need to pass the trigger function
  // or use a custom command that simply sets the state open.

  // Custom Command for Slash Menu
  const insertVariableCommand = ({ editor, range }: any) => {
    editor.chain().focus().deleteRange(range).run();
    setOpenVariables(true);
  };

  const editorClasses = cn(
    "prose prose-lg  focus:outline-none max-w-full min-h-[1em]",
    className
  );

  return (
    <div className="relative h-full w-full">
      {/* Border Overlay */}

      <EditorRoot>
        <EditorContent
          initialContent={initialJson}
          extensions={extensions} // Add your specific extensions here
          className="relative h-full w-full bg-transparent border-none  "
          onCreate={({ editor }) => {
            editorRef.current = editor;
            // This fires exactly once when the editor is ready
            editor.commands.focus("end");
          }}
          editorProps={{
            attributes: {
              class: editorClasses,
              style: styles as string,
            },
            // This ensures the editor focuses immediately when mounted
            //autofocus: "end",
          }}
          onUpdate={({ editor }) => {
            debouncedUpdate(editor);
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-white px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  key={item.title}
                  value={item.title}
                  onCommand={(val) => {
                    item.command?.(val);
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            <Separator orientation="vertical" />
            <button
              onClick={() => setOpenVariables(true)}
              className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-muted rounded text-muted-foreground"
            >
              <Braces className="w-4 h-4" />
            </button>
          </GenerativeMenuSwitch>
          {/* 2. The Popover Logic */}
          {/* We place the VariableSelector here. It needs to know where to position. 
               Ideally, standard Tiptap bubble menus position themselves. 
               However, for a global "insert" popover triggered by slash command, 
               centering it or placing it at cursor is tricky without Tiptap's <BubbleMenu>.
               
               Trick: Since we used Popover from UI lib, we anchor it to the editor 
               or a specific hidden div at the cursor position. 
               
               For simplicity in this implementation, let's render it 
               absolute positioned or centered modal style, 
               OR use the 'slotAfter' prop to inject it.
           */}
          <VariableSelector
            open={openVariables}
            onOpenChange={setOpenVariables}
            onSelect={(item) => {
              editorRef.current?.chain().focus().setVariable(item).run();
            }}
          />
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default AdvancedTextEditor;

export const defaultTextEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Title" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: " Add content here ",
        },
      ],
    },
  ],
};
