// "use client";

// import React from "react";
// import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
// import { useTree } from "@headless-tree/react";

// import {
//   LayoutGrid,
//   Box,
//   Rows,
//   Container,
//   Heading1,
//   Type,
//   Image,
//   Video,
//   MousePointer,
// } from "lucide-react";
// import { ElementNode, ElementType } from "@/store/pagebuilder/pageEditorTypes";
// import { Tree, TreeItem, TreeItemLabel } from "@/components/tree";

// // --- 1. Type Definitions for Your Page Data ---
// // It's best practice to have clear types for your data structure.

// // --- 2. Data Transformation Logic ---
// // This function converts your nested array into a flat map for headless-tree.
// interface TreeItemData {
//   id: string;
//   name: string; // The label you want to display in the tree
//   children?: string[]; // An array of child IDs
//   originalElement: Partial<ElementNode>;
// }

// const transformPageDataForTree = (elements: ElementNode[]) => {
//   const items: Record<string, TreeItemData> = {};

//   function traverse(element: ElementNode) {
//     // Skip if the element has no ID
//     if (!element.id) return;

//     const childrenIds = Array.isArray(element.content)
//       ? element.content.map((child) => child.id)
//       : undefined;

//     items[element.id] = {
//       id: element.id,
//       // Create a descriptive name, e.g., "section (hero 6)" or "container"
//       name: `${element.type}${element.name ? ` (${element.name})` : ""}`,
//       children: childrenIds,
//       originalElement: element,
//     };

//     // Recursively process children
//     if (Array.isArray(element.content)) {
//       element.content.forEach(traverse);
//     }
//   }

//   elements.forEach(traverse);

//   // Create a virtual root to hold all top-level elements
//   const rootId = "root";
//   items[rootId] = {
//     id: rootId,
//     name: "Page",
//     children: elements.map((el) => el.id),
//     originalElement: { id: rootId, type: "section" }, // Dummy original element
//   };

//   return { items, rootId };
// };

// // --- 3. Icon Mapping for Visual Flair ---
// // Maps element types to corresponding lucide-react icons.
// const getIconForType = (type: ElementType) => {
//   switch (type) {
//     case "section":
//       return <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />;
//     case "container":
//       return <Container className="mr-2 h-4 w-4 text-muted-foreground" />;
//     case "columns":
//     case "rows":
//       return <Rows className="mr-2 h-4 w-4 text-muted-foreground" />;
//     case "div_block":
//       return <Box className="mr-2 h-4 w-4 text-muted-foreground" />;
//     case "text":
//       return <Type className="mr-2 h-4 w-4 text-muted-foreground" />;
//     case "buttons":
//     case "button_item":
//       return <MousePointer className="mr-2 h-4 w-4 text-muted-foreground" />;
//     case "image":
//       return <Image className="mr-2 h-4 w-4 text-muted-foreground" />;
//     case "video":
//       return <Video className="mr-2 h-4 w-4 text-muted-foreground" />;
//     default:
//       return <Box className="mr-2 h-4 w-4 text-muted-foreground" />;
//   }
// };

// // --- 4. The Refactored React Component ---
// interface PageStructureTreeProps {
//   elements: ElementNode[]; // Accept the page structure as a prop
// }

// export default function PageStructureTree({
//   elements,
// }: PageStructureTreeProps) {
//   // Memoize the transformed data to prevent re-computation on every render
//   const { items, rootId } = React.useMemo(
//     () => transformPageDataForTree(elements),
//     [elements]
//   );

//   const indent = 20;

//   const tree = useTree<TreeItemData>({
//     // Expand the root by default
//     initialState: {
//       expandedItems: [rootId],
//     },
//     indent,
//     rootItemId: rootId,
//     getItemName: (item) => item.getItemData().name,
//     isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
//     dataLoader: {
//       getItem: (itemId) => items[itemId],
//       getChildren: (itemId) => items[itemId]?.children ?? [],
//     },
//     features: [syncDataLoaderFeature, hotkeysCoreFeature],
//   });

//   return (
//     <div className="flex h-full w-full flex-col gap-2 *:first:grow">
//       <Tree aria-label="Page Structure" indent={indent} tree={tree}>
//         {tree.getItems().map((item) => {
//           const itemType = item.getItemData().originalElement.type;
//           return (
//             <TreeItem key={item.getId()} item={item}>
//               {getIconForType(itemType as ElementType)}
//               <TreeItemLabel />
//             </TreeItem>
//           );
//         })}
//       </Tree>
//     </div>
//   );
// }

"use client";

import React from "react";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";

import { Tree, TreeItem, TreeItemLabel } from "@/components/tree";

interface Item {
  name: string;
  children?: string[];
}

const items: Record<string, Item> = {
  company: {
    name: "Company",
    children: ["engineering", "marketing", "operations"],
  },
  engineering: {
    name: "Engineering",
    children: ["frontend", "backend", "platform-team"],
  },
  frontend: { name: "Frontend", children: ["design-system", "web-platform"] },
  "design-system": {
    name: "Design System",
    children: ["components", "tokens", "guidelines"],
  },
  components: { name: "Components" },
  tokens: { name: "Tokens" },
  guidelines: { name: "Guidelines" },
  "web-platform": { name: "Web Platform" },
  backend: { name: "Backend", children: ["apis", "infrastructure"] },
  apis: { name: "APIs" },
  infrastructure: { name: "Infrastructure" },
  "platform-team": { name: "Platform Team" },
  marketing: { name: "Marketing", children: ["content", "seo"] },
  content: { name: "Content" },
  seo: { name: "SEO" },
  operations: { name: "Operations", children: ["hr", "finance"] },
  hr: { name: "HR" },
  finance: { name: "Finance" },
};

const indent = 20;

export default function PageStructureTree() {
  const tree = useTree<Item>({
    initialState: {
      expandedItems: ["engineering", "frontend", "design-system"],
    },
    indent,
    rootItemId: "company",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  return (
    <div className="flex h-full flex-col gap-2 *:first:grow">
      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => {
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel />
            </TreeItem>
          );
        })}
      </Tree>

      <p
        aria-live="polite"
        role="region"
        className="text-muted-foreground mt-2 text-xs"
      >
        Basic tree with no extra features ∙{" "}
        <a
          href="https://headless-tree.lukasbach.com"
          className="hover:text-foreground underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          API
        </a>
      </p>
    </div>
  );
}
