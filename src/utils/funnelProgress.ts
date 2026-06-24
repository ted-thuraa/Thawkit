/**
 * funnelProgress.ts
 *
 * localStorage-backed persistence layer for funnel progress.
 *
 * ── Design principles ──────────────────────────────────────────────────────────
 *  - Every read/write is wrapped in try/catch. localStorage is unavailable in
 *    SSR (Next.js server render) and can be blocked by private browsing or
 *    storage quota limits. All failures are silent — the funnel degrades to a
 *    fresh start rather than crashing.
 *  - Keys are scoped by funnel ID so multiple funnels on the same origin
 *    coexist without key collision.
 *  - PII (leadData: email, name, phone) is intentionally excluded. Only
 *    structural navigation state is persisted.
 *  - `isCompleted` lets initFunnel distinguish "in-progress at step N" from
 *    "completed, show result page" on a hard reload or browser restart.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { FunnelAnswers } from "@/types/PageCMS/pageSchema";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PersistedProgress = {
  /** The pageId the user was on when progress was last saved. */
  currentPageId: string;
  /** Ordered list of previously visited pageIds — rebuilds navigationHistory. */
  navigationHistory: string[];
  /**
   * User's answers keyed by sectionId.
   * Answers for the in-progress page are included (saved on nextStep departure).
   */
  answers: FunnelAnswers;
  /**
   * True when the user has completed the funnel (resolveToResult fired).
   * initFunnel uses this flag to restore isOnResultPage instead of a step page.
   */
  isCompleted: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_PREFIX = "funnel_progress_";

function storageKey(funnelId: string): string {
  return `${STORAGE_PREFIX}${funnelId}`;
}

/**
 * Minimal runtime shape check. Guards against stale data from a previous
 * schema version or a corrupt write (truncated JSON, partial object, etc.).
 */
function isValidProgress(value: unknown): value is PersistedProgress {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.currentPageId === "string" &&
    Array.isArray(p.navigationHistory) &&
    typeof p.answers === "object" &&
    p.answers !== null &&
    typeof p.isCompleted === "boolean"
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Reads saved progress for a funnel from localStorage.
 * Returns null if:
 *  - running on the server (SSR)
 *  - nothing is stored for this funnel
 *  - the stored value cannot be parsed or fails shape validation
 */
export function loadProgress(funnelId: string): PersistedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(funnelId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidProgress(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Writes progress to localStorage.
 * Fails silently if storage is unavailable or quota is exceeded.
 */
export function saveProgress(
  funnelId: string,
  progress: PersistedProgress,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(funnelId), JSON.stringify(progress));
  } catch {
    // Storage quota exceeded or access blocked — degrade silently.
  }
}

/**
 * Removes all saved progress for a funnel.
 * Called explicitly on retake; NOT called on completion (completion sets
 * isCompleted: true so the result page can be restored on refresh).
 */
export function clearProgress(funnelId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(storageKey(funnelId));
  } catch {
    // Fail silently.
  }
}
