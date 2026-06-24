// src/types/PageCMS/pageSchema.ts

// ================================================================
// SECTION 1: PRIMITIVE / REUSABLE TYPES
// ================================================================

/**
 * The destination of a resolved branch rule.
 * "page"              → navigate to a specific page by ID within the funnel.
 * "external_redirect" → leave the funnel entirely; partial submission is
 *                       persisted before redirect (handled in submitFunnel).
 */
export type BranchTarget =
  | { type: "page"; pageId: string }
  | { type: "external_redirect"; url: string };

/**
 * A single atomic condition. Discriminated on `type` so the evaluator
 * is exhaustively type-safe and requires no runtime casting.
 *
 * score_above / score_below require a pre-computed FunnelScoreResult to be
 * passed into evaluateBranchCondition()/evaluateBranchPredicate(). Mini-result
 * score brackets always supply one (see partialScoreUpTo() in the store).
 * Section-level branchRules (navigation, resolveNextPageId) do not currently
 * supply scores, so these conditions evaluate to false there — wiring live
 * scores into navigation-time branching is a follow-up (architecture roadmap
 * Module 4/5).
 */
export type BranchCondition =
  | {
      type: "option_selected" | "option_not_selected";
      /** section.id whose answer slot to inspect */
      sectionId: string;
      /** Predicate passes if ANY of these option IDs match the condition */
      optionIds: string[];
    }
  | {
      type: "score_above" | "score_below";
      /** 0–100 integer threshold */
      threshold: number;
      /**
       * Optional category scope. When provided, the condition is evaluated
       * against that category's score (CategoryScoreResult.score). When
       * omitted, the condition is evaluated against the overall score.
       * Shared by section branchRules (navigation) and mini-result score
       * brackets — one predicate grammar, per the platform's "single
       * expression language" principle (architecture roadmap Module 5/9).
       */
      categoryId?: string;
    };

export type BranchPredicate = {
  /** Logical combinator across all conditions. Default: "AND" */
  operator: "AND" | "OR";
  conditions: BranchCondition[];
};

/**
 * A compiled if-then routing rule stored on a section.
 * Rules are evaluated in descending priority order; the first match wins.
 */
export type BranchRule = {
  id: string;
  predicate: BranchPredicate;
  target: BranchTarget;
  /** Higher value = evaluated first. Default: 0 */
  priority?: number;
};

/**
 * An operator-configurable score range with a label and display color.
 * Assigned to the overall score and to each category score during scoring
 * (see resolveScoreTier() / computeFunnelScore() in helpers.ts).
 *
 * Ranges are defined inclusive on both ends and are expected to be
 * contiguous and non-overlapping across 0–100 (e.g. 0–33 / 34–66 / 67–100),
 * though resolveScoreTier() degrades gracefully — nearest-tier fallback —
 * if a funnel's authored tiers leave a gap, so a score is never left
 * unlabeled in production even from a malformed config.
 *
 * Cardinality (content-authoring constraint, not yet enforced at runtime —
 * the visual funnel builder, architecture roadmap Module 3, is the natural
 * place to validate this once it exists): every funnel has at least 1 tier
 * (a single 0–100 band) and at most 10 (e.g. ten 10-point bands).
 *
 * `color` must be a 6-digit hex string (e.g. "#22c55e") — TierBadge in
 * result.tsx appends an alpha suffix to it directly for the tint background.
 */
export type ScoreTier = {
  id: string;
  label: string;
  color: string; // 6-digit hex, e.g. "#22c55e"
  score_from: number; // inclusive, 0–100
  score_to: number; // inclusive, 0–100
};

/**
 * Per-question scoring detail, retained alongside the category/overall
 * roll-ups produced by computeFunnelScore(). Populated for EVERY quiz
 * section the engine iterates — including non-scoreable question types
 * (short_text, long_text, number, scale), which carry score 0/0 but still
 * expose `title`/`answerLabel` for personalization purposes (see
 * lib/personalization/buildContext.ts, which is the sole consumer of this
 * field at present).
 */
export type QuestionScoreResult = {
  sectionId: string;
  title: string;
  /** Human-readable resolved answer — selected option title(s) for choice
   *  questions (comma-joined for multi-select), or the raw stored value
   *  (stringified) for text/number/scale questions. Empty string if
   *  unanswered. */
  answerLabel: string;
  earnedPoints: number;
  maxPoints: number;
};

/**
 * Returned by calculateScores() / partialScoreUpTo(). Stored in the Zustand
 * state so the ResultPage component can display a rich breakdown without
 * re-computing, and passed directly into mini-result bracket resolution.
 */
