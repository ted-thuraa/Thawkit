import { v4 } from "uuid";
import { ElementNode, IdIndex, MetaDynamicData, PartialUpdate } from "./types";

/**
 * Builds an index mapping element IDs to their paths within the tree.
 * This allows for O(1) lookup of elements for subsequent updates.
 *
 * @param tree The element tree to index.
 * @returns A Map where keys are element IDs and values are arrays of indices representing the path from the root.
 */
export function buildIdIndex(tree: ElementNode[]): IdIndex {
  const index: IdIndex = new Map();

  function traverse(nodes: ElementNode[], currentPath: number[]) {
    nodes.forEach((node, i) => {
      const newPath = [...currentPath, i];
      index.set(node.id, newPath);
      if (Array.isArray(node.content) && node.content.length > 0) {
        traverse(node.content, newPath);
      }
    });
  }

  traverse(tree, []);
  return index;
}

/**
 * Recursively updates an element in the tree by its ID. This is a safe, simple approach
 * suitable for one-off updates, but can be less performant for very large trees.
 *
 * @param nodes The current level of nodes to search.
 * @param id The ID of the element to update.
 * @param patch The partial update to apply.
 * @returns A new array of ElementNodes with the update applied immutably.
 */
function recursiveUpdate(
  nodes: ElementNode[],
  id: string,
  patch: PartialUpdate
): ElementNode[] {
  let updated = false;
  const newNodes = nodes.map((node) => {
    if (node.id === id) {
      updated = true;
      return applyPatch(node, patch);
    } else if (Array.isArray(node.content) && node.content.length > 0) {
      const newContent = recursiveUpdate(node.content, id, patch);
      if (newContent !== node.content) {
        updated = true;
        return { ...node, content: newContent };
      }
    }
    return node;
  });
  return updated ? newNodes : nodes;
}

/**
 * Applies a PartialUpdate to an ElementNode, returning a new, updated node.
 *
 * @param originalNode The original ElementNode to update.
 * @param patch The PartialUpdate to apply.
 * @returns A new ElementNode with the patch applied.
 */
function applyPatch(
  originalNode: ElementNode,
  patch: PartialUpdate
): ElementNode {
  let newNode = { ...originalNode };

  if (patch.set) {
    newNode = { ...newNode, ...patch.set };
  }

  if (patch.addItem) {
    newNode.content = [
      ...(newNode.content as ElementNode[]),
      { ...patch.addItem.data },
    ];
  }

  if (patch.addItemAtIndex) {
    if (Array.isArray(newNode.content)) {
      console.log("parent", newNode.content);
      const index = newNode.content.findIndex(
        (s) => s.id === patch.addItemAtIndex?.afterIndex
      );

      const newContent = [
        ...newNode.content.slice(0, index + 1),
        patch.addItemAtIndex?.data,
        ...newNode.content.slice(index + 1),
      ];
      console.log("index", newContent);
      newNode.content = newContent;
    }
  }

  if (patch.removeItem) {
    if (Array.isArray(newNode.content)) {
      newNode.content = newNode.content.filter(
        (element) => element.id !== patch.removeItem?.elementId
      );
    }
  }

  if (patch.updateProperty) {
    //const propertyToUpdate = Object.keys(patch.updateProperty)[0];
    const propertyToUpdate = patch.updateProperty.property;
    const valueToUpdate = patch.updateProperty.value;
    if (propertyToUpdate.includes(".")) {
      const parts = propertyToUpdate.split(".");

      //Special handling for metaDynamic array updates
      if (
        parts.includes("metaDynamic") &&
        parts[parts.length - 3] !== undefined
      ) {
        const content = newNode.content as { metaDynamic?: MetaDynamicData[] };
        const currentMetaDynamic = content.metaDynamic || [];
        const tierId = parts[parts.length - 3]; // Extract tierId from path
        const field = parts[parts.length - 1]; // Extract field (title/description)

        const updatedMetaDynamic = currentMetaDynamic.map((item) => {
          if (item.score_tier_id === tierId) {
            // console.log(item);
            // let updItem = {
            //   ...item,
            //   content: {
            //     ...item.content,
            //     [field]: value,
            //   },
            // };
            // console.log(updItem);
            return {
              ...item,
              content: {
                ...item.content,
                [field]: valueToUpdate,
              },
            };
          }
          return item;
        });

        return {
          ...newNode,
          content: {
            ...(newNode.content as object),
            metaDynamic: updatedMetaDynamic,
          },
        };
      }

      // Handle other nested properties
      const [parent, child] = propertyToUpdate.split(".");

      const updateChild = {
        ...newNode,
        [parent]: {
          // @ts-ignore
          ...newNode[parent],
          [child]: valueToUpdate,
        },
      };

      return updateChild;
    }

    // Handle direct properties
    return {
      ...newNode,
      [propertyToUpdate]: valueToUpdate,
    };
    //newNode = { ...newNode, ...patch.set };
  }

  if (patch.patchStyles) {
    newNode.styles = { ...newNode.styles, ...patch.patchStyles };
  }

  if (patch.patchSettings) {
    newNode.settings = { ...newNode.settings, ...patch.patchSettings };
  }

  if (patch.replaceContent !== undefined) {
    //newNode.content = patch.replaceContent || undefined; // Use undefined if null to remove the key
  }

  return newNode;
}

