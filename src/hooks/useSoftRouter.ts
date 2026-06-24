// hooks/useSoftRouter.ts
"use client";

/**
 * useSoftRouter
 *
 * Bridges the Zustand store's navigation state with the browser's URL bar.
 *
 * ── Why window.history.pushState and NOT router.push() ────────────────────────
 * router.push() triggers a full Next.js client-side navigation: it fetches a
 * new RSC payload for the target URL and reconciles the Client Component tree.
 * Even within the same [[...slug]] catch-all segment this causes page.tsx (a
 * Server Component) to re-render, which can remount FunnelContainer and fire
 * entry animations a second time — the "double-mount" bug.
 *
 * window.history.pushState() is a shallow update: it changes the URL bar and
 * notifies usePathname() subscribers, but does NOT trigger the Next.js
 * navigation pipeline, does NOT fetch a new RSC payload, and does NOT remount
 * any Client Component. This is the correct primitive for a SPA whose URL is
 * informational rather than the authoritative source of navigation truth.
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ── Effect responsibilities (post-persistence refactor) ───────────────────────
 *
 * Effect 1 — URL sync: pushes a URL whenever currentPageId or isOnResultPage
 *   changes. This is the SOLE mechanism for updating the browser URL after any
 *   navigation action in the store. It runs after every render where these
 *   values change, including:
 *     • Forward navigation (nextStep)        → push step URL
 *     • Backward navigation (prevStep)       → push previous step URL
 *     • Funnel completion (resolveToResult)  → push result page URL
 *     • Restored completion (initFunnel A)   → push result page URL
 *     • Restored in-progress (initFunnel B)  → push restored step URL
 *     • Fresh start (initFunnel C)           → push firstPage URL
 *       (this is the "redirect to main page" when no progress was recoverable)
 *
 * Effect 2 (REMOVED) — URL→store restoration: previously called goToStep when
 *   the URL slug matched a page that didn't match currentPageId. This was
 *   needed before localStorage was introduced because initFunnel always reset
 *   to firstPage, ignoring the URL. After the refactor, initFunnel restores
 *   from localStorage and sets the correct currentPageId directly — Effect 1
 *   then syncs the URL. Effect 2 was therefore redundant, and worse, it fought
 *   initFunnel: if initFunnel legitimately restored Step 5 (from localStorage)
 *   but the user's URL was /stepper/ (the return-to-funnel scenario), Effect 2
 *   would call goToStep(mainPage) and undo the localStorage restore. Removed.
 *
 * Effect 3 — popstate: syncs store state when the user presses the browser's
 *   native back/forward buttons. Unchanged — browser history traversal is the
 *   only event that fires popstate and this correctly restores by pageId.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useFunnelStore } from "@/stores/funnelStore/store";

export function useSoftRouter() {
  const pathname = usePathname();

  const currentPageId = useFunnelStore((s) => s.currentPageId);
  const isOnResultPage = useFunnelStore((s) => s.isOnResultPage);
  const schema = useFunnelStore((s) => s.schema);
  const goToStep = useFunnelStore((s) => s.goToStep);

  // ── Effect 1: Sync URL whenever navigation state changes ───────────────────
  //
  // Handles two cases:
  //
  // Case A — Normal step navigation (currentPageId is set):
  //   Finds the page's slug and pushes it if the URL doesn't already match.
  //   The pageId is stored in history state for reliable popstate restoration.
  //
  // Case B — Result page (isOnResultPage is true, currentPageId may be null):
  //   Finds the result page's slug and pushes it. This covers:
  //   • Normal completion (resolveToResult already pushed, this is a no-op)
  //   • Restored completion on refresh (initFunnel Branch A sets isOnResultPage
  //     but does not push a URL — this effect does it)
  //
  // Note: pathname is intentionally excluded from deps. If included, the effect
  // would re-fire after pushState updates usePathname(), creating a redundant
  // loop. The guard `pathname !== targetSlug` uses the closure-captured value
  // (pre-push), which is exactly what's needed to decide whether to push.
  useEffect(() => {
    if (!schema) return;

    if (isOnResultPage) {
      // Case B: ensure URL reflects the result page.
      const resultPage = schema.pages.find((p) => p.pageType === "result_page");
      if (resultPage && pathname !== resultPage.slug) {
        window.history.pushState({}, "", resultPage.slug);
      }
      return;
    }

    if (!currentPageId) return;

    // Case A: sync URL to the current step page.
    const targetPage = schema.pages.find((p) => p.id === currentPageId);
    if (!targetPage) return;

    if (pathname !== targetPage.slug) {
      window.history.pushState(
        { pageId: currentPageId }, // stored for reliable popstate restoration
        "",
        targetPage.slug,
      );
    }
  }, [currentPageId, isOnResultPage, schema]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 3: Sync store from browser back / forward button ────────────────
  //
  // window.history.pushState() does NOT fire popstate — only genuine browser
  // history traversal (back/forward buttons) does. This effect therefore never
  // creates an infinite loop with Effect 1.
  //
  // Restoration priority:
  //   1. event.state.pageId — set by Effect 1; survives slug renames.
  //   2. pathname fallback  — covers history entries created before this hook
  //      was in place (e.g. entries created by router.push() in older sessions).
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!schema) return;

      // ── Priority 1: read pageId directly from history state ───────────────
      const statePageId = (event.state as { pageId?: string } | null)?.pageId;
      if (statePageId) {
        goToStep(statePageId);
        return;
      }

      // ── Priority 2: match current pathname against page registry ──────────
      const matchedPage = schema.pages.find(
        (p) =>
          p.slug === window.location.pathname && p.pageType !== "result_page",
      );
      if (matchedPage) {
        goToStep(matchedPage.id);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [schema, goToStep]); // eslint-disable-line react-hooks/exhaustive-deps
}