export type CategoryScoreResult = {
  categoryId: string;
  categoryTitle: string;
  categoryIcon: string;
  earnedPoints: number;
  maxPoints: number;
  score: number; // 0–100, rounded integer
  /**
   * The score tier this category's score falls into, resolved against the
   * funnel's `scoreTiers` (or DEFAULT_SCORE_TIERS when unset). Null only
   * when the funnel was authored with zero tiers — see resolveScoreTier().
   */
  tier: ScoreTier | null;
};

export type FunnelScoreResult = {
  overallScore: number; // 0–100
  /** The score tier the overall score falls into. See CategoryScoreResult.tier. */
  overallTier: ScoreTier | null;
  categoryScores: CategoryScoreResult[];
  /**
   * Per-question detail for every quiz section traversed in this scoring
   * pass. Source of truth for the personalization system's Question
   * Variables (lib/personalization/buildContext.ts) — built in the SAME
   * traversal as categoryScores, no second pass over sections.
   */
  questionScores: QuestionScoreResult[];
  uncategorizedScore: number; // 0–100, aggregate of uncategorized Qs
  uncategorizedEarnedPoints: number;
  uncategorizedMaxPoints: number;
};

// ================================================================
// SECTION 1.5: FUNNEL THEMING SYSTEM
// ================================================================

/**
 * A background source for the page or a card. `type` discriminates how
 * `value` is interpreted by ThemeProvider:
 *  - "color" → a hex/rgba string, applied as `backgroundColor`.
 *  - "image" → a URL, applied as a `background-image` layer over the
 *              `--tk-*-bg` colour fallback (shown while the image loads).
 *  - "video" → a URL, rendered as a muted/autoplay/loop <video> layer over
 *              the same colour fallback.
 * Media (image/video) always takes visual precedence over the colour value
 * when present — the colour is retained purely as the loading-state fallback.
 */
export type BackgroundConfig = {
  type: "color" | "image" | "video";
  value: string;
};

export interface FunnelThemeColors {
  page_background: BackgroundConfig;
  /** Optional — falls back to page_background's resolved colour if absent. */
  card_background?: BackgroundConfig;
  text: {
    heading: string; // hex/rgba
    body: string; // hex/rgba
    link: string; // hex/rgba
  };
}

export interface FunnelThemePalette {
  /** Dominant brand colour — primary buttons, key highlights, active states. */
  primary_accent: string;
  /** Supporting colour — secondary buttons, outline CTAs, alt accents. */
  secondary_accent: string;
}

export interface FunnelThemeFontToken {
  family: string; // e.g. "Manrope" — must be a valid Google Fonts family name
  weight: string; // e.g. "600" — CSS font-weight value
}

export interface FunnelThemeTypography {
  headings: FunnelThemeFontToken;
  body: FunnelThemeFontToken;
}

/**
 * The full theme configuration for a funnel. Stored at `funnelPayloadSchema.theme`.
 * Optional at the schema level — funnels with no theme fall back entirely to
 * THEME_DEFAULTS in themeUtils.ts (zero visual regression for un-themed funnels).
 */
export interface FunnelTheme {
  colors: FunnelThemeColors;
  palette: FunnelThemePalette;
  typography: FunnelThemeTypography;
}

/**
 * A call-to-action button or link.
 * `variant` is a design-system token resolved by the renderer.
 */
interface CallToAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  open_in_new_tab?: boolean;
  icon_id?: string; // optional trailing icon, e.g. "arrow_right"
}

/**
 * A normalized image asset. Always store the CDN/storage URL,
 * never a relative path. Width/height enable layout shift prevention.
 */
interface ImageAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  focal_point?: "center" | "top" | "bottom" | "left" | "right";
}

/**
 * Full SEO configuration for a page.
 */
interface SEO_Metadata {
  title: string; // rendered as <title> and used in generateMetadata
  description: string; // meta description
  og_image?: ImageAsset; // Open Graph image
  canonical_url?: string;
  keywords?: string[];
  robots?: string; // e.g., "index, follow"
  schema_org_type?: string; // e.g., "WebPage", "FAQPage"
}

/**
 * A small labeled badge, optionally with a leading icon.
 */
interface Badge {
  label: string;
  icon_id?: string; // e.g., "help_circle", "star"
  variant?: "default" | "success" | "warning" | "info";
}

/**
 * A single statistic tile.
 */
interface StatItem {
  value: string; // e.g., "95%", "10M+", "$10m"
  label: string;
}

/**
 * A single feature card.
 * `icon_id` maps to an icon in the front-end registry.
 */
