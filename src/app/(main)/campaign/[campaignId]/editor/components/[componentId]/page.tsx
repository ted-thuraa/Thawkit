/**
 * Component-edit route — /campaigns/[campaignId]/components/[componentId]
 * (?variant= selects the active variant, ?tab=, ?layer=)
 *
 * Renders nothing — see the base campaigns/[campaignId]/page.tsx comment.
 *
 * This file lives inside components/ alongside CampaignEditorMain.tsx and
 * EditorBody.tsx — verified against the actual Ycode repository that this
 * is exactly how it structures things too (app/(builder)/ycode/components/
 * holds ~120 plain .tsx component files AND a [id]/page.tsx route
 * subfolder side by side). Next.js only treats specific reserved
 * filenames (page.tsx, layout.tsx, route.ts, ...) as routes; a folder
 * full of ordinary component modules and a route subfolder can coexist
 * without conflict.
 */
export default function ComponentEditRoute() {
  return null;
}
