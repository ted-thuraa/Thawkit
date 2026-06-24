// src/lib/template-id.ts

/**
 * ── Template ID Naming Convention ──────────────────────────────────────────
 *
 * Every template is identified by a single, machine-parseable string:
 *
 *   {CATEGORY}__{LAYOUT_VARIANT}__{STYLE_VARIANT}__{VERSION}
 *
 * Segments are separated by double underscores (`__`). Single underscores are
 * reserved for multi-word tokens *within* a segment (e.g. `SPLIT_LEFT`,
 * `GRID_4COL`, `SCORE_BREAKDOWN`).
 *
 * ┌─────────────────┬────────────────────────┬──────────────────────────────┐
 * │ Segment         │ Rules                  │ Examples                     │
 * ├─────────────────┼────────────────────────┼──────────────────────────────┤
 * │ CATEGORY        │ UPPER_SNAKE, 2-20 chars│ HEADER, HERO, FEATURES, FAQ, │
 * │                 │                        │ CTA, STATS, QUIZ, RESULT     │
 * ├─────────────────┼────────────────────────┼──────────────────────────────┤
 * │ LAYOUT_VARIANT  │ UPPER_SNAKE, 2-20 chars│ SPLIT_LEFT, CENTERED,        │
 * │                 │                        │ CARD_GRID, GRID_4COL,        │
 * │                 │                        │ SINGLE_STEP, SCORE_BREAKDOWN,│
 * │                 │                        │ STICKY_TOP, SPLIT_RIGHT      │
 * ├─────────────────┼────────────────────────┼──────────────────────────────┤
 * │ STYLE_VARIANT   │ UPPER_SNAKE, 2-20 chars│ LIGHT, DARK                  │
 * ├─────────────────┼────────────────────────┼──────────────────────────────┤
 * │ VERSION         │ vMAJOR_MINOR           │ v1_0, v1_1, v2_0             │
 * └─────────────────┴────────────────────────┴──────────────────────────────┘
 *
 * ── Current canonical IDs ────────────────────────────────────────────────────
 *
 *   HEADER__STICKY_TOP__LIGHT__v1_0       (sticky top nav bar)
 *   HERO__SPLIT_LEFT__LIGHT__v1_0         (two-col: text left, image right)
 *   HERO__CENTERED__LIGHT__v1_0           (centered, no image)
 *   STATS__GRID_4COL__LIGHT__v1_0         (4-col stat tiles)
 *   FEATURES__CARD_GRID__LIGHT__v1_0      (responsive feature card grid)
 *   FAQ__SPLIT_LEFT__LIGHT__v1_0          (two-col: heading+CTA left, accordion right)
 *   FAQ__CENTERED__LIGHT__v1_0            (centered: badge+heading+card accordion)
 *   CTA__SPLIT_RIGHT__DARK__v1_0          (dark card: text left, email form right)
 *   QUIZ__SINGLE_STEP__LIGHT__v1_0        (single question per step)
 *   RESULT__SCORE_BREAKDOWN__LIGHT__v1_0  (overall + category score display)
 *
 * ── Migration from legacy short IDs ─────────────────────────────────────────
 *
 *   hero_1       → HERO__SPLIT_LEFT__LIGHT__v1_0
 *   hero_2       → HERO__CENTERED__LIGHT__v1_0
 *   stats_1      → STATS__GRID_4COL__LIGHT__v1_0
 *   features_1   → FEATURES__CARD_GRID__LIGHT__v1_0
 *   faq_1        → FAQ__SPLIT_LEFT__LIGHT__v1_0
 *   faq_2        → FAQ__CENTERED__LIGHT__v1_0
 *   newsletter_1 → CTA__SPLIT_RIGHT__DARK__v1_0
 *   quiz_1       → QUIZ__SINGLE_STEP__LIGHT__v1_0
 *   result_1     → RESULT__SCORE_BREAKDOWN__LIGHT__v1_0
 *
 * ── Why SUBNICHE is deferred ─────────────────────────────────────────────────
 *
 * The originally-proposed 5-segment convention adds a SUBNICHE dimension
 * (e.g. SAAS, ECOM, AGENCY). All templates currently shipped are
 * subniche-agnostic. Inserting SUBNICHE now would require inventing a
 * placeholder value (GENERIC) for all existing IDs and renaming them a
 * second time once a real subniche-specific variant is built. When the first
 * subniche-specific variant lands, insert SUBNICHE as the second segment and
 * follow the versioning policy below for the migration.
 *
 * ── Versioning policy ────────────────────────────────────────────────────────
 *
 * NON-BREAKING change (color, spacing, copy):
 *   Bump MINOR. Existing funnel payloads continue to render identically.
 *
 * BREAKING change (new/removed/renamed content fields, structural layout shift):
 *   Bump MAJOR. The previous MAJOR ID must be kept as a union member in
 *   `SectionDefinition` (marked @deprecated in JSDoc) so persisted funnel JSON
 *   keeps rendering. Never remove a template_id from the union without a
 *   migration that updates all persisted payloads.
 *
 * ── Layout vocabulary ────────────────────────────────────────────────────────
 *
 * Layout tokens are intentionally shared across categories. A developer who
 * knows HERO__SPLIT_LEFT has strong priors for FAQ__SPLIT_LEFT — same layout
 * DNA, different content shape. The layout vocabulary is a small, bounded,
 * growing set; ad-hoc per-template tokens are not permitted.
 */