interface FeatureItem {
  icon_id: string; // e.g., "layout_grid", "lock", "users"
  title: string;
  description: string;
}

/**
 * A single FAQ entry.
 */
interface FAQItem {
  id: string; // stable key for accordion state
  question: string;
  answer: string;
}

/**
 * Navigation link for headers/footers.
 */
interface NavLink {
  label: string;
  href: string;
  children?: NavLink[]; // supports dropdown menus
}

/**
 * Logo configuration. Supports both icon-based and image-based logos.
 * Exactly one of `icon_id` or `image` should be provided.
 */
interface LogoConfig {
  brand_name: string;
  icon_id?: string; // e.g., "hexagon" — rendered by icon registry
  icon_bg_color?: string; // e.g., "#2563eb"
  image?: ImageAsset; // full image logo (overrides icon)
}

// ================================================================
// SECTION 2: SECTION-LEVEL CONFIGURATION
// ================================================================

/**
 * Visual overrides that can be applied to ANY section.
 * These are the ONLY layout/visual knobs stored in the DB.
 */
interface SectionConfig {
  background_color?: string; // e.g., "#ffffff", "#0b3d36"
  background_image?: ImageAsset;
  padding_top?: "none" | "sm" | "md" | "lg" | "xl";
  padding_bottom?: "none" | "sm" | "md" | "lg" | "xl";
  full_bleed?: boolean; // whether section ignores max-width container
}

// ================================================================
// SECTION 3: CONTENT INTERFACES (one per template_id)
//
// Naming convention for content interfaces:
//   The TypeScript interface name is derived from the template's CATEGORY
//   and a short human-readable descriptor, NOT from the full template_id
//   string. This keeps interface names concise while the template_id string
//   carries the full semantic dimension.
//
//   template_id: "HEADER__STICKY_TOP__LIGHT__v1_0"  → Header1Content
//   template_id: "HERO__SPLIT_LEFT__LIGHT__v1_0"    → Hero1Content
//   template_id: "HERO__CENTERED__LIGHT__v1_0"      → Hero2Content
//   template_id: "STATS__GRID_4COL__LIGHT__v1_0"    → Stats1Content
//   template_id: "FEATURES__CARD_GRID__LIGHT__v1_0" → Features1Content
//   template_id: "FAQ__SPLIT_LEFT__LIGHT__v1_0"     → Faq1Content
//   template_id: "FAQ__CENTERED__LIGHT__v1_0"       → Faq2Content
//   template_id: "CTA__SPLIT_RIGHT__DARK__v1_0"     → Newsletter1Content
//   template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0"   → Quiz1Content
//   template_id: "MINIRESULT__SINGLE_STEP__LIGHT__v1_0" → MiniResult1Content
//   template_id: "RESULT__SCORE_BREAKDOWN__LIGHT__v1_0" → ResultPageContent
//   template_id: "DETAILEDCATEGORYRESULTS__CARD_GRID__LIGHT__v1_0"
//                                                    → DetailedCategoryResultsContent
// ================================================================

// ----------------------------------------------------------------
// template_id: "HEADER__STICKY_TOP__LIGHT__v1_0"
// Layout: sticky top bar | logo | nav links | primary + secondary CTAs
// ----------------------------------------------------------------
interface Header1Content {
  logo: LogoConfig;
  nav_links: NavLink[];
  primary_cta: CallToAction;
  secondary_cta?: CallToAction;
}

// ----------------------------------------------------------------
// template_id: "HERO__SPLIT_LEFT__LIGHT__v1_0"
// Layout: two-column | text (left) + image (right)
// ----------------------------------------------------------------
export interface Hero1Content {
  eyebrow?: string; // small text above heading
  rating_badge?: {
    score: string; // e.g., "4.97/5"
    label: string; // e.g., "reviews"
  };
  heading: string;
  subtext: string;
  primary_cta: CallToAction;
  secondary_cta?: CallToAction;
  image: ImageAsset;
}

// ----------------------------------------------------------------
// template_id: "HERO__CENTERED__LIGHT__v1_0"
// Layout: centered text | badge | heading | subtext | CTAs | no image
// ----------------------------------------------------------------
interface Hero2Content {
  badge?: Badge;
  heading: string;
  subtext: string;
  primary_cta: CallToAction;
  secondary_cta?: CallToAction;
}

// ----------------------------------------------------------------
// template_id: "STATS__GRID_4COL__LIGHT__v1_0"
// Layout: heading (left) + subtext + 4-column stats grid
// ----------------------------------------------------------------
interface Stats1Content {
  heading: string;
  subtext?: string;
  stats: StatItem[]; // recommended: 4 items for a 4-col grid
}