/**
 * Updates an element in the tree using an index for quick lookup. This approach
 * is optimized for performance on large trees by only copying nodes along the path
 * to the updated element.
 *
 * @param tree The element tree to update.
 * @param id The ID of the element to update.
 * @param patch The partial update to apply.
 * @param idIndex An optional IdIndex for O(1) lookup. If not provided, it will be built.
 * @returns A new tree with the requested update applied immutably.
 */
export function indexedUpdate(
  tree: ElementNode[],
  id: string,
  patch: PartialUpdate,
  idIndex?: IdIndex
): ElementNode[] {
  const currentIdIndex = idIndex || buildIdIndex(tree);
  const path = currentIdIndex.get(id);

  if (!path) {
    console.warn(`Element with ID '${id}' not found. Returning original tree.`);
    return tree;
  }

  let newTree = [...tree];
  let currentNode: ElementNode | ElementNode[] = newTree;
  let updatedNode: ElementNode | null = null;

  // Traverse the path, copying nodes along the way
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    if (i === path.length - 1) {
      // This is the target node
      updatedNode = applyPatch((currentNode as ElementNode[])[index], patch);
      (currentNode as ElementNode[])[index] = updatedNode;
    } else {
      // Copy the current node and its content array
      const nextNode: ElementNode = {
        ...(currentNode as ElementNode[])[index],
      };
      if (Array.isArray(nextNode.content)) {
        nextNode.content = [...nextNode.content];
        (currentNode as ElementNode[])[index] = nextNode;
        currentNode = nextNode.content;
      } else {
        // If content is not an array, it's a leaf node for traversal purposes
        // We don't need to traverse further down this path for ElementNodes
        (currentNode as ElementNode[])[index] = nextNode;
        break;
      }
    }
  }

  return newTree;
}

/**
 * Main function to update an element in the tree by its ID.
 * It uses the indexedUpdate strategy for performance.
 *
 * @param tree The element tree to update.
 * @param id The ID of the element to update.
 * @param patch The partial update to apply.
 * @returns A new tree with the requested update applied immutably.
 */
export function updateElementById(
  tree: ElementNode[],
  id: string,
  patch: PartialUpdate
): ElementNode[] {
  return indexedUpdate(tree, id, patch);
}

/**
 * Recursively traverses a PageNode and its descendants to collect all quiz IDs.
 *
 * @param node - The PageNode to start the search from.
 * @returns An array of found quizId strings.
 */
