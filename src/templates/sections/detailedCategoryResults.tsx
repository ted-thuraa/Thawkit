"use client";

import React, { useMemo } from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import { usePersonalizationContext } from "@/hooks/usePersonalizationContext";
import { interpolateTemplate } from "@/lib/funnelPersonalisation/engine";
import { PersonalizationContext } from "@/lib/funnelPersonalisation/types";
import {
  DetailedCategoryResultsSectionContent,
  PageSection,
  QuestionCategory,
} from "@/types/PageCMS/pageSchema";

type Props = {
  section: PageSection;
};

// ─── Per-category card ───────────────────────────────────────────────────────

type CategoryResultCardProps = {
  category: QuestionCategory;
  template: string;
  ctx: PersonalizationContext;
};

/**
 * Memoized so that adding/changing one category's dedicated template, or an
 * unrelated re-render elsewhere on the Result Page, doesn't force every
 * other card to re-resolve its (potentially long) personalized paragraph.
 * This is the scaling lever for "many categories without unnecessary
 * rendering overhead": cost grows with the cards that actually changed, not
 * with N on every render.
 */
const CategoryResultCard = React.memo(function CategoryResultCard({
  category,
  template,
  ctx,
}: CategoryResultCardProps) {
  const categoryVar = ctx.categories.get(category.id);
  const percentage = categoryVar?.percentage ?? 0;
  const tier = categoryVar?.tier ?? null;

  // Only the free-text body goes through the token engine — title and
  // percentage are rendered directly from already-structured data, the same
  // pattern CategoryScoreBar (result.tsx) already uses. currentCategoryId
  // binds `category.current.*` tokens inside this card's OWN dedicated
  // template to this card's own category.
  const body = useMemo(
    () =>
      interpolateTemplate(template, ctx, {
        local: { currentCategoryId: category.id },
      }),
    [template, ctx, category.id],
  );

  return (
    <article
      className="w-full rounded-[2rem] border p-8 md:p-10 space-y-4"
      style={{
        backgroundColor: "var(--tk-card-bg)",
        borderColor: "var(--tk-accent-primary-border)",
      }}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {category.icon && (
            <span className="text-2xl leading-none shrink-0" aria-hidden="true">
              {category.icon}
            </span>
          )}
          <h3
            className="text-xl leading-tight"
            style={{
              color: "var(--tk-text-heading)",
              fontFamily: "var(--tk-font-heading)",
              fontWeight:
                "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
            }}
          >
            {category.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {tier && (
            <span
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
              style={{
                color: tier.color,
                borderColor: tier.color,
                backgroundColor: `${tier.color}1A`,
              }}
            >
              {tier.label}
            </span>
          )}
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: "var(--tk-text-heading)" }}
          >
            {percentage}%
          </span>
        </div>
      </header>

      <p
        className="text-sm leading-relaxed whitespace-pre-line"
        style={{ color: "var(--tk-text-body)" }}
      >
        {body}
      </p>
    </article>
  );
});

// ─── Root section ─────────────────────────────────────────────────────────────

/**
 * DetailedCategoryResults — one personalized content card per funnel
 * category. The category COUNT and ORDER is driven entirely by
 * `schema.questionCategories`. Each card's content comes from a DEDICATED
 * template authored specifically for that category — `content.categoryContent[category.id]`
 * — not a single shared paragraph. `content.fallbackTemplate` is a defensive
 * fallback only, covering a category with no authored entry yet (e.g. one
 * added to the funnel after this section was last edited); a card with
 * neither a dedicated nor fallback template is skipped, with a dev-mode
 * warning, rather than rendering empty content.
 */
export function DetailedCategoryResults({ section }: Props) {
  const schema = useFunnelStore((s) => s.schema);
  const ctx = usePersonalizationContext();
  const content = section.content as DetailedCategoryResultsSectionContent;

  const categories = schema?.questionCategories ?? [];
  if (categories.length === 0) return null;

  return (
    <section className="w-full flex flex-col items-center py-16 px-4 gap-10">
      {(content.heading || content.subtext) && (
        <div className="text-center max-w-2xl space-y-3">
          {content.heading && (
            <h2
              className="text-3xl md:text-4xl leading-tight"
              style={{
                color: "var(--tk-text-heading)",
                fontFamily: "var(--tk-font-heading)",
                fontWeight:
                  "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
              }}
            >
              {content.heading}
            </h2>
          )}
          {content.subtext && (
            <p className="text-base" style={{ color: "var(--tk-text-body)" }}>
              {content.subtext}
            </p>
          )}
        </div>
      )}

      <div className="w-full max-w-2xl space-y-6">
        {categories.map((category) => {
          const template =
            content.categoryContent?.[category.id]?.contentTemplate ??
            content.fallbackTemplate;

          if (!template) {
            if (process.env.NODE_ENV !== "production") {
              // eslint-disable-next-line no-console
              console.warn(
                `[DetailedCategoryResults] category "${category.id}" has no ` +
                  `dedicated entry in categoryContent and no fallbackTemplate ` +
                  `is defined — skipping its card. Add an entry for this category.`,
              );
            }
            return null;
          }

          return (
            <CategoryResultCard
              key={category.id}
              category={category}
              template={template}
              ctx={ctx}
            />
          );
        })}
      </div>
    </section>
  );
}