// ----------------------------------------------------------------
// template_id: "MINIRESULT__SINGLE_STEP__LIGHT__v1_0"
// Layout: progressive, in-funnel result snippet | dynamic heading/subtext
// resolved from the answers/scores collected up to this point in the funnel
// ----------------------------------------------------------------

/**
 * A single conditional content variant for a mini-result section.
 *
 * Brackets are evaluated in descending `priority` order; the first bracket
 * whose `predicate` matches the partial answer/score state wins. Exactly one
 * bracket in the array should omit `predicate` — that bracket is the
 * catch-all fallback, guaranteed to render when no conditional bracket
 * matches (and is always evaluated last, regardless of its position in the
 * array or its `priority` value).
 *
 * Reuses `BranchPredicate`/`BranchCondition` — the same compound predicate
 * grammar used by section-level `branchRules` for navigation — so a single,
 * consistent expression language covers both routing and content brackets,
 * per the architecture roadmap's Module 5/9 guidance.
 */
export type ScoreBracketContent = {
  /** Stable id — React key, debugging, and future builder-canvas reference. */
  id: string;
  /** Omit to mark this bracket as the fallback/default variant. */
  predicate?: BranchPredicate;
  /** Higher = evaluated first among predicated brackets. Default: 0. */
  priority?: number;
  icon?: string; // emoji or design-system icon_id
  heading: string;
  subtext?: string;
};

export interface MiniResult1Content {
  /** Small static label above the dynamic heading, e.g. "Your progress so far" */
  eyebrow?: string;
  /**
   * Conditional content variants, evaluated against the answers/scores
   * collected from quiz sections the respondent has actually traversed so
   * far in the funnel (NOT the full funnel — questions positioned later in
   * the sequence are excluded even if scored elsewhere). See
   * partialScoreUpTo() in the Zustand store for the exact scoping logic.
   */
  brackets: ScoreBracketContent[];
  goForward_cta?: CallToAction;
  goBack_cta?: CallToAction;
}

// ----------------------------------------------------------------
// template_id: "FEATURES__CARD_GRID__LIGHT__v1_0"
// Layout: centered header + responsive card grid
// ----------------------------------------------------------------
interface Features1Content {
  badge?: Badge;
  heading: string;
  subtext?: string;
  features: FeatureItem[]; // flexible count; renderer controls grid cols
}

// ----------------------------------------------------------------
// template_id: "FAQ__SPLIT_LEFT__LIGHT__v1_0"
// Layout: two-column | left (heading + subtext + CTA) | right (accordion)
// ----------------------------------------------------------------
interface Faq1Content {
  heading: string;
  subtext: string;
  more_faqs_cta?: CallToAction;
  faqs: FAQItem[];
  default_open_id?: string; // e.g., "item-1" — which accordion opens by default
}

// ----------------------------------------------------------------
// template_id: "FAQ__CENTERED__LIGHT__v1_0"
// Layout: centered | badge + heading + subtext + card-style accordion
// ----------------------------------------------------------------
interface Faq2Content {
  badge: Badge;
  heading: string;
  subtext: string;
  faqs: FAQItem[];
}

// ----------------------------------------------------------------
// template_id: "CTA__SPLIT_RIGHT__DARK__v1_0"
// Layout: dark card | text (left) + email form (right)
// ----------------------------------------------------------------
interface Newsletter1Content {
  heading: string;
  subtext: string;
  form_eyebrow?: string; // e.g., "Stay up to date"
  input_placeholder?: string; // e.g., "Enter your email"
  submit_label: string; // e.g., "Subscribe"
  privacy_notice?: string; // e.g., "By subscribing you agree to our"
  privacy_policy_cta?: CallToAction;
}

// ----------------------------------------------------------------
// template_id: "RESULT__SCORE_BREAKDOWN__LIGHT__v1_0"
// Layout: score display | overall score + per-category breakdown + CTAs
// ----------------------------------------------------------------
export interface ResultPageContent {
  heading: string;
  subtext?: string;
  /** Label rendered above the numeric score, e.g. "Your readiness score" */
  scoreLabel?: string;
  retakeCta?: { label: string };
  /**
   * Supports `{{first_name}}` interpolation at render time using leadData.
   * e.g. "{{first_name}}, here are your results 🎯"
   */
  welcome_message?: string;
}

// ----------------------------------------------------------------
// template_id: "DETAILEDCATEGORYRESULTS__CARD_GRID__LIGHT__v1_0"
// Layout: one personalized content card per funnel category | title +
// percentage + a long-form, token-driven paragraph DEDICATED to that category
// ----------------------------------------------------------------