function collectQuizIds(node: ElementNode): string[] {
  let ids: string[] = [];

  // 1. Check the current node itself for a quizId.
  if (
    node.type === "LandingPage_Quiz" &&
    node.settings &&
    typeof node.content === "object" &&
    !Array.isArray(node.content) &&
    typeof node.settings.quizId === "string" &&
    node.settings.quizId // Ensure it's not an empty string
  ) {
    ids.push(node.settings.quizId);
  }

  // 2. Recursively check children if the content is an array of nodes.
  if (Array.isArray(node.content)) {
    // Using flatMap for a concise way to collect and flatten IDs from all children.
    const childIds = node.content.flatMap((childNode) =>
      collectQuizIds(childNode)
    );
    ids.push(...childIds);
  }

  return ids;
}

export function findAndRemoveSection(
  nodes: ElementNode[],
  id: string
): { updatedNodes: ElementNode[]; removedQuizIds: string[] } {
  let allRemovedQuizIds: string[] = [];

  /**
   * Inner recursive function to perform the search and removal.
   * @param currentNodes - The current array of nodes being processed.
   */
  function searchAndRemove(currentNodes: ElementNode[]): ElementNode[] {
    // Use Array.reduce for an immutable transformation of the array.
    return currentNodes.reduce((accumulator, node) => {
      // 1. Check if the current node is the one to be removed.
      if (node.id === id) {
        // If it matches, collect its quiz IDs.
        const idsToRemove = collectQuizIds(node);
        allRemovedQuizIds.push(...idsToRemove);
        // Then, exclude it from the accumulator, effectively deleting it.
        return accumulator;
      }

      // 2. If it's not the target node, we keep it but must process its children.
      const newNode = structuredClone(node); // Deep clone to ensure full immutability.
      if (Array.isArray(newNode.content)) {
        // The result of the recursive call is the updated content for the new node.
        newNode.content = searchAndRemove(newNode.content);
      }

      // Add the processed node (with potentially updated children) to the result.
      accumulator.push(newNode);
      return accumulator;
    }, [] as ElementNode[]);
  }

  const updatedNodes = searchAndRemove(nodes);

  return {
    updatedNodes,
    // Return a unique set of IDs to prevent duplicate processing.
    removedQuizIds: [...new Set(allRemovedQuizIds)],
  };
}

// Utility function to update nested elements
export const updateNestedElement = (
  section: ElementNode,
  elementId: string,
  property: string,
  value: any
): ElementNode => {
  if (section.id === elementId) {
    // Handle nested property paths for metaDynamic updates
    if (property.includes(".")) {
      const parts = property.split(".");

      //Special handling for metaDynamic array updates
      if (
        parts.includes("metaDynamic") &&
        parts[parts.length - 3] !== undefined
      ) {
        const content = section.content as { metaDynamic?: MetaDynamicData[] };
        const currentMetaDynamic = content.metaDynamic || [];
        const tierId = parts[parts.length - 3]; // Extract tierId from path
        const field = parts[parts.length - 1]; // Extract field (title/description)

        const updatedMetaDynamic = currentMetaDynamic.map((item) => {
          if (item.score_tier_id === tierId) {
            // console.log(item);
            // let updItem = {
            //   ...item,
            //   content: {
            //     ...item.content,
            //     [field]: value,
            //   },
            // };
            // console.log(updItem);
            return {
              ...item,
              content: {
                ...item.content,
                [field]: value,
              },
            };
          }
          return item;
        });

        return {
          ...section,
          content: {
            ...(section.content as object),
            metaDynamic: updatedMetaDynamic,
          },
        };
      }

      // Handle other nested properties
      const [parent, child] = property.split(".");
      const updateChild = {
        ...section,
        [parent]: {
          // @ts-ignore
          ...section[parent],
          [child]: value,
        },
      };

      return updateChild;
    }

    // Handle direct properties
    return {
      ...section,
      [property]: value,
    };
  }

  if (Array.isArray(section.content)) {
    return {
      ...section,
      content: section.content.map((child) =>
        updateNestedElement(child, elementId, property, value)
      ),
    };
  }

  return section;
};

