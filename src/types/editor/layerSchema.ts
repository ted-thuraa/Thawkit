// path: src/types/PageCMS/layerSchema.ts

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Layer tree type system — ported from Ycode (github.com/ycode/ycode,
 * MIT licensed), adopted for the campaign/funnel visual editor.
 *
 * SCOPE (this port): this is a deliberately pruned subset of Ycode's
 * `types/index.ts`, not a full port. What's here is enough for a generic,
 * arbitrarily-nested layer tree (div/section/text/etc.), Tailwind classes,
 * reusable Components (instances + variants + variables), reusable
 * LayerStyles (combo-class chips), and GSAP-driven interactions/animations.
 *
 * DELIBERATELY EXCLUDED from this pass — not oversights, see rationale:
 *   - CMS/Collections binding of any kind: `LayerVariables` (Ycode's
 *     collection/field-variable system), `optionsSource`/`sortByCollectionId`
 *     on select settings, the `field`/`asset` variants of `LinkType`, and
 *     every `_xxx` SSR-only field Ycode attaches to `Layer` for collection
 *     item resolution, pagination, and translation lookups. CMS/Collections
 *     is out of scope for this phase entirely (see project decision log).
 *   - Asset management: Ycode's `AssetVariable`/`StringAssetId` system
 *     assumes an `assets` table that doesn't exist in Thawkit yet. Anywhere
 *     Ycode would reference an asset ID, this port uses a plain `string`
 *     URL instead. Revisit once an asset system exists.
 *   - Slider/Lightbox widget settings, Map embed settings: these are
 *     specific interactive-widget features layered on top of the core
 *     layer-tree model, not part of it. Some also assume CMS binding
 *     (lightbox `filesSource: 'cms'`) or third-party API keys (Mapbox/
 *     Google Maps) that don't exist here. Add back as their own settings
 *     panels land, same as the rest of `RightPanel`.
 *   - Localization: Ycode's `locale` layer setting assumes a `locales`
 *     table and translation pipeline Thawkit doesn't have. Deferred
 *     alongside the rest of the localization surface.
 *   - Conditional visibility rules (`ConditionalVisibility`,
 *     `DynamicVisibilityCondition`): a rules-engine feature independent of
 *     the layer tree itself; deferred to its own design pass rather than
 *     guessed at here. A layer's `hidden` boolean covers static show/hide
 *     for now.
 *   - Draft/publish versioning fields Ycode carries directly on
 *     `LayerStyle`/`Component` (`content_hash`, `is_published`,
 *     `deleted_at`). Thawkit already has a separate immutable-snapshot
 *     mechanism (`funnelVersions.compiledSchema`, see
 *     funnel-content-schema.ts) that makes per-row publish state on these
 *     redundant — they are always the mutable draft.
 *
 * `ComponentVariableValue` is intentionally narrower than Ycode's version:
 * only `text`, `image`, and `link` override types are modeled. Ycode also
 * supports `rich_text`, `audio`, `video`, and `icon` component variables —
 * left out here because their settings panels are themselves part of the
 * deferred `RightPanel` work, and modeling the value shape without the
 * panel that produces it risks guessing at a shape that doesn't match what
 * gets built. `ComponentVariable.type` still lists all seven kinds so the
 * data model doesn't need a breaking change when those are added — only
 * `ComponentVariableValue` and `Layer['componentOverrides']` grow.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ─── Shared primitives ──────────────────────────────────────────────────────

export type UIState =
  | "neutral"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "current";
export type Breakpoint = "mobile" | "tablet" | "desktop";

// ─── Design property interfaces ─────────────────────────────────────────────
// Structured, per-category CSS properties. Ported verbatim from Ycode — this
// is generic CSS-shape modeling with no CMS/tenancy coupling of any kind.

export interface LayoutDesign {
  isActive?: boolean;
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  gap?: string;
  columnGap?: string;
  rowGap?: string;
  gapMode?: "all" | "individual";
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
}

