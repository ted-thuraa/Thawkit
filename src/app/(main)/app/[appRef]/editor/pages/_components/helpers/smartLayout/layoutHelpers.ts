// File: src/components/SmartLayout/layoutHelpers.ts
import { v4 } from "uuid";
import { ElementNode } from "@/stores/pageEditorStore/types";

/**
 * Creates a new layout item with default structure
 * Extracted to a helper function to avoid recreating the object on every render
 *
 * @returns {ElementNode} New layout item node
 */
export const createNewLayoutItem = (): ElementNode => {
  return {
    id: v4(),
    styles: {},
    className: "",
    name: "",
    type: "layout_item",
    isHidden: false,
    settings: {
      categoryId: "",
      contentIsDynamic: false,
    },
    content: [
      {
        id: v4(),
        styles: {},
        className: "text-base font-semibold",
        name: "",
        type: "layout_Item_Title",
        settings: {
          contentIsDynamic: false,
        },
        content: {
          innerText: `<h3>Title here</h3>`,
          metaDynamic: [],
        },
      },
      {
        id: v4(),
        styles: {},
        className: "text-base/7",
        name: "",
        type: "layout_Item_Content",
        settings: {
          contentIsDynamic: false,
        },
        content: {
          innerText: `<p>You can type something here</p>`,
          metaDynamic: [],
        },
      },
    ],
  };
};

/**
 * Computes grid column classes based on column count
 *
 * @param {number} cols - Number of columns
 * @returns {string} Tailwind CSS grid column class
 */
export const getGridColsClass = (cols?: number): string => {
  if (cols === 1) return "md:grid-cols-1";
  if (cols === 2) return "md:grid-cols-2";
  if (cols === 4) return "md:grid-cols-4";
  return "md:grid-cols-3"; // Default to 3
};
