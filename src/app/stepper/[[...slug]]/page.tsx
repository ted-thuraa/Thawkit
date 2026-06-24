// src/app/stepper/[[...slug]]/page.tsx

/**
 * Catch-all route: handles both the root "/stepper" path and all sub-paths
 * ("/stepper/q/[pageId]", "/stepper/r/[pageId]") without separate route files.
 * The double-bracket [[...slug]] makes the segment optional so the root path
 * is also matched.
 *
 * This is a Server Component. It:
 *   1. Provides generateStaticParams so Next.js pre-renders every known funnel
 *      page at build time (static site generation).
 *   2. Provides generateMetadata so each page gets a correct <title> tag and
 *      Open Graph metadata from the SEO config in the funnel schema.
 *   3. Renders <FunnelContainer /> — a Client Component that hydrates the
 *      Zustand store and handles all subsequent navigation client-side.
 *
 * After the first paint, ALL navigation is client-side via soft routing
 * (useSoftRouter). The server never re-renders on quiz step transitions.
 */

import React from "react";
import type { Metadata } from "next";

import { funnelPayload } from "@/dummyData/pageData";
import { FunnelContainer } from "./_components/funnelContainer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug?: string[] }>;
}

// ─── Static generation ────────────────────────────────────────────────────────

/**
 * Pre-renders every known funnel page at build time.
 *
 * Each `page.slug` is a full path like "/stepper/q/page_abc123". We strip the
 * leading "/stepper/" prefix so Next.js receives only the catch-all segment —
 * e.g. ["q", "page_abc123"] for "/stepper/q/page_abc123", or `undefined` for
 * the root "/stepper" path (which maps to the optional catch-all being absent).
 *
 * When the funnel schema is fetched from an API at build time (post-mock phase),
 * replace `funnelPayload` with `await getFunnelBySlug(...)`.
 */
export async function generateStaticParams() {
  return funnelPayload.pages.map((page) => {
    const withoutBase = page.slug.replace(/^\/stepper\/?/, "");
    return {
      slug: withoutBase.length > 0 ? withoutBase.split("/") : undefined,
    };
  });
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

/**
 * Resolves per-page metadata from the funnel schema.
 *
 * ── Fix applied ──────────────────────────────────────────────────────────────
 * The previous implementation had two bugs:
 *
 *   Bug 1 — Discarded expression:
 *     `slug ? \`/stepper/\${slug.join("/")}\` : "/stepper";`
 *     This computed the full slug string but never assigned it anywhere, so
 *     the variable was unused and the expression was a no-op.
 *
 *   Bug 2 — Type mismatch in find():
 *     `funnelPayload.pages.find((p) => p.slug === slug)`
 *     `p.slug` is a `string` (e.g. "/stepper/q/page_abc123").
 *     `slug` is `string[] | undefined` (the raw params value).
 *     A string can never strictly equal a string array, so `find()` always
 *     returned `undefined` — every page fell back to the default title "Mentorea".
 *
 * Both bugs are fixed below by properly constructing `fullSlug` and comparing
 * it against `p.slug`.
 *
 * ── Field priority ───────────────────────────────────────────────────────────
 * `PagePayloadSchema.title` is documented as "Internal CMS label, not rendered"
 * and is used by the builder UI (e.g. "Question - What is your role?"). It
 * should NOT appear in the browser <title> tag.
 *
 * `PagePayloadSchema.seo.title` is the correct SEO title (e.g.
 * "Turn your product into your biggest growth engine"). We use it first,
 * falling back to the internal title if seo is absent (which it is for quiz
 * and result pages that haven't been given explicit SEO config yet).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Reconstruct the full /stepper/... path to match against page.slug values.
  const fullSlug =
    slug && slug.length > 0 ? `/stepper/${slug.join("/")}` : "/stepper";

  const matchedPage = funnelPayload.pages.find((p) => p.slug === fullSlug);

  return {
    // Prefer the SEO title (meant for <title> tag) over the internal CMS label.
    title: matchedPage?.seo?.title ?? matchedPage?.title ?? "Mentorea",
    description: matchedPage?.seo?.description,
    openGraph: matchedPage?.seo?.og_image?.url
      ? {
          images: [
            {
              url: matchedPage.seo.og_image.url,
              width: matchedPage.seo.og_image.width,
              height: matchedPage.seo.og_image.height,
              alt: matchedPage.seo.og_image.alt,
            },
          ],
        }
      : undefined,
    robots: matchedPage?.seo?.robots,
  };
}

// ─── Page component ───────────────────────────────────────────────────────────

/**
 * Thin server shell. Zero client JavaScript on the initial server render.
 * FunnelContainer takes over entirely after hydration.
 */
export default function FunnelRoute() {
  return <FunnelContainer />;
}