// ── Regex ─────────────────────────────────────────────────────────────────────

const SEGMENT = `[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*`;
const VERSION_PATTERN = `v\\d+_\\d+`;

/**
 * Validates the full 4-segment `template_id` format.
 * Used in tests, CI validation scripts, and the builder's save path.
 * NOT called on the hot render path.
 */
export const TEMPLATE_ID_REGEX = new RegExp(
  `^(${SEGMENT})__(${SEGMENT})__(${SEGMENT})__(${VERSION_PATTERN})$`,
);

// ── Valid vocabulary ──────────────────────────────────────────────────────────

/**
 * The bounded set of section categories. Every template_id must start with
 * one of these tokens.
 *
 * Keep in sync with `PageSection["type"]` in pageSchema.ts:
 *   "nav"      ↔ HEADER
 *   "hero"     ↔ HERO
 *   "features" ↔ FEATURES
 *   "faq"      ↔ FAQ
 *   "cta"      ↔ CTA
 *   "stats"    ↔ STATS
 *   "quiz"     ↔ QUIZ
 *   "result"   ↔ RESULT
 */
export const VALID_CATEGORIES = [
  "HEADER",
  "HERO",
  "FEATURES",
  "FAQ",
  "CTA",
  "STATS",
  "QUIZ",
  "RESULT",
] as const;

export type TemplateCategory = (typeof VALID_CATEGORIES)[number];

// ── Parsed representation ─────────────────────────────────────────────────────

export interface ParsedTemplateId {
  category: TemplateCategory;
  layoutVariant: string;
  styleVariant: string;
  version: { major: number; minor: number };
  /** The original raw string, preserved for logging/debugging. */
  raw: string;
}

// ── Error type ────────────────────────────────────────────────────────────────

export class InvalidTemplateIdError extends Error {
  constructor(id: string, reason: string) {
    super(`Invalid template ID "${id}": ${reason}`);
    this.name = "InvalidTemplateIdError";
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Parses and fully validates a `template_id` string.
 *
 * Throws `InvalidTemplateIdError` if:
 *   - The string does not match the 4-segment format.
 *   - The CATEGORY segment is not in `VALID_CATEGORIES`.
 *   - The VERSION segment is syntactically malformed.
 *
 * Intended for use in:
 *   - Unit tests that validate schema fixtures
 *   - CI validation scripts that traverse the template directory tree
 *   - The builder's save-path before persisting a new template record
 *
 * NOT intended for the hot render path — use `isValidTemplateId` there.
 */
export function parseTemplateId(id: string): ParsedTemplateId {
  const match = TEMPLATE_ID_REGEX.exec(id);
  if (!match) {
    throw new InvalidTemplateIdError(
      id,
      "must match {CATEGORY}__{LAYOUT_VARIANT}__{STYLE_VARIANT}__{vMAJOR_MINOR}",
    );
  }

  const [, category, layoutVariant, styleVariant, versionRaw] = match;

  if (!VALID_CATEGORIES.includes(category as TemplateCategory)) {
    throw new InvalidTemplateIdError(
      id,
      `unknown category "${category}". Valid categories: ${VALID_CATEGORIES.join(", ")}`,
    );
  }

  // Safe to assert: TEMPLATE_ID_REGEX already guarantees `v\d+_\d+` shape.
  const [, major, minor] = /^v(\d+)_(\d+)$/.exec(versionRaw)!;

  return {
    category: category as TemplateCategory,
    layoutVariant,
    styleVariant,
    version: { major: Number(major), minor: Number(minor) },
    raw: id,
  };
}

/**
 * Lightweight shape-only check. Does NOT validate the category against
 * `VALID_CATEGORIES` — use `parseTemplateId` for that.
 *
 * Suitable for runtime guards where throwing is undesirable.
 */
export function isValidTemplateId(id: string): boolean {
  return TEMPLATE_ID_REGEX.test(id);
}
