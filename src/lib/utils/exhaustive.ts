// src/lib/exhaustive.ts

/**
 * Compile-time exhaustiveness guard for discriminated-union `switch` statements.
 *
 * ── How it works ─────────────────────────────────────────────────────────────
 *
 * TypeScript narrows the discriminant's type in every `case` branch. After
 * all union members are handled, the discriminant is narrowed to `never` in
 * the `default` branch. Passing a `never`-typed value to this function
 * type-checks silently. If a union member is NOT handled (e.g. a new
 * `template_id` variant is added to `SectionDefinition` but forgotten in
 * `SectionTypeRenderer`), the discriminant is no longer `never` in `default`,
 * and the TypeScript compiler produces an error at that call-site — turning a
 * previously-silent visual regression into a build failure.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 *
 *   switch (section.template_id) {
 *     case "HERO__SPLIT_LEFT__LIGHT__v1_0":
 *       return <Hero1 section={section} pageId={pageId} />;
 *     // … every other union member …
 *     default:
 *       return assertNever(section, "SectionTypeRenderer");
 *   }
 *
 * ── Runtime behaviour ─────────────────────────────────────────────────────────
 *
 * In a well-typed system this branch is unreachable. It may be reached in
 * practice if data from an external API bypasses the TypeScript type system
 * (e.g. a DB row whose `template_id` was never migrated). In that case:
 *
 * - Non-production: logs a descriptive error with the unexpected value so
 *   developers see it immediately.
 * - Production: silently returns `null` so a single unrecognised section
 *   degrades gracefully instead of crashing the entire funnel page.
 *
 * @param value  The switch discriminant, narrowed to `never` by TS.
 * @param context  Optional caller name used in the error message.
 */
export function assertNever(value: never, context?: string): null {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(
      `[assertNever]${context ? ` [${context}]` : ""} Unhandled discriminant value:`,
      value,
    );
  }
  return null;
}