export interface TypographyDesign {
  isActive?: boolean;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textWrap?: string;
  fontVariantNumeric?: string;
  textTransform?: string;
  textDecoration?: string;
  lineClamp?: string;
  textDecorationColor?: string;
  textDecorationThickness?: string;
  underlineOffset?: string;
  verticalAlign?: string;
  color?: string;
  placeholderColor?: string;
  textShadow?: string;
}

export interface SpacingDesign {
  isActive?: boolean;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginMode?: "all" | "individual";
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingMode?: "all" | "individual";
}

export interface SizingDesign {
  isActive?: boolean;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  overflow?: string;
  aspectRatio?: string | null;
  objectFit?: string | null;
  objectPosition?: string | null;
  gridColumnSpan?: string | null;
  gridRowSpan?: string | null;
}

export interface BordersDesign {
  isActive?: boolean;
  borderWidth?: string;
  borderTopWidth?: string;
  borderRightWidth?: string;
  borderBottomWidth?: string;
  borderLeftWidth?: string;
  borderWidthMode?: "all" | "individual";
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  borderRadiusMode?: "all" | "individual";
  divideX?: string;
  divideY?: string;
  divideStyle?: string;
  divideColor?: string;
  outlineWidth?: string;
  outlineColor?: string;
  outlineOffset?: string;
}

export interface BackgroundsDesign {
  isActive?: boolean;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundClip?: string;
  /** CSS variable values for background image per breakpoint/state, e.g. { '--bg-img': 'url(...)' } */
  bgImageVars?: Record<string, string>;
  /** CSS variable values for background gradient per breakpoint/state, e.g. { '--bg-img': 'linear-gradient(...)' } */
  bgGradientVars?: Record<string, string>;
}

export interface EffectsDesign {
  isActive?: boolean;
  opacity?: string;
  boxShadow?: string;
  blur?: string;
  backdropBlur?: string;
  filter?: string;
  backdropFilter?: string;
  mixBlendMode?: string;
  cursor?: string;
}

export interface PositioningDesign {
  isActive?: boolean;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
}

export interface TransformsDesign {
  isActive?: boolean;
  scale?: string;
  rotate?: string;
  translateX?: string;
  translateY?: string;
  skewX?: string;
  skewY?: string;
  transformOrigin?: string;
}

export interface TransitionsDesign {
  isActive?: boolean;
  transitionProperty?: string;
  duration?: string;
  easing?: string;
  delay?: string;
}

export interface DesignProperties {
  layout?: LayoutDesign;
  typography?: TypographyDesign;
  spacing?: SpacingDesign;
  sizing?: SizingDesign;
  borders?: BordersDesign;
  backgrounds?: BackgroundsDesign;
  effects?: EffectsDesign;
  positioning?: PositioningDesign;
  transforms?: TransformsDesign;
  transitions?: TransitionsDesign;
}

// ─── Forms (lead capture — core funnel functionality, not CMS-bound) ───────

export type FormType = "standard" | "password_protected";

export type PasswordProtectionContext = {
  pageId?: string;
  redirectUrl: string;
  isPublished: boolean;
};

export interface FormSettings {
  form_type?: FormType;
  success_action?: "message" | "redirect";
  success_message?: string;
  error_message?: string;
  redirect_url?: LinkSettingsValue;
  email_notification?: {
    enabled: boolean;
    to: string;
    subject?: string;
  };
}

// ─── Links ──────────────────────────────────────────────────────────────────
// Pruned to statically-authored link targets. Dropped vs. Ycode: the
// 'asset' variant (no asset system yet) and the 'field' variant (CMS-bound
// href from a collection field).

export type LinkType = "url" | "email" | "phone" | "page";

export interface LinkSettings {
  type: LinkType;
  url?: string;
  email?: string;
  phone?: string;
  /** Links to another page within the same funnel. */
  page?: {
    id: string; // references funnel-content-schema.ts's `pages.id`
  };
  /** Reference to a layer ID within the target to scroll to (#anchor). */
  anchor_layer_id?: string | null;
  target?: "_blank" | "_self" | "_parent" | "_top";
  download?: boolean;
  rel?: string;
}

