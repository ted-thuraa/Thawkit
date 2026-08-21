"use client";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleDashed,
  FileSearch,
  Globe2,
  MessageSquareText,
  Radar,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const BRAND_LOGOS = [
  "Duolingo",
  "Booking.com",
  "Center Parcs",
  "Vercel",
  "NXT Pharma",
  "Six Group",
  "Schoonenberg",
  "Everflow",
] as const;

export const PLATFORM_MODELS = [
  "Google Gemini",
  "ChatGPT",
  "Claude",
  "Perplexity",
  "DeepSeek",
] as const;

export const FEATURE_CARDS = [
  {
    icon: MessageSquareText,
    label: "Prompt Tracking",
    title: "Track real user prompts",
    description:
      "Run the prompts your customers ask and see when AI mentions your brand in its responses.",
  },
  {
    icon: FileSearch,
    label: "Citations Analysis",
    title: "Understand what gets cited",
    description:
      "See exactly which sources drive visibility and discover what content AI recommends.",
  },
  {
    icon: Bot,
    label: "Agent Analytics",
    title: "Know when AI reads your site",
    description:
      "See real-time activity from AI crawlers and citation agents across your website.",
  },
  {
    icon: Sparkles,
    label: "Content Agent",
    title: "Create content that gets cited",
    description:
      "Generate content based on real citation data and gaps observed across AI search.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Promptwatch stands out for its powerful features, especially its earned media tracking for off-site mentions and its actionable insights.",
    name: "Rutger van der Lee",
    role: "Founder, NXT Pharma",
    company: "NXT Pharma",
  },
  {
    quote:
      "Promptwatch gives us a comprehensive way to explore AI visibility data in depth, uncover patterns, and understand where our brand appears.",
    name: "Susanna Marsiglia",
    role: "Senior SEO Consultant and UX Specialist",
    company: "Six Group",
  },
  {
    quote:
      "Promptwatch stands out due to how practical it is. A tool built for real business needs in the growing AI Search space.",
    name: "Pim Broekstra",
    role: "SEO Manager",
    company: "Center Parcs",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is Promptwatch?",
    answer:
      "Promptwatch helps marketers track and improve brand visibility in AI responses to drive more high-intent traffic to their websites.",
  },
  {
    question: "How do I get started with Promptwatch?",
    answer:
      "Enter your brand URL and select prompts related to your category. Promptwatch then begins collecting brand and competitor mentions across supported AI platforms.",
  },
  {
    question: "How does Promptwatch collect data?",
    answer:
      "Promptwatch collects real-world AI Search data by monitoring user-facing interfaces and AI crawler activity across major AI platforms.",
  },
  {
    question: "Which AI models does Promptwatch monitor?",
    answer:
      "Promptwatch supports major AI search platforms including ChatGPT, Gemini, Claude, Perplexity, DeepSeek and Google AI experiences.",
  },
  {
    question: "Can I track ChatGPT, Claude and Gemini at the same time?",
    answer:
      "Yes. Prompts can be evaluated across supported models so you can compare visibility, citations and sentiment in one unified workflow.",
  },
  {
    question: "How does Promptwatch help generate revenue from AI Search?",
    answer:
      "It reveals which content AI prefers, identifies citation and technical gaps, tracks AI-driven traffic and provides optimization opportunities that can improve high-intent discovery.",
  },
  {
    question: "Is Promptwatch suitable for agencies?",
    answer:
      "Yes. Promptwatch supports multi-project workflows so agencies can onboard and manage multiple client brands.",
  },
  {
    question: "Can I track competitors?",
    answer:
      "Yes. Add competitors to compare visibility, mentions and citation performance against your brand.",
  },
] as const;

const tokens = {
  ink: "#101114",
  muted: "#62666f",
  line: "#e7e9ed",
  soft: "#f7f8fa",
  blue: "#245bff",
  blueDark: "#1747d6",
  bluePale: "#eef4ff",
  violet: "#7255ff",
  green: "#20b26b",
  white: "#ffffff",
  font: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function PromptwatchShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "[font-family:var(--pw-font)]",
        "min-h-screen",
        "bg-[var(--pw-white)]",
        "text-[var(--pw-ink)]",
        "[--pw-ink:#101114]",
        "[--pw-muted:#62666f]",
        "[--pw-line:#e7e9ed]",
        "[--pw-soft:#f7f8fa]",
        "[--pw-blue:#245bff]",
        "[--pw-blue-dark:#1747d6]",
        "[--pw-blue-pale:#eef4ff]",
        "[--pw-violet:#7255ff]",
        "[--pw-green:#20b26b]",
        "[--pw-white:#ffffff]",
        "[--pw-font:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Logo() {
  return (
    <Link href="#" className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-[var(--pw-ink)] text-white">
        <span className="text-lg font-black leading-none">P</span>
      </span>

      <span className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--pw-ink)]">
        promptwatch
      </span>
    </Link>
  );
}

function CTAButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href="#"
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition",
        variant === "primary"
          ? "bg-[var(--pw-blue)] text-white shadow-[0_16px_44px_rgba(36,91,255,0.20)] hover:bg-[var(--pw-blue-dark)]"
          : "border border-[var(--pw-line)] bg-white text-[var(--pw-ink)] hover:border-[rgba(16,17,20,0.20)] hover:bg-[var(--pw-soft)]",
      )}
    >
      {children}

      {variant === "primary" && <ArrowRight className="size-4" />}
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pw-blue)]">
        {eyebrow}
      </p>

      <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-[var(--pw-ink)] sm:text-5xl">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-[var(--pw-muted)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function MiniDashboard() {
  return (
    <div className="relative mx-auto mt-14 max-w-6xl">
      <div className="absolute inset-x-20 -top-12 h-40 rounded-full bg-[rgba(36,91,255,0.10)] blur-3xl" />

      <div className="relative overflow-hidden rounded-[28px] border border-[var(--pw-line)] bg-white shadow-[0_12px_40px_rgba(16,17,20,0.08)]">
        <div className="flex items-center justify-between border-b border-[var(--pw-line)] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-[var(--pw-blue)]" />

            <span className="text-xs font-medium text-[var(--pw-ink)]">
              Promptwatch — Visibility
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            {["Visibility", "Prompts", "Citations", "Analytics"].map((item) => (
              <span
                key={item}
                className="rounded-full px-3 py-1.5 text-[11px] text-[var(--pw-muted)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-black/10" />
            <span className="size-2 rounded-full bg-black/10" />
            <span className="size-2 rounded-full bg-black/10" />
          </div>
        </div>

        <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-[190px_1fr]">
          <aside className="hidden border-r border-[var(--pw-line)] bg-[var(--pw-soft)]/70 p-4 md:block">
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
              <span className="size-6 rounded-md bg-[var(--pw-ink)]" />
              <span className="text-xs font-semibold text-[var(--pw-ink)]">
                Acme Inc.
              </span>
            </div>

            <div className="space-y-1">
              {[
                ["Overview", Activity],
                ["Prompts", MessageSquareText],
                ["Citations", FileSearch],
                ["Monitors", Radar],
                ["Analytics", BarChart3],
              ].map(([label, Icon], index) => (
                <div
                  key={String(label)}
                  className={cx(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
                    index === 0
                      ? "bg-[var(--pw-blue)] text-white"
                      : "text-[var(--pw-muted)] hover:bg-white",
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{String(label)}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="p-5 sm:p-7">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs text-[var(--pw-muted)]">
                  Brand visibility
                </div>

                <div className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
                  72.4%
                </div>

                <div className="mt-1 flex items-center gap-1 text-xs text-[var(--pw-green)]">
                  <TrendingUp className="size-3.5" />
                  +12.8% vs. last month
                </div>
              </div>

              <div className="flex rounded-xl border border-[var(--pw-line)] p-1">
                {["7d", "30d", "90d"].map((period, index) => (
                  <span
                    key={period}
                    className={cx(
                      "rounded-lg px-3 py-1.5 text-[11px]",
                      index === 1
                        ? "bg-[var(--pw-ink)] text-white"
                        : "text-[var(--pw-muted)]",
                    )}
                  >
                    {period}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-[var(--pw-line)] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium">
                      Visibility over time
                    </div>

                    <div className="mt-1 text-[11px] text-[var(--pw-muted)]">
                      AI search share of voice
                    </div>
                  </div>

                  <span className="rounded-full bg-[rgba(32,178,107,0.10)] px-2 py-1 text-[10px] font-medium text-[var(--pw-green)]">
                    Trending up
                  </span>
                </div>

                <div className="relative h-44 overflow-hidden rounded-xl bg-[var(--pw-soft)]">
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[var(--pw-line)]" />
                  <div className="absolute inset-y-0 left-1/4 border-l border-dashed border-[var(--pw-line)]" />
                  <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-[var(--pw-line)]" />
                  <div className="absolute inset-y-0 left-3/4 border-l border-dashed border-[var(--pw-line)]" />

                  <svg
                    viewBox="0 0 700 180"
                    className="absolute inset-0 h-full w-full"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 125C55 120 65 107 110 113C160 121 171 70 215 81C259 93 274 69 322 80C365 89 385 57 431 67C478 78 488 94 533 63C579 32 610 52 700 22"
                      stroke="currentColor"
                      className="text-[var(--pw-blue)]"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <path
                      d="M0 145C55 142 81 130 118 139C165 151 188 102 226 118C280 138 297 109 348 114C399 119 415 100 459 110C510 121 546 100 592 95C631 91 662 95 700 76"
                      stroke="currentColor"
                      className="text-[rgba(114,85,255,0.50)]"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  ["Mentions", "1,847", "+6.8%"],
                  ["Citations", "312", "+14.2%"],
                  ["Avg. Rank", "#1.8", "-"],
                ].map(([label, value, delta]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[var(--pw-line)] p-4"
                  >
                    <div className="text-xs text-[var(--pw-muted)]">
                      {label}
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-2xl font-semibold tracking-[-0.04em]">
                        {value}
                      </span>

                      <span className="text-[11px] font-medium text-[var(--pw-green)]">
                        {delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  label,
  title,
  description,
}: (typeof FEATURE_CARDS)[number]) {
  return (
    <div className="group rounded-3xl border border-[var(--pw-line)] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,17,20,0.06)]">
      <div className="mb-8 flex size-11 items-center justify-center rounded-2xl bg-[var(--pw-blue-pale)] text-[var(--pw-blue)]">
        <Icon className="size-5" />
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--pw-muted)]">
        {label}
      </p>

      <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--pw-ink)]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[var(--pw-muted)]">
        {description}
      </p>

      <div className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-[var(--pw-ink)]">
        Explore
        <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
      </div>
    </div>
  );
}

function ProductPreview({
  type,
}: {
  type: "content" | "shopping" | "crawler" | "citation";
}) {
  if (type === "content") {
    return (
      <div className="overflow-hidden rounded-3xl border border-[var(--pw-line)] bg-white shadow-[0_12px_40px_rgba(16,17,20,0.08)]">
        <div className="border-b border-[var(--pw-line)] px-5 py-4 text-sm font-medium">
          Promptwatch — Content
        </div>

        <div className="grid min-h-[430px] grid-cols-[145px_1fr]">
          <div className="border-r border-[var(--pw-line)] bg-[var(--pw-soft)] p-3">
            {[
              "Visibility",
              "Prompts",
              "Content",
              "Crawlers",
              "Citations",
              "Analytics",
            ].map((item, index) => (
              <div
                key={item}
                className={cx(
                  "mb-1 rounded-lg px-3 py-2 text-[10px]",
                  index === 2
                    ? "bg-white font-medium text-[var(--pw-blue)] shadow-sm"
                    : "text-[var(--pw-muted)]",
                )}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--pw-muted)]">
                  AI content brief
                </p>

                <h4 className="mt-1 text-base font-semibold">
                  From SEO to GEO: The AI-Powered Search Revolution
                </h4>
              </div>

              <div className="rounded-lg bg-[rgba(32,178,107,0.10)] px-2 py-1 text-[10px] text-[var(--pw-green)]">
                Optimized
              </div>
            </div>

            <div className="space-y-3">
              {[
                ["Primary prompt", "how to optimize website for AI search"],
                ["Citation gap", "3 authoritative sources missing"],
                ["Content score", "94 / 100"],
                ["Search intent", "Informational + commercial"],
              ].map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl border border-[var(--pw-line)] bg-[var(--pw-soft)]/60 px-4 py-3"
                >
                  <span className="text-[11px] text-[var(--pw-muted)]">
                    {key}
                  </span>

                  <span className="text-[11px] font-medium text-[var(--pw-ink)]">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--pw-line)] p-4">
              <div className="mb-3 text-xs font-medium">Draft outline</div>

              <div className="space-y-2">
                {[
                  "The end of traditional SEO",
                  "How AI Search changes discovery",
                  "What makes content citation-worthy",
                  "Building authority across AI models",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[11px] text-[var(--pw-muted)]"
                  >
                    <span className="grid size-5 place-items-center rounded-md bg-[var(--pw-blue-pale)] text-[9px] font-semibold text-[var(--pw-blue)]">
                      {index + 1}
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "shopping") {
    return (
      <div className="overflow-hidden rounded-3xl border border-[var(--pw-line)] bg-white shadow-[0_12px_40px_rgba(16,17,20,0.08)]">
        <div className="border-b border-[var(--pw-line)] px-5 py-4 text-sm font-medium">
          AI Shopping Intelligence
        </div>

        <div className="p-5">
          <div className="rounded-2xl bg-[var(--pw-soft)] p-4">
            <div className="text-[11px] font-medium text-[var(--pw-ink)]">
              For 5k running, you&apos;ll want shoes that balance cushioning
              with responsiveness.
            </div>

            <div className="mt-2 text-[10px] text-[var(--pw-muted)]">
              ChatGPT · 2 minutes ago
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Nike Pegasus 40", "$130", "4.5", "Top recommendation"],
              ["Hoka Mach 5", "$140", "4.7", "Strong alternative"],
              ["New Balance FuelCell", "$120", "4.4", "Good value"],
              ["Saucony Ride 17", "$135", "4.6", "Frequent mention"],
            ].map(([name, price, rating, label]) => (
              <div
                key={name}
                className="rounded-2xl border border-[var(--pw-line)] p-4"
              >
                <div className="mb-4 h-24 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200" />

                <div className="text-xs font-semibold">{name}</div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--pw-muted)]">
                  <span>{price}</span>
                  <span>★ {rating}</span>
                </div>

                <div className="mt-3 text-[10px] text-[var(--pw-blue)]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "crawler") {
    return (
      <div className="overflow-hidden rounded-3xl border border-[var(--pw-line)] bg-white shadow-[0_12px_40px_rgba(16,17,20,0.08)]">
        <div className="border-b border-[var(--pw-line)] px-5 py-4 text-sm font-medium">
          Agent Analytics
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["12,402", "Visits this week"],
              ["6", "Active agents"],
              ["4", "AI models"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-[var(--pw-line)] bg-[var(--pw-soft)] p-4"
              >
                <div className="text-2xl font-semibold tracking-[-0.04em]">
                  {value}
                </div>

                <div className="mt-1 text-[10px] text-[var(--pw-muted)]">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--pw-line)]">
            {[
              ["ChatGPT", "/blog/seo-tips", "Cited", "2.5K"],
              ["Claude", "/docs/api", "Cited", "1.7K"],
              ["Perplexity", "/pricing", "Read", "1.5K"],
              ["Gemini", "/about", "Read", "940"],
            ].map(([agent, page, state, traffic]) => (
              <div
                key={agent}
                className="grid grid-cols-[90px_1fr_auto] items-center gap-3 border-b border-[var(--pw-line)] px-4 py-3 last:border-0"
              >
                <span className="text-xs font-medium">{agent}</span>

                <span className="truncate text-[10px] text-[var(--pw-muted)]">
                  {page}
                </span>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[rgba(32,178,107,0.10)] px-2 py-1 text-[9px] font-medium text-[var(--pw-green)]">
                    {state}
                  </span>

                  <span className="text-[10px] text-[var(--pw-muted)]">
                    {traffic}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--pw-line)] bg-white shadow-[0_12px_40px_rgba(16,17,20,0.08)]">
      <div className="border-b border-[var(--pw-line)] px-5 py-4 text-sm font-medium">
        Citation Analysis
      </div>

      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <div className="rounded-2xl border border-[var(--pw-line)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs font-medium">Citation share</div>
              <div className="text-[10px] text-[var(--pw-muted)]">
                Last 30 days
              </div>
            </div>

            <div className="space-y-4">
              {[
                ["Product pages", 42],
                ["Blog posts", 31],
                ["Listicles", 23],
                ["Review sites", 18],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-[10px]">
                    <span className="text-[var(--pw-muted)]">{label}</span>
                    <span className="font-medium">{value}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-[var(--pw-soft)]">
                    <div
                      className="h-full rounded-full bg-[var(--pw-blue)]"
                      style={{ width: `${Number(value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--pw-ink)] p-5 text-white">
            <div className="text-[10px] text-white/50">Visibility gap</div>

            <div className="mt-2 text-4xl font-semibold">-18%</div>

            <div className="mt-2 text-[10px] leading-4 text-white/60">
              Competitors are being cited in topics where your content is
              currently missing.
            </div>

            <div className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px]">
              Find content gaps
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSection({
  eyebrow,
  title,
  description,
  type,
  reversed = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  type: "content" | "shopping" | "crawler" | "citation";
  reversed?: boolean;
}) {
  const bullets = {
    content: [
      "Content gap analysis",
      "Citation-aware content briefs",
      "Automated content calendar",
      "AI optimization recommendations",
    ],
    shopping: [
      "Actual AI shopping responses",
      "Brand and competitor recommendations",
      "Visibility and sentiment metrics",
      "Entity tracking",
    ],
    crawler: [
      "Real-time crawler activity",
      "Page-level citation tracking",
      "AI traffic and referral insights",
      "Optimization opportunities",
    ],
    citation: [
      "Offsite brand mentions",
      "Reddit tracking",
      "YouTube analysis",
      "Citation source intelligence",
    ],
  }[type];

  return (
    <section className="px-5 py-24 sm:px-8 lg:py-32">
      <div
        className={cx(
          "mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-2 lg:gap-20",
          reversed && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pw-blue)]">
            {eyebrow}
          </p>

          <h2 className="max-w-xl text-balance text-4xl font-semibold tracking-[-0.045em] text-[var(--pw-ink)] sm:text-5xl">
            {title}
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--pw-muted)] sm:text-lg">
            {description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-center gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--pw-blue-pale)] text-[var(--pw-blue)]">
                  <Check className="size-3.5" />
                </span>

                <span className="text-sm text-[var(--pw-ink)]">{bullet}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <CTAButton variant="secondary">Explore feature</CTAButton>
          </div>
        </div>

        <ProductPreview type={type} />
      </div>
    </section>
  );
}

function PlatformSection() {
  return (
    <section className="bg-[var(--pw-soft)] px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading
          eyebrow="Platform Coverage"
          title="Everything you need to win in AI search"
          description="One platform for every location, language and major AI search engine."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-[var(--pw-line)] bg-white p-6">
            <div className="mb-6 flex size-11 items-center justify-center rounded-2xl bg-[var(--pw-blue-pale)] text-[var(--pw-blue)]">
              <Globe2 className="size-5" />
            </div>

            <h3 className="text-lg font-semibold">
              Every location in any language
            </h3>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "🇺🇸 English",
                "🇳🇱 Dutch",
                "🇩🇪 German",
                "🇧🇷 Portuguese",
                "🇯🇵 Japanese",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--pw-line)] bg-[var(--pw-soft)] px-3 py-1.5 text-xs text-[var(--pw-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--pw-line)] bg-white p-6">
            <div className="mb-6 flex size-11 items-center justify-center rounded-2xl bg-[var(--pw-blue-pale)] text-[var(--pw-blue)]">
              <Bot className="size-5" />
            </div>

            <h3 className="text-lg font-semibold">
              Track any AI search engine
            </h3>

            <div className="mt-6 grid gap-2">
              {PLATFORM_MODELS.map((model) => (
                <div
                  key={model}
                  className="flex items-center justify-between rounded-xl bg-[var(--pw-soft)] px-3 py-2.5"
                >
                  <span className="text-xs font-medium">{model}</span>
                  <Check className="size-3.5 text-[var(--pw-green)]" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--pw-line)] bg-white p-6">
            <div className="mb-6 flex size-11 items-center justify-center rounded-2xl bg-[var(--pw-blue-pale)] text-[var(--pw-blue)]">
              <Zap className="size-5" />
            </div>

            <h3 className="text-lg font-semibold">Connect to your website</h3>

            <p className="mt-3 text-sm leading-6 text-[var(--pw-muted)]">
              Monitor AI crawlers, agent traffic and citation activity with
              integrations built for modern web stacks.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {["Cloudflare", "Fastly", "Vercel"].map((item) => (
                <div
                  key={item}
                  className="flex h-20 flex-col items-center justify-center rounded-2xl border border-[var(--pw-line)] bg-[var(--pw-soft)] px-2 text-center"
                >
                  <span className="text-xs font-semibold">{item}</span>
                  <span className="mt-1 text-[9px] text-[var(--pw-muted)]">
                    CDN Partner
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--pw-line)] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--pw-muted)]">
                  Prompt with personas
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Understand how different audiences change AI responses
                </h3>
              </div>

              <Users className="size-5 text-[var(--pw-blue)]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["SEO Lead", "Enterprise marketer"],
                ["Founder", "Growth-focused"],
                ["Product Buyer", "Evaluation mode"],
              ].map(([name, detail]) => (
                <div key={name} className="rounded-2xl bg-[var(--pw-soft)] p-4">
                  <div className="mb-3 size-8 rounded-full bg-gradient-to-br from-[rgba(36,91,255,0.20)] to-[rgba(114,85,255,0.20)]" />

                  <div className="text-xs font-medium">{name}</div>

                  <div className="mt-1 text-[10px] text-[var(--pw-muted)]">
                    {detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--pw-line)] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--pw-muted)]">
                  Branded knowledge base
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Ask Promptwatch anything
                </h3>
              </div>

              <Search className="size-5 text-[var(--pw-blue)]" />
            </div>

            <div className="rounded-2xl border border-[var(--pw-line)] bg-[var(--pw-soft)] p-4">
              <div className="flex items-center gap-2 text-xs text-[var(--pw-muted)]">
                <span className="rounded bg-[var(--pw-blue)] px-1.5 py-0.5 text-white">
                  @
                </span>
                Search your company knowledge
              </div>

              <div className="mt-4 space-y-2">
                {[
                  "geo-playbook-2026.pdf",
                  "citation-share-benchmarks.xlsx",
                  "brand-mentions-guidelines.docx",
                  "crawler-log-audit-q2.xlsx",
                ].map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5"
                  >
                    <span className="truncate text-[10px] text-[var(--pw-ink)]">
                      {file}
                    </span>

                    <ArrowRight className="size-3.5 text-[var(--pw-muted)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading
          eyebrow="Customer Stories"
          title="Built for teams that take AI Search seriously"
          description="From SEO teams to agencies, marketers use Promptwatch to measure, understand and improve their presence in AI-generated answers."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-3xl border border-[var(--pw-line)] bg-white p-6 shadow-sm"
            >
              <div className="flex gap-1 text-[var(--pw-blue)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>

              <blockquote className="mt-6 text-base leading-7 tracking-[-0.01em] text-[var(--pw-ink)]">
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-8 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-[var(--pw-soft)] text-xs font-semibold">
                  {testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <div className="text-sm font-medium">{testimonial.name}</div>

                  <div className="text-xs text-[var(--pw-muted)]">
                    {testimonial.role}
                  </div>

                  <div className="text-xs text-[var(--pw-muted)]">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--pw-line)] bg-white px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />

            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--pw-muted)]">
              Track, understand and optimize how AI search engines discover and
              recommend your brand.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--pw-line)] px-3 py-1.5 text-xs text-[var(--pw-muted)]">
              <Globe2 className="size-3.5" />
              AI Search Optimization
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              {
                title: "Product",
                links: [
                  "Visibility",
                  "Prompt Tracking",
                  "Citations",
                  "Agent Analytics",
                ],
              },
              {
                title: "Solutions",
                links: ["Brands", "Agencies", "SEO Teams", "Content Teams"],
              },
              {
                title: "Resources",
                links: ["Blog", "Academy", "Documentation", "Insights"],
              },
              {
                title: "Company",
                links: ["About", "Customers", "Pricing", "Contact"],
              },
            ].map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-[var(--pw-ink)]">
                  {column.title}
                </h3>

                <div className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      className="block text-sm text-[var(--pw-muted)] transition hover:text-[var(--pw-ink)]"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--pw-line)] pt-6 text-xs text-[var(--pw-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Promptwatch. All rights reserved.</span>

          <div className="flex gap-5">
            {["Privacy", "Terms", "Security"].map((item) => (
              <Link key={item} href="#" className="hover:text-[var(--pw-ink)]">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomeHero() {
  return (
    <section
      className={[
        "relative overflow-hidden border-b border-[var(--pw-line)]",
        "[background-image:linear-gradient(to_right,rgba(16,17,20,.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,17,20,.045)_1px,transparent_1px)]",
        "[background-size:64px_64px]",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(36,91,255,.13),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(114,85,255,.12),transparent_45%)]" />

      <div className="relative mx-auto max-w-[1280px] px-5 pb-24 pt-20 text-center sm:px-8 sm:pt-28 lg:pb-28">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--pw-line)] bg-white/80 px-3.5 py-2 text-xs font-medium text-[var(--pw-muted)] shadow-sm backdrop-blur">
          <span className="size-2 rounded-full bg-[var(--pw-green)]" />
          AI Search Optimization Platform
        </div>

        <h1 className="mx-auto max-w-5xl text-balance text-[clamp(3.25rem,7vw,6.6rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-[var(--pw-ink)]">
          Make AI Search your next{" "}
          <span className="bg-gradient-to-r from-[var(--pw-blue)] via-[var(--pw-violet)] to-[var(--pw-blue)] bg-clip-text text-transparent">
            revenue channel
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-balance text-base leading-7 text-[var(--pw-muted)] sm:text-lg">
          Track and optimize visibility in ChatGPT, Gemini and other AI Search
          engines to drive traffic to your website that converts.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton>Start Free Trial</CTAButton>
          <CTAButton variant="secondary">Book a Demo</CTAButton>
        </div>

        <p className="mt-4 text-xs text-[var(--pw-muted)]">
          No credit card required · 7-day free trial
        </p>

        <MiniDashboard />

        <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[var(--pw-muted)]">
          {[
            "AI Visibility",
            "Prompt Tracking",
            "Content Agents",
            "Offsite Citations",
            "Agent Analytics",
          ].map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <CircleDashed className="size-3.5 text-[var(--pw-blue)]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStrip() {
  return (
    <section className="border-b border-[var(--pw-line)] px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pw-muted)]">
          Join 1,780+ brands and agencies using Promptwatch
        </p>

        <div className="mt-9 grid grid-cols-2 divide-x divide-y divide-[var(--pw-line)] border-y border-[var(--pw-line)] sm:grid-cols-4 sm:divide-y-0 lg:grid-cols-8">
          {BRAND_LOGOS.map((logo) => (
            <div
              key={logo}
              className="flex h-16 items-center justify-center px-4 text-center text-sm font-semibold tracking-[-0.02em] text-[rgba(16,17,20,0.60)]"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="border-y border-[var(--pw-line)] bg-[var(--pw-soft)] px-5 py-24 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pw-blue)]">
            Insights at scale
          </p>

          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            Our data tells the story with{" "}
            <span className="text-[var(--pw-blue)]">26,520,890,000</span>{" "}
            citations, clicks, and prompts
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--pw-muted)]">
            Real prompt data and crawler logs reveal how AI search discovers,
            cites and recommends brands.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            ["100M+", "AI Search data points collected daily"],
            ["1,780+", "Brands and agencies"],
            ["5+", "Major AI platforms"],
            ["Real-time", "Crawler and citation activity"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-[var(--pw-line)] bg-white p-6 text-center"
            >
              <div className="text-3xl font-semibold tracking-[-0.05em]">
                {value}
              </div>

              <div className="mt-2 text-xs leading-5 text-[var(--pw-muted)]">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-10 text-sm font-semibold text-[rgba(16,17,20,0.50)]">
          {[
            "Yahoo Finance",
            "Wall Street Journal",
            "Seeking Alpha",
            "Axios",
          ].map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealDataSection() {
  return (
    <section className="border-y border-[var(--pw-line)] px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pw-blue)]">
            Real Data
          </p>

          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Real prompt data from real user interfaces
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--pw-muted)]">
            Monitor how AI search engines actually discover your content.
            Promptwatch combines real AI responses with crawler activity rather
            than relying on estimates alone.
          </p>

          <div className="mt-8 space-y-4">
            {[
              ["AI Overviews", "Google"],
              ["ChatGPT", "OpenAI"],
              ["Claude", "Anthropic"],
              ["Gemini", "Google"],
            ].map(([model, company]) => (
              <div
                key={model}
                className="flex items-center justify-between rounded-2xl border border-[var(--pw-line)] bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-xl bg-[var(--pw-soft)]">
                    <BrainCircuit className="size-4 text-[var(--pw-blue)]" />
                  </span>

                  <span className="text-sm font-medium">{model}</span>
                </div>

                <span className="text-xs text-[var(--pw-muted)]">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgba(255,255,255,0.10)] bg-[var(--pw-ink)] p-5 text-white shadow-[0_12px_40px_rgba(16,17,20,0.08)] sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/50">Live crawl feed</div>
              <div className="mt-1 text-lg font-semibold">Agent activity</div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(32,178,107,0.15)] px-2.5 py-1.5 text-[10px] text-[var(--pw-green)]">
              <span className="size-1.5 rounded-full bg-[var(--pw-green)]" />
              Live
            </span>
          </div>

          <div className="mt-6 space-y-2">
            {[
              ["ChatGPT", "/blog/ai-search-guide", "Cited", "Just now"],
              ["Claude", "/docs/getting-started", "Viewed", "12 sec"],
              ["Perplexity", "/pricing", "Cited", "31 sec"],
              ["Gemini", "/about", "Viewed", "2 min"],
              ["AI Overview", "/features/analytics", "Cited", "4 min"],
            ].map(([model, url, state, time]) => (
              <div
                key={`${model}-${url}`}
                className="grid grid-cols-[85px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3"
              >
                <span className="text-[10px] font-medium">{model}</span>

                <span className="truncate text-[10px] text-white/45">
                  {url}
                </span>

                <div className="flex items-center gap-3">
                  <span
                    className={cx(
                      "text-[9px]",
                      state === "Cited"
                        ? "text-[var(--pw-green)]"
                        : "text-white/40",
                    )}
                  >
                    {state}
                  </span>

                  <span className="text-[9px] text-white/35">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-5 pb-24 sm:px-8 lg:pb-32">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-[var(--pw-ink)] px-6 py-16 text-center text-white shadow-[0_12px_40px_rgba(16,17,20,0.08)] sm:px-12">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/10">
          <Target className="size-6" />
        </div>

        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
          Make AI Search your next revenue channel
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65">
          Track and optimize visibility in ChatGPT, Gemini and other AI Search
          engines to drive traffic to your website that converts.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton>Start Free Trial</CTAButton>

          <Link
            href="#"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Book a Demo
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

type FAQItem = {
  question: string;
  answer: string;
};

function FAQ({ items }: { items: readonly FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-[var(--pw-line)] px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pw-blue)]">
            Frequently Asked Questions
          </p>

          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Everything you need to know
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--pw-muted)]">
            Learn how Promptwatch helps brands succeed in AI Search.
          </p>
        </div>

        <div className="mt-12 divide-y divide-[var(--pw-line)] border-y border-[var(--pw-line)]">
          {items.map((item, index) => {
            const isOpen = open === index;

            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium tracking-[-0.01em] text-[var(--pw-ink)] sm:text-lg">
                    {item.question}
                  </span>

                  <span
                    className={[
                      "grid size-8 shrink-0 place-items-center rounded-full border border-[var(--pw-line)] transition",
                      isOpen ? "rotate-180 bg-[var(--pw-soft)]" : "",
                    ].join(" ")}
                  >
                    <ChevronDown className="size-4 text-[var(--pw-muted)]" />
                  </span>
                </button>

                <div
                  className={[
                    "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300",
                    isOpen
                      ? "grid-rows-[1fr] pb-6 opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="min-h-0">
                    <p className="max-w-3xl pr-12 text-sm leading-7 text-[var(--pw-muted)]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-[var(--pw-muted)]">
            Want a demo of Promptwatch?
          </p>

          <Link
            href="#"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--pw-blue)] hover:underline"
          >
            Book a demo
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Landing2() {
  return (
    <PromptwatchShell>
      <div className="border-b border-[rgba(36,91,255,0.10)] bg-[var(--pw-blue)] px-5 py-2.5 text-center text-xs font-medium text-white sm:px-8">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="size-3.5" />
          We raised €6M to power the leading Agentic AI Search Optimization
          platform.
          <Link href="#" className="underline underline-offset-2">
            Learn more →
          </Link>
        </span>
      </div>

      <header className="sticky top-0 z-50 border-b border-[rgba(231,233,237,0.80)] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {["Solutions", "Resources", "Customers", "Pricing"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm font-medium text-[var(--pw-muted)] transition hover:text-[var(--pw-ink)]"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="hidden text-sm font-medium text-[var(--pw-muted)] transition hover:text-[var(--pw-ink)] sm:block"
            >
              Sign in
            </Link>

            <CTAButton>Start Free Trial</CTAButton>
          </div>
        </div>
      </header>

      <HomeHero />
      <BrandStrip />

      <section className="px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading
            eyebrow="Platform"
            title="Everything you need to win in AI search"
            description="Track, analyze, and optimize your brand's presence across ChatGPT, Claude, Gemini, Perplexity and other AI search engines."
          />

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {FEATURE_CARDS.map((card) => (
              <FeatureCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      </section>

      <ProductSection
        eyebrow="Content Agents"
        title="Create content that gets cited by AI"
        description="Analyze what gets recommended by ChatGPT, Claude, Perplexity and AI Overviews, then produce content designed around real citation data."
        type="content"
      />

      <StatsSection />

      <ProductSection
        eyebrow="Agentic Shopping"
        title="Get real insights from real prompts"
        description="Access real AI responses to understand which products, brands and sources are actually being recommended to users."
        type="shopping"
        reversed
      />

      <ProductSection
        eyebrow="Agent Analytics"
        title="Know in real time when you are cited by ChatGPT"
        description="See when AI crawlers and citation agents view your content, which pages they read and which experiences turn into visibility."
        type="crawler"
      />

      <RealDataSection />

      <ProductSection
        eyebrow="Offsite Citations"
        title="See exactly what citations drive visibility"
        description="Understand which external sources influence AI recommendations and find the offsite opportunities that can improve your brand's share of voice."
        type="citation"
        reversed
      />

      <PlatformSection />
      <Testimonials />
      <CTASection />

      <FAQ items={FAQ_ITEMS} />
      <Footer />
    </PromptwatchShell>
  );
}
