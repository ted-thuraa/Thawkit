"use client";

/**
 * Thin pass-through — everything this used to own (page/layer CRUD
 * handlers, page-settings panel state, resizable-sidebar state, the dead
 * `PageTreeRow`) now lives in LeftPanel.tsx, matching how little Ycode's
 * own top-level route components do (LeftSidebar.tsx reads its stores
 * directly rather than receiving mutation handlers prop-drilled from a
 * parent — see LeftPanel.tsx's file header for the full rationale).
 *
 * Kept as its own file/export rather than inlining LeftPanel directly into
 * BuilderMain.tsx purely to keep BuilderMain.tsx's render branches
 * readable and to leave a natural seam if this ever needs to wrap
 * LeftPanel with something else (e.g. a read-only banner).
 */

import LeftPanel from "./LeftPanel";

interface EditorBodyProps {
  campaignId: string;
}

export function EditorBody({ campaignId }: EditorBodyProps) {
  return <LeftPanel campaignId={campaignId} />;
}