export type LinkSettingsValue = LinkSettings;

// ─── Layer settings (element-specific configuration) ───────────────────────
// Pruned vs. Ycode: dropped `locale` (localization), `slider`/`lightbox`
// (deferred widget features), `map` (third-party integration), and the
// collection-bound select-options fields (`optionsSource`,
// `selectOptionsMode`, `sortByCollectionId`, `sortByFieldIds`,
// `isPlaceholder`).

export interface LayerSettings {
  id?: string; // Custom HTML id attribute
  tag?: string; // HTML tag override (e.g., 'h1', 'h2')
  hidden?: boolean; // Element visibility in canvas
  customAttributes?: Record<string, string>;
  htmlEmbed?: {
    code?: string;
  };
  form?: FormSettings; // Only meaningful on form layers
}

// ─── Layer styles (reusable combo-class chips) ─────────────────────────────
// Lean shape shared with design-system-schema.ts's `layerStyle` table.
// Versioning fields (`content_hash`, `is_published`, `deleted_at`) dropped —
// see file header. `group` renamed `styleGroup` to sidestep MySQL's
// reserved `GROUP` keyword as an identifier.

export interface LayerStyle {
  id: string;
  name: string;
  /** Element category (e.g. "text", "block", "button") for scoped filtering in the UI. */
  styleGroup?: string;
  /** Role within a combo-class stack: base style, combo addition, or a synced global. */
  kind?: "base" | "combo" | "global";
  classes: string;
  design?: DesignProperties;
}

export interface TextStyle {
  label?: string;
  classes?: string;
  design?: DesignProperties;
  styleId?: string;
  styleOverrides?: { classes?: string; design?: DesignProperties };
}

// ─── Interactions / animations (GSAP-driven, self-contained) ───────────────

export interface LayerInteraction {
  id: string;
  trigger: "click" | "hover" | "scroll-into-view" | "while-scrolling" | "load";
  timeline: InteractionTimeline;
  tweens: InteractionTween[];
}

export interface InteractionTimeline {
  breakpoints: Breakpoint[];
  repeat: number; // -1 = infinite, 0 = none, n = repeat n times
  yoyo: boolean;
  scrollStart?: string; // e.g. 'top 80%'
  scrollEnd?: string; // e.g. 'bottom top' (while-scrolling only)
  scrub?: boolean | number;
  toggleActions?: string; // scroll-into-view: GSAP toggleActions
}

export type TweenPropertyKey =
  | "x"
  | "y"
  | "rotation"
  | "scale"
  | "skewX"
  | "skewY"
  | "autoAlpha"
  | "display"
  | "width"
  | "height"
  | "backgroundColor"
  | "filterBlur"
  | "filterBrightness"
  | "filterGrayscale";

export type ApplyStyles = "on-load" | "on-trigger";
export type InteractionApplyStyles = Partial<
  Record<TweenPropertyKey, ApplyStyles>
>;
export type TweenProperties = { [K in TweenPropertyKey]?: string | null };

export interface InteractionTween {
  id: string;
  layer_id: string;
  position: number | string; // GSAP position: number (seconds), ">" (after previous), "<" (with previous)
  duration: number;
  ease: string; // GSAP ease, e.g. 'power1.out'
  from: TweenProperties;
  to: TweenProperties;
  apply_styles: InteractionApplyStyles;
  splitText?: {
    type: "chars" | "words" | "lines";
    stagger: { amount: number };
  };
}

// ─── Component overrides ────────────────────────────────────────────────────
// Narrowed value union — see file header for rationale on the deferred
// rich_text/audio/video/icon kinds.

export interface ImageSettingsValue {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  loading?: "lazy" | "eager";
}

export type ComponentVariableValue =
  | string
  | ImageSettingsValue
  | LinkSettingsValue;