/**
 * A single category's dedicated card body. Authored specifically for ONE
 * category — its `contentTemplate` is expected to reference the question(s)
 * that actually belong to that category (via `question.<sectionId>.*`
 * tokens), not a generic, category-agnostic paragraph. This is what makes
 * each card feel genuinely tailored rather than templated-and-substituted.
 */
export type CategoryResultContent = {
  /**
   * Free-text, ≥300-word recommended length. Supports the full
   * personalization token grammar — question.*, category.current.* (bound
   * to THIS category when this template renders), global.*, and bare lead
   * tokens (e.g. {{first_name}}). See lib/personalization/engine.ts.
   */
  contentTemplate: string;
};

/**
 * `detailedCategoryResults` content. One card is rendered for EVERY entry in
 * `funnelPayloadSchema.questionCategories` — the category list (not this
 * content block) determines how many cards exist and in what order.
 *
 * `categoryContent` is keyed by `QuestionCategory.id` and is the PRIMARY
 * authoring surface: each category is expected to have its own dedicated
 * entry, written specifically for that category's own questions and
 * narrative — not a single shared paragraph reused across categories.
 *
 * `fallbackTemplate` exists purely as a defensive guard against
 * category-list drift (e.g. a category added to `questionCategories` after
 * this section was last authored, with no matching `categoryContent` entry
 * yet) — it is not the intended default authoring path, and a well-authored
 * section should have a `categoryContent` entry for every category.
 */
export interface DetailedCategoryResultsContent {
  heading?: string;
  subtext?: string;
  /** Per-category dedicated content, keyed by QuestionCategory.id. */
  categoryContent: Record<string, CategoryResultContent>;
  /** Optional safety-net template, used only when a category has no entry
   * in `categoryContent`. */
  fallbackTemplate?: string;
}

/**
 * A first-class category entity stored in the funnel root.
 * Quiz sections reference categories by ID only (foreign-key pattern),
 * keeping display data in one place — easy for an AI agent to enumerate
 * all valid IDs before generating section content.
 */
export type QuestionCategory = {
  id: string; // e.g. "risk_tolerance"
  title: string; // e.g. "Risk Tolerance"
  description: string; // e.g. "How comfortable are you with volatility?"
  icon: string; // emoji or design-system icon_id
};

/**
 * - string[]  → selected option IDs for single_choice / multiple_choice
 * - string    → free-text answer for short_text / long_text
 * - number    → numeric value for number / scale inputs
 */
export type QuizAnswer = string[] | string | number;

/** Keyed by sectionId */
export type FunnelAnswers = Record<string, QuizAnswer>;

// ─── Question Types ───────────────────────────────────────────────────────────

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "short_text"
  | "long_text"
  | "number"
  | "scale";

// ----------------------------------------------------------------
// template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0"
// Layout: one question per step with forward/back navigation
// ----------------------------------------------------------------
export interface QuizOptions {
  id: string;
  title: string;
  description: string;
  icon?: string;
  score: number;
  branchTarget?: BranchTarget;
}

export interface Quiz1Content {
  questionType: QuestionType;
  categoryIds?: string[];
  quizHeading: string;
  quizSubtext?: string;
  quizOptions?: QuizOptions[];
  goForward_cta?: CallToAction;
  goBack_cta?: CallToAction;
  placeholder?: string;
  config?: {
    scaleMin?: number;
    scaleMax?: number;
    scaleMinLabel?: string;
    scaleMaxLabel?: string;
  };
  branchRules?: BranchRule[];
}

// ================================================================
// SECTION 4: LEAD FORM CONFIG
// ================================================================

/**
 * All field types the funnel creator can add to the lead capture form.
 * The `email` field is always present and non-removable; every other
 * type is optional and fully label/required-configurable.
 */
export type LeadFieldType =
  | "email" // always present; renders as <input type="email">
  | "first_name" // renders as <input type="text">
  | "last_name" // renders as <input type="text">
  | "phone" // renders as <input type="tel">
  | "country" // renders as <select>; options from field.options
  | "industry" // renders as <select>; options from field.options
  | "custom_number" // renders as <input type="number">
  | "custom_checkbox" // renders as a styled toggle checkbox
  | "custom_dropdown" // renders as <select>; options from field.options
  | "custom_text"; // renders as <input type="text">

export interface LeadFormFieldOption {
  value: string;
  label: string;
}

