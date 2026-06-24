import {
  CategoryVariable,
  InterpolateOptions,
  LocalRenderContext,
  PersonalizationContext,
} from "./types";

// ─── Template parsing (cached) ──────────────────────────────────────────────
//
// Template strings are static schema content (author-written, not derived
// from runtime state), so the SEGMENT structure of a given template never
// changes across renders or across the N category cards that may share one
// template (detailedCategoryResults' default contentTemplate). Caching the
// parsed segment list — not the resolved output, which legitimately differs
// per card — avoids re-running the token regex over the same string
// repeatedly, per the "avoid repeated template parsing" constraint.
//
// Module-level cache, same idiom as useFontLoader.ts's injectedFontKeys Set:
// persists for the page's lifetime, shared across every component instance.

type TemplateSegment =
  | { kind: "text"; value: string }
  | { kind: "token"; path: string[]; raw: string };

const TOKEN_PATTERN = /\{\{([\w.]+)\}\}/g;

const templateCache = new Map<string, TemplateSegment[]>();

function parseTemplate(template: string): TemplateSegment[] {
  const cached = templateCache.get(template);
  if (cached) return cached;

  const segments: TemplateSegment[] = [];
  let lastIndex = 0;

  TOKEN_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_PATTERN.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        kind: "text",
        value: template.slice(lastIndex, match.index),
      });
    }
    segments.push({ kind: "token", path: match[1].split("."), raw: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < template.length) {
    segments.push({ kind: "text", value: template.slice(lastIndex) });
  }

  templateCache.set(template, segments);
  return segments;
}

// ─── Resolver registry ──────────────────────────────────────────────────────
//
// One small function per namespace. Adding a new namespace (e.g. a future
// "funnel.*" or "audience.*") is exactly: write one resolver, add one entry
// below — no changes to parseTemplate, interpolateTemplate, or any consumer.

type VariableResolver = (
  path: string[],
  ctx: PersonalizationContext,
  local: LocalRenderContext,
) => string | undefined;

function resolveQuestionToken(
  path: string[],
  ctx: PersonalizationContext,
): string | undefined {
  const [sectionId, field] = path;
  if (!sectionId || !field) return undefined;
  const q = ctx.questions.get(sectionId);
  if (!q) return undefined;

  switch (field) {
    case "title":
      return q.title;
    case "answer":
      return q.answerLabel;
    case "score":
      return String(q.score);
    default:
      return undefined;
  }
}

function resolveCategoryVariableField(
  cat: CategoryVariable | null | undefined,
  field: string | undefined,
): string | undefined {
  if (!cat || !field) return undefined;

  switch (field) {
    case "title":
      return cat.title;
    case "percentage":
      return String(cat.percentage);
    case "value":
      return String(cat.value);
    case "tier":
      return cat.tier?.label;
    default:
      return undefined;
  }
}

function resolveCategoryToken(
  path: string[],
  ctx: PersonalizationContext,
  local: LocalRenderContext,
): string | undefined {
  const [idOrCurrent, field] = path;
  if (!idOrCurrent) return undefined;

  if (idOrCurrent === "current") {
    if (!local.currentCategoryId) return undefined;
    return resolveCategoryVariableField(
      ctx.categories.get(local.currentCategoryId),
      field,
    );
  }

  return resolveCategoryVariableField(ctx.categories.get(idOrCurrent), field);
}

function resolveGlobalToken(
  path: string[],
  ctx: PersonalizationContext,
): string | undefined {
  const [first, second] = path;

  if (first === "totalQuestions") return String(ctx.global.totalQuestions);
  if (first === "highestCategory")
    return resolveCategoryVariableField(ctx.global.highestCategory, second);
  if (first === "lowestCategory")
    return resolveCategoryVariableField(ctx.global.lowestCategory, second);

  return undefined;
}

const RESOLVERS: Record<string, VariableResolver> = {
  question: resolveQuestionToken,
  category: resolveCategoryToken,
  global: resolveGlobalToken,
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Resolves all `{{token}}` placeholders in `template` against `ctx`.
 *
 * Token grammar:
 *   {{question.<sectionId>.title|answer|score}}
 *   {{category.<categoryId>.title|percentage|value|tier}}
 *   {{category.current.title|percentage|value|tier}}   — requires opts.local.currentCategoryId
 *   {{global.totalQuestions}}
 *   {{global.highestCategory.title|percentage|value|tier}}
 *   {{global.lowestCategory.title|percentage|value|tier}}
 *   {{<leadFieldId>}}                                    — legacy bare-token lead lookup
 *
 * Unresolved tokens (unknown id, missing field, "current" used without a
 * local binding, etc.) are left in the output verbatim as `{{...}}` — never
 * silently dropped — matching the project's existing interpolation
 * philosophy. Callers that need strict all-or-nothing behavior (e.g. the
 * legacy welcome_message gate) should check the result with
 * isFullyResolved() themselves; this function always returns a string.
 */
export function interpolateTemplate(
  template: string,
  ctx: PersonalizationContext,
  opts: InterpolateOptions = {},
): string {
  const local = opts.local ?? {};
  const segments = parseTemplate(template);

  let output = "";
  for (const seg of segments) {
    if (seg.kind === "text") {
      output += seg.value;
      continue;
    }

    const namespace = seg.path[0];
    const resolver = RESOLVERS[namespace];

    let resolved: string | undefined;
    if (resolver && seg.path.length > 1) {
      resolved = resolver(seg.path.slice(1), ctx, local);
    } else {
      // Legacy bare token — no recognized namespace — falls back to a
      // direct leadData lookup, preserving {{first_name}}-style tokens
      // exactly as they worked before this module existed.
      const key = seg.raw.slice(2, -2);
      const val = ctx.lead[key];
      resolved =
        val !== undefined && String(val).trim() !== ""
          ? String(val)
          : undefined;
    }

    if (resolved !== undefined) {
      output += resolved;
    } else {
      output += seg.raw;
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`[personalization] unresolved token: ${seg.raw}`);
      }
    }
  }

  return output;
}

/**
 * Returns true only when every `{{token}}` in `interpolated` was resolved.
 * Used by callers that want all-or-nothing rendering (e.g. result.tsx's
 * welcome_message) — interpolate, then gate on this, rather than baking a
 * strict mode into interpolateTemplate itself.
 */
export function isFullyResolved(interpolated: string): boolean {
  return !interpolated.includes("{{");
}
