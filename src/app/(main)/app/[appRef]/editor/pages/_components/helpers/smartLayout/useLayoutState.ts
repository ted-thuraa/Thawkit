// File: src/components/SmartLayout/useLayoutState.ts
import { useMemo } from "react";
import { ElementNode } from "@/store/pagebuilder/pageEditorTypes";

/**
 * Custom hook for managing layout state computations
 * Centralizes derived state logic to reduce duplication
 *
 * @param {Object} params - Hook parameters
 * @returns {Object} Computed state values
 */
export const useLayoutState = ({
  livemode,
  previewMode,
  activeElementId,
  sectionId,
  content,
}: {
  livemode: boolean;
  previewMode: boolean;
  activeElementId: string | null;
  sectionId: string;
  content: ElementNode[] | any;
}) => {
  // Compute edit mode
  const isEditMode = useMemo(
    () => !livemode && !previewMode,
    [livemode, previewMode]
  );

  // Check if layout is active
  const isLayoutActive = useMemo(
    () => isEditMode && activeElementId === sectionId,
    [isEditMode, activeElementId, sectionId]
  );

  // Check if any child is active
  const isChildActive = useMemo(() => {
    if (!isEditMode || !activeElementId || !Array.isArray(content))
      return false;
    return content.some((item: ElementNode) => item.id === activeElementId);
  }, [isEditMode, activeElementId, content]);

  return {
    isEditMode,
    isLayoutActive,
    isChildActive,
  };
};