export interface LeadFormField {
  /** Stable, unique key — doubles as the key in `leadData`. */
  id: string;
  type: LeadFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  /** Used by: country | industry | custom_dropdown */
  options?: LeadFormFieldOption[];
  /** Inline label text for custom_checkbox (shown beside the toggle). */
  checkboxLabel?: string;
}

export interface LeadFormConfig {
  /** Master switch. When false the form is never shown. */
  enable_lead_signup: boolean;
  /**
   * When true  → user must submit the form to reach the result page.
   * When false → a "Skip" link is rendered below the submit button.
   */
  lead_signup_required: boolean;
  heading?: string;
  subtext?: string;
  submit_label?: string;
  skip_label?: string;
  /** Short trust/privacy notice displayed below the form fields. */
  privacy_notice?: string;
  fields: LeadFormField[];
}

/**
 * Shape of the collected lead data stored in the Zustand store.
 * Keys match each `LeadFormField.id`; values are typed after conversion
 * from the raw HTML string inputs.
 */
export type LeadData = Record<string, string | boolean | number>;

// ================================================================
// SECTION 4.5: CALCULATION ENGINE TYPES
// ================================================================
//
// These types define operator-authored formula trees that the frontend
// evaluates at submission time to produce named numeric results
// (e.g. MRR, ROI, churn-adjusted ARR). Results are exposed as
// {{calc.variable_id}} tokens on the result page.
//
// The formula is stored as a recursive AST rather than a string so:
//  - No runtime parser or `eval()`-style execution is needed.
//  - A future visual builder can serialise its tree model 1:1.
//  - Structural errors (dangling refs, cycles) are detectable at
//    schema-load time, not mid-evaluation.
// ================================================================

// ─── Primitive operators ──────────────────────────────────────────────────────

export type ArithOp = "+" | "-" | "*" | "/" | "%" | "**";
export type UnaryOp = "negate" | "abs" | "floor" | "ceil" | "round" | "sqrt";

// ─── Condition node (used by the "conditional" expression) ────────────────────

export type CalcCondition = {
  operator: ">" | ">=" | "<" | "<=" | "==" | "!=";
  left: CalcExpression;
  right: CalcExpression;
};

// ─── How a numeric value is extracted from a quiz answer ─────────────────────

/**
 * Determines how `answer_ref` nodes extract a number from the answer store:
 *
 * "value"           — Direct numeric answer (for `number` / `scale` question types).
 *                     Absent or non-numeric answer → null.
 * "score_sum"       — Sum of the `score` field for each selected option ID.
 *                     Valid for `single_choice` and `multiple_choice`.
 * "score_max"       — Maximum achievable score for the question (useful as a
 *                     denominator when normalising to a percentage).
 * "selection_count" — Integer count of selected option IDs.
 */
export type AnswerTransform =
  | "value"
  | "score_sum"
  | "score_max"
  | "selection_count";

// ─── Recursive AST node union ─────────────────────────────────────────────────

/**
 * A single node in the formula tree. Discriminated on `type`.
 *
 * Leaf nodes   : literal, answer_ref, calc_ref
 * Internal nodes: binary_op, unary_op, conditional
 *
 * Depth is unbounded — any CalcExpression may appear at any position.
 */
export type CalcExpression =
  // ── Leaf nodes ──────────────────────────────────────────────────────────────
  /** A hard-coded numeric constant. */
  | { type: "literal"; value: number }
  /** Extracts a number from a respondent's quiz answer. */
  | { type: "answer_ref"; sectionId: string; transform: AnswerTransform }
  /** References the already-resolved value of another CalcVariable. */
  | { type: "calc_ref"; calcId: string }

  // ── Internal nodes ──────────────────────────────────────────────────────────
  /** Standard arithmetic: left [op] right. */
  | {
      type: "binary_op";
      operator: ArithOp;
      left: CalcExpression;
      right: CalcExpression;
    }
  /** Unary math function applied to a single operand. */
  | { type: "unary_op"; operator: UnaryOp; operand: CalcExpression }
  /** If–then–else branching. Only the taken branch is evaluated. */
  | {
      type: "conditional";
      condition: CalcCondition;
      consequent: CalcExpression;
      alternate: CalcExpression;
    };

// ─── Display / formatting config ──────────────────────────────────────────────

/**
 * Controls how a resolved `number` is formatted when rendered as a
 * `{{calc.variable_id}}` token. All formatting is performed via
 * `Intl.NumberFormat` — no custom format strings.
 */