export interface ComponentVariable {
  id: string;
  name: string;
  /** Full kind list kept for forward-compatibility; only text/image/link/variant have a modeled value today — see file header. */
  type?:
    | "text"
    | "rich_text"
    | "image"
    | "link"
    | "audio"
    | "video"
    | "icon"
    | "variant";
  placeholder?: string;
  default_value?: ComponentVariableValue;
}

/** A named layer-tree variant of a component (e.g. "Default", "Small", "Large"). All variants share the component's `variables`. */
export interface ComponentVariant {
  id: string;
  name: string;
  layers: Layer[];
}

export interface Component {
  id: string;
  name: string;
  /** Mirrors `variants[0].layers` for convenience; `variants` is the source of truth once present. */
  layers: Layer[];
  variants?: ComponentVariant[];
  variables?: ComponentVariable[];
  thumbnailUrl?: string | null;
}

// ─── Layer (the recursive tree node) ────────────────────────────────────────

export interface Layer {
  id: string;
  key?: string; // Optional internal/stable id for special layers (e.g. form success alert)
  name: string; // Element type name: 'div', 'section', 'text', etc.
  customName?: string; // User-defined name for display in the layers tree

  restrictions?: {
    copy?: boolean;
    delete?: boolean;
    ancestor?: string; // The ancestor `layer.name` this layer must be a child of
    editText?: boolean;
  };

  classes: string | string[]; // Tailwind classes

  /**
   * ADDED (Phase 5, correcting a Phase 1 gap): plain, static, author-typed
   * text content for text-bearing layers (text/heading/span/label; also
   * used as a plain-text fallback for richText until real rich-text
   * editing lands). Phase 1 excluded `Layer.variables` entirely as
   * CMS-bound — correct for the actual CMS/collection-binding parts of
   * it, but that also silently removed the ONLY place Ycode stores
   * static text (`variables.text` with a static/dynamic discriminant).
   * This field is the narrow, non-CMS-bound replacement: no variable
   * system, no CMS binding, just a string. A future CMS pass can add a
   * separate binding field alongside this one without touching it.
   */
  content?: string;

  textStyles?: Record<string, TextStyle>;

  children?: Layer[];

  open?: boolean; // Expanded/collapsed state in the layers tree
  hidden?: boolean;
  hiddenGenerated?: boolean; // Hidden by default, shown via form success/error actions
  alertType?: "success" | "error";

  attributes?: Record<string, unknown> & {
    id?: string;
    // Media element attributes (video/audio) — generic HTML5, no CMS coupling
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
    autoplay?: boolean;
    volume?: string;
    preload?: string;
    youtubePrivacyMode?: boolean;
  };

  design?: DesignProperties;
  settings?: LayerSettings;

  // Applied LayerStyle stack, low to high priority (base first, combos after).
  styleIds?: string[];
  styleOverrides?: {
    classes?: string;
    design?: DesignProperties;
  };
  /** Per-style local overrides, keyed by the LayerStyle id in the stack — replaces that style's classes for this layer only. */
  styleOverridesByStyle?: Record<
    string,
    { classes?: string; design?: DesignProperties }
  >;

  // Component instance
  componentId?: string;
  componentVariantId?: string;
  /** When set, this nested instance's variant is driven by the parent component's variable (by id), resolved at expansion time. */
  componentVariantVariableId?: string;
  componentOverrides?: {
    text?: Record<string, ComponentVariableValue>;
    image?: Record<string, ComponentVariableValue>;
    link?: Record<string, ComponentVariableValue>;
    variant?: Record<string, ComponentVariableValue>;
    /** childVariableId -> parentVariableId, for pass-through from a nested component to its parent. */
    variableLinks?: Record<string, string>;
  };

  interactions?: LayerInteraction[];
}

/** A layer without a required `id` (children may also omit ids), for reusable templates. */
export interface LayerTemplate extends Omit<Layer, "id" | "children"> {
  id?: string;
  children?: LayerTemplate[];
}