export const addItemToSmartLayout = (
  section: ElementNode,
  targetId: string,
  layoutType: string
): ElementNode => {
  // Early return if no layout type provided
  if (!layoutType) {
    console.warn("Layout type is required for smart layout items");
    return section;
  }

  // Check if this is the target section
  if (section.id === targetId) {
    // Validate section type
    if (section.type !== "smart_layout" && section.type !== "category_scores") {
      console.warn("Cannot add smart layout item to non-smart-layout section");
      return section;
    }

    // Create new item with proper defaults based on layout type
    const newItem: ElementNode = {
      id: v4(),
      styles: {},
      className: "",
      name: "",
      type: section.type !== "smart_layout" ? "layout_item" : "catItem",
      isHidden: false,
      settings: {
        smart_layout_type: layoutType,

        contentIsDynamic: false,
      },
      content: [
        {
          id: v4(),
          styles: {},
          className: "text-lg font-medium",
          name: "",
          type: "catItemTitle",
          settings: {
            categoryId: "",
            contentIsDynamic: false,
          },
          content: {
            innerText: `
                 <h3>Add title here</h3>
                 `,
            metaDynamic: [],
          },
        },
        {
          id: v4(),
          styles: {},
          className: "text-lg font-medium ",
          name: "",
          type: "catItemDescription",
          settings: {
            categoryId: "",
            contentIsDynamic: false,
          },
          content: {
            innerText: `
                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                 `,
            metaDynamic: [],
          },
        },
      ],
    };

    // Add to content array
    return {
      ...section,
      content: Array.isArray(section.content)
        ? [...section.content, newItem]
        : [newItem],
    };
  }

  // Recursively search children
  if (Array.isArray(section.content)) {
    return {
      ...section,
      content: section.content.map((child) =>
        addItemToSmartLayout(child, targetId, layoutType)
      ),
    };
  }

  return section;
};

export const addBtnElement = (
  section: ElementNode,
  parentId: string,
  layoutType: string
): ElementNode => {
  // Check if this is the target section
  if (section.id === parentId) {
    // Validate section type
    if (section.type !== "buttons") {
      console.warn("Cannot add button to non-button-group section");
      return section;
    }

    // Create new button with proper defaults
    const newButton: ElementNode = {
      id: v4(),
      styles: {},
      className:
        "inline-flex justify-center items-center text-center outline-none m-[1px] h-[36px] px-[16px] rounded-[8px] shadow-sm",
      name: "",
      type: "button_item",
      isHidden: false,
      settings: {
        btn_action: "go_to_questions",
        btn_style: "default",
      },
      content: {
        href: "",
        innerText: "New Button",
      },
    };

    // Add to content array
    return {
      ...section,
      content: Array.isArray(section.content)
        ? [...section.content, newButton]
        : [newButton],
    };
  }

  // Recursively search children
  if (Array.isArray(section.content)) {
    return {
      ...section,
      content: section.content.map((child) =>
        addBtnElement(child, parentId, layoutType)
      ),
    };
  }

  return section;
};

export const removeSmartLayoutItem = (
  section: ElementNode,
  parentId: string,
  itemId: string
): ElementNode => {
  if (
    (section.id === parentId && section.type === "smart_layout") ||
    section.type === "buttons"
  ) {
    return {
      ...section,
      content: Array.isArray(section.content)
        ? section.content.filter((item) => item.id !== itemId)
        : section.content,
    };
  }

  if (Array.isArray(section.content)) {
    return {
      ...section,
      content: section.content.map((child) =>
        removeSmartLayoutItem(child, parentId, itemId)
      ),
    };
  }

  return section;
};

export const findTopLevelSectionId = (
  sections: ElementNode[],
  elementId: string
): string | null => {
  // Check direct sections first
  const directSection = sections.find((section) => section.id === elementId);
  if (directSection) return directSection.id;

  // Search through nested content
  for (const section of sections) {
    if (Array.isArray(section.content)) {
      const foundId = findElementParentSection(section, elementId);
      if (foundId) return section.id;
    }
  }
  return null;
};

// Helper function to recursively search through nested content
export const findElementParentSection = (
  section: ElementNode,
  elementId: string
): boolean => {
  if (section.id === elementId) return true;

  if (Array.isArray(section.content)) {
    return section.content.some((child) =>
      findElementParentSection(child, elementId)
    );
  }

  return false;
};