export interface CalcDisplayConfig {
  /** How the number is displayed. "integer" forces decimal_places to 0. */
  format: "number" | "currency" | "percentage" | "integer";
  /** Intl.NumberFormat locale tag. Default: "en-US". */
  locale?: string;
  /** ISO 4217 code — required when format is "currency". e.g. "USD". */
  currency_code?: string;
  /** Decimal places to render. Default: 0 for integer, 2 for others. */
  decimal_places?: number;
  /** Prepended after numeric formatting, e.g. "~". */
  prefix?: string;
  /** Appended after numeric formatting, e.g. "/mo". */
  suffix?: string;
  /** Applied to the raw value before formatting. e.g. 100 to display 0.15 as "15%". */
  multiplier?: number;
  /**
   * When false, the variable is hidden from the CalcResultsPanel on the result
   * page (useful for internal tier/classifier variables). Still accessible
   * as a {{calc.*}} token in template strings. Default: true.
   */
  visible_on_result?: boolean;
}

// ─── Variable definition ──────────────────────────────────────────────────────

/**
 * A single named calculation result. The formula is evaluated once at
 * submission time; the result is stored in Zustand as `calcResults[id]`
 * and exposed as a `{{calc.id}}` token on the result page.
 */
export interface CalcVariable {
  /** Token key: "mrr_estimate" → {{calc.mrr_estimate}} */
  id: string;
  /** Human-readable label shown in the CalcResultsPanel. */
  label: string;
  /** Optional: explains the formula intent to operators. */
  description?: string;
  /**
   * Read-only friendly formula string for builder UI display — e.g. "MAU × ARPU × 12".
   * The evaluation engine never reads this field.
   */
  display_formula?: string;
  /** The formula tree to evaluate. */
  expression: CalcExpression;
  /** Formatting rules for the rendered token value. */
  display: CalcDisplayConfig;
  /** Displayed when evaluation returns null (missing answer, division by zero, etc.). */
  error_fallback?: string;
}

/** Root container stored at `funnelPayloadSchema.calculations`. */
export interface FunnelCalculations {
  /**
   * Variables must be declared in dependency order: a variable that
   * references another via `calc_ref` must appear after the referenced one.
   * The engine validates and topologically sorts, but declaration order
   * is the canonical convention.
   */
  variables: CalcVariable[];
}

// ─── Result state types (stored in Zustand after evaluation) ─────────────────

export type CalcError =
  | "DivisionByZero"
  | "InvalidInput"
  | "CircularDependency"
  | "MissingAnswer"
  | "UnknownCalcRef"
  | "SchemaValidationFailed";

export type CalcResultEntry = {
  /** Raw resolved number. null when evaluation failed at any node. */
  value: number | null;
  /** Intl-formatted display string, or error_fallback when value is null. */
  formatted: string;
  /** Only set for cycle members (CircularDependency). Runtime null-propagation
   *  errors are silent — the error_fallback handles the display case. */
  error?: CalcError;
};

/** keyed by CalcVariable.id */
export type CalcResults = Record<string, CalcResultEntry>;

// ================================================================
// SECTION 5: DISCRIMINATED UNION + SECTION WRAPPER
// ================================================================

/**
 * Discriminated union keyed on `template_id`.
 *
 * Template IDs follow the convention: {CATEGORY}__{LAYOUT_VARIANT}__{STYLE_VARIANT}__{VERSION}
 * See src/lib/template-id.ts for the full specification.
 *
 * ── Exhaustiveness guarantee ─────────────────────────────────────────────────
 * `SectionTypeRenderer` in sectionRenderer.tsx switches on `template_id` and
 * calls `assertNever()` in its `default` branch. This means:
 *
 *   Adding a new union member HERE without adding the corresponding `case` in
 *   sectionRenderer.tsx produces a TypeScript compile error.
 *
 * This is the primary mechanism that prevents silent "section renders nothing"
 * bugs when new templates are added to the schema.
 *
 * ── Versioning ───────────────────────────────────────────────────────────────
 * When a template's content shape changes in a BREAKING way (renamed/removed
 * fields), bump the MAJOR version, add a NEW union member with the new
 * template_id, and keep the OLD union member below (marked @deprecated) so
 * that persisted funnel payloads continue to render. Never remove a member
 * unless all stored payloads referencing it have been migrated.
 */
