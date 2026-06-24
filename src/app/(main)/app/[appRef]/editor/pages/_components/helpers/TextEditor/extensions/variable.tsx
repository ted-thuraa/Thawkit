import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { VariableComponent } from "./VariableComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    variable: {
      setVariable: (attributes: {
        label: string;
        id: string;
        category: string;
      }) => ReturnType;
    };
  }
}

export const VariableExtension = Node.create({
  name: "variable",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true, // Prevents cursor from entering the node
  content: "",
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
        }),
      },
      category: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-category"),
        renderHTML: (attributes) => ({
          "data-category": attributes.category,
        }),
      },
      label: {
        default: "Variable",
        parseHTML: (element) => element.getAttribute("data-label"),
        renderHTML: (attributes) => ({
          "data-label": attributes.label,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-type": "variable" }),
      //0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableComponent);
  },

  addCommands() {
    return {
      setVariable:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "variable",
            attrs: attributes,
          });
        },
    };
  },
});