type SectionDefinition =
  // ── Nav ──────────────────────────────────────────────────────────────────
  | {
      template_id: "HEADER__STICKY_TOP__LIGHT__v1_0";
      content: Header1Content;
    }
  // ── Hero ─────────────────────────────────────────────────────────────────
  | {
      template_id: "HERO__SPLIT_LEFT__LIGHT__v1_0";
      content: Hero1Content;
    }
  | {
      template_id: "HERO__CENTERED__LIGHT__v1_0";
      content: Hero2Content;
    }
  // ── Stats ─────────────────────────────────────────────────────────────────
  | {
      template_id: "STATS__GRID_4COL__LIGHT__v1_0";
      content: Stats1Content;
    }
  // ── Features ─────────────────────────────────────────────────────────────
  | {
      template_id: "FEATURES__CARD_GRID__LIGHT__v1_0";
      content: Features1Content;
    }
  // ── FAQ ───────────────────────────────────────────────────────────────────
  | {
      template_id: "FAQ__SPLIT_LEFT__LIGHT__v1_0";
      content: Faq1Content;
    }
  | {
      template_id: "FAQ__CENTERED__LIGHT__v1_0";
      content: Faq2Content;
    }
  // ── CTA ───────────────────────────────────────────────────────────────────
  | {
      template_id: "CTA__SPLIT_RIGHT__DARK__v1_0";
      content: Newsletter1Content;
    }
  // ── Quiz ──────────────────────────────────────────────────────────────────
  | {
      template_id: "QUIZ__SINGLE_STEP__LIGHT__v1_0";
      content: Quiz1Content;
    }
  // ── Mini Result ──────────────────────────────────────────────────────────
  | {
      template_id: "MINIRESULT__SINGLE_STEP__LIGHT__v1_0";
      content: MiniResult1Content;
    }
  // ── Result ────────────────────────────────────────────────────────────────
  | {
      template_id: "RESULT__SCORE_BREAKDOWN__LIGHT__v1_0";
      content: ResultPageContent;
    }
  // ── Detailed Category Results ───────────────────────────────────────────
  | {
      template_id: "DETAILEDCATEGORYRESULTS__CARD_GRID__LIGHT__v1_0";
      content: DetailedCategoryResultsContent;
    };

/**
 * The full Section row as stored in the DB / returned by the API.
 * The intersection type merges the discriminated union (keyed on template_id)
 * with the shared metadata fields.
 *
 * `type` is a semantic grouping field used by the funnel builder UI and
 * analytics systems. It does NOT narrow `content` — only `template_id` does.
 * Always switch on `template_id` (not `type`) when you need content-type
 * narrowing.
 */
export type PageSection = SectionDefinition & {
  id: string; // UUID — unique instance ID
  order: number; // 0-indexed render order within the page
  type:
    | "nav"
    | "hero"
    | "features"
    | "faq"
    | "cta"
    | "stats"
    | "quiz"
    | "mini_result"
    | "result"
    | "detailed_category_results";
  is_visible: boolean;
  config?: SectionConfig;
};

// ================================================================
// SECTION 6: PAGE — THE TOP-LEVEL DOCUMENT
// ================================================================

interface PageConfig {
  background_color?: string;
  background_image?: ImageAsset;
  max_content_width?: string; // e.g., "1280px" — applied to inner container
  font_heading?: string; // e.g., "Playfair Display" — CSS font-family
  font_body?: string; // e.g., "Inter"
}

export type PageType = "landing_page" | "normal_page" | "result_page";

export interface PagePayloadSchema {
  id: string; // UUID
  slug: string; // Full URL path, e.g., "/stepper/q/page_abc123"
  title: string; // Internal CMS label — NOT rendered to users
  order: number;
  pageType: PageType;
  seo?: SEO_Metadata;
  config?: PageConfig;
  sections: PageSection[];
  /**
   * When false, this page is excluded from the default linear page sequence
   * and can only be reached via an explicit branchTarget. Defaults to true.
   */
  isLinearDefault?: boolean;
  created_at: string; // ISO 8601
  updated_at: string;
  published_at?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FunnelConfig {}

export interface funnelPayloadSchema {
  id: string; // UUID
  slug: string; // Base URL path for the funnel, e.g., "/stepper"
  title: string; // Internal CMS label — NOT rendered to users
  status: "draft" | "published" | "archived";
  questionCategories: QuestionCategory[];
  /**
   * Operator-configurable score tiers shared by the overall score and every
   * category score (CategoryScoreResult.tier / FunnelScoreResult.overallTier).
   * Optional — funnels with no explicit value fall back to
   * DEFAULT_SCORE_TIERS (helpers.ts: 0–33 / 34–66 / 67–100) at scoring time,
   * mirroring the THEME_DEFAULTS fallback pattern used by the theming system.
   */
  scoreTiers?: ScoreTier[];
  config?: FunnelConfig;
  theme?: FunnelTheme;
  lead_form?: LeadFormConfig;
  calculations?: FunnelCalculations;
  pages: PagePayloadSchema[];
  created_at: string; // ISO 8601
  updated_at: string;
  published_at?: string;
}
