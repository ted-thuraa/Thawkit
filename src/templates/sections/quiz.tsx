"use client";

import React from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import {
  PageSection,
  QuestionCategory,
  QuizSectionContent,
  QuizOptions,
} from "@/types/PageCMS/pageSchema";

type Props = {
  section: PageSection;
  pageId: string;
};

/**
 * Renders a pill showing the question's category (if any).
 * Reads the category definition from the store's schema so the
 * badge title/icon is always in sync with the registry.
 */
function CategoryBadge({ categoryIds }: { categoryIds: string[] }) {
  const schema = useFunnelStore((s) => s.schema);
  if (!schema?.questionCategories || categoryIds.length === 0) return null;

  const matchedCategories = categoryIds
    .map((id) => schema.questionCategories!.find((c) => c.id === id))
    .filter(Boolean) as QuestionCategory[];

  if (matchedCategories.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {matchedCategories.map((cat) => (
        <span
          key={cat.id}
          className="inline-flex items-center gap-1.5 rounded-full border 
                      px-3 py-1 text-xs font-medium "
          style={{
            backgroundColor: "var(--tk-accent-primary-bg)",
            borderColor: "var(--tk-accent-primary-border)",
            color: "var(--tk-accent-primary)",
          }}
        >
          <span aria-hidden="true">{cat.icon}</span>
          {cat.title}
        </span>
      ))}
    </div>
  );
}

// ─── Shared wrapper (heading + subtext + back button) ─────────────────────────
//
// Intentionally contains NO forward navigation. Navigation for an entire
// normal_page is owned by PageProceedButton in funnelContainer — a page-level
// concern. This shell is purely a question-presentation wrapper.

function QuizShell({
  content,
  children,
  onBack,
}: {
  content: QuizSectionContent;
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-16 px-4 gap-10">
      {/* Back button */}
      <div className="w-full max-w-2xl">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center gap-2 text-sm font-medium text-gray-500
                     hover:text-[var(--tk-text-link)] transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {content.goBack_cta?.label ?? "Back"}
        </button>
      </div>

      {/* Heading */}
      <div className="text-center max-w-2xl space-y-3">
        <CategoryBadge categoryIds={content.categoryIds ?? []} />
        <h1
          className="text-4xl md:text-5xl  leading-tight"
          style={{
            color: "var(--tk-text-heading)",
            fontFamily: "var(--tk-font-heading)",
            fontWeight:
              "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
          }}
          dangerouslySetInnerHTML={{ __html: content.quizHeading }}
        />
        {content.quizSubtext && (
          <p className="text-base " style={{ color: "var(--tk-text-body)" }}>
            {content.quizSubtext}
          </p>
        )}
      </div>

      {/* Question-specific input */}
      {children}
    </div>
  );
}

// ─── 1. Choice Question (single_choice / multiple_choice) ─────────────────────

function ChoiceQuestion({
  content,
  sectionId,
  multi,
}: {
  content: QuizSectionContent;
  sectionId: string;
  multi: boolean;
}) {
  const toggleChoice = useFunnelStore((s) => s.toggleChoice);
  const answers = useFunnelStore((s) => s.answers);
  const selected = (answers[sectionId] as string[] | undefined) ?? [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
      {(content.quizOptions ?? []).map((option: QuizOptions) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => toggleChoice(sectionId, option.id, multi)}
            aria-pressed={isSelected}
            className={`
              group relative flex flex-col gap-2 rounded-2xl border-2 p-6 text-left
              cursor-pointer transition-all duration-200 outline-none
              focus-visible:ring-2 focus-visible:ring-offset-2
              ${
                isSelected
                  ? "shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
              }
            `}
            style={{
              ...(isSelected
                ? {
                    borderColor: "var(--tk-accent-primary)",
                    backgroundColor: "var(--tk-accent-primary-bg)",
                  }
                : { backgroundColor: "var(--tk-card-bg)" }),
              // CSS var-based focus ring colour — Tailwind's ring utilities
              // can't reference dynamic vars directly, so it's set here.
              ["--tw-ring-color" as string]: "var(--tk-accent-primary)",
            }}
          >
            {option.icon && (
              <span className="text-2xl leading-none">{option.icon}</span>
            )}
            <span
              className="font-semibold text-base"
              style={{
                color: isSelected
                  ? "var(--tk-accent-primary)"
                  : "var(--tk-text-heading)",
              }}
            >
              {option.title}
            </span>
            {option.description && (
              <span
                className="text-sm leading-relaxed"
                style={{ color: "var(--tk-text-body)" }}
              >
                {option.description}
              </span>
            )}

            {/* Selection indicator — circle for single, checkbox for multi */}
            <span
              className={`
                absolute top-4 right-4 flex h-5 w-5 items-center justify-center
                transition-all duration-150
                ${
                  isSelected
                    ? multi
                      ? "rounded-md"
                      : "rounded-full"
                    : `border-2 border-gray-300 ${multi ? "rounded-md" : "rounded-full"}`
                }
              `}
              style={
                isSelected
                  ? { backgroundColor: "var(--tk-accent-primary)" }
                  : undefined
              }
            >
              {isSelected && (
                <svg
                  className="h-3 w-3 "
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{ color: "var(--tk-accent-primary-fg)" }}
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── 2. Text Question (short_text / long_text) ────────────────────────────────

function TextQuestion({
  content,
  sectionId,
  multiLine,
}: {
  content: QuizSectionContent;
  sectionId: string;
  multiLine: boolean;
}) {
  const setAnswer = useFunnelStore((s) => s.setAnswer);
  const answers = useFunnelStore((s) => s.answers);
  const value = (answers[sectionId] as string | undefined) ?? "";

  const sharedClass = `
    w-full max-w-2xl rounded-2xl border-2 border-gray-200 p-4 text-base
    placeholder:text-gray-400 outline-none
    focus:border-[var(--tk-accent-primary)] transition-colors duration-150 resize-none
  `;

  const sharedStyle = {
    color: "var(--tk-text-body)",
    backgroundColor: "var(--tk-card-bg)",
  };

  return multiLine ? (
    <textarea
      className={`${sharedClass} min-h-[160px]`}
      style={sharedStyle}
      placeholder={content.placeholder ?? "Type your answer here…"}
      value={value}
      onChange={(e) => setAnswer(sectionId, e.target.value)}
      rows={6}
    />
  ) : (
    <input
      type="text"
      className={sharedClass}
      style={sharedStyle}
      placeholder={content.placeholder ?? "Type your answer here…"}
      value={value}
      onChange={(e) => setAnswer(sectionId, e.target.value)}
    />
  );
}

// ─── 3. Number Question ───────────────────────────────────────────────────────

function NumberQuestion({
  content,
  sectionId,
}: {
  content: QuizSectionContent;
  sectionId: string;
}) {
  const setAnswer = useFunnelStore((s) => s.setAnswer);
  const answers = useFunnelStore((s) => s.answers);
  const value = answers[sectionId] as number | undefined;

  return (
    <input
      type="number"
      className="
        w-full max-w-2xl rounded-2xl border-2 border-gray-200 p-4 text-base
        placeholder:text-gray-400 outline-none
        focus:border-[var(--tk-accent-primary)] transition-colors duration-150
      "
      style={{
        color: "var(--tk-text-body)",
        backgroundColor: "var(--tk-card-bg)",
      }}
      placeholder={content.placeholder ?? "Enter a number…"}
      value={value ?? ""}
      onChange={(e) => {
        const parsed = parseFloat(e.target.value);
        if (!isNaN(parsed)) setAnswer(sectionId, parsed);
        else setAnswer(sectionId, "");
      }}
    />
  );
}

// ─── 4. Scale Question ────────────────────────────────────────────────────────

function ScaleQuestion({
  content,
  sectionId,
}: {
  content: QuizSectionContent;
  sectionId: string;
}) {
  const setAnswer = useFunnelStore((s) => s.setAnswer);
  const answers = useFunnelStore((s) => s.answers);

  const min = content.config?.scaleMin ?? 1;
  const max = content.config?.scaleMax ?? 10;
  const mid = Math.round((min + max) / 2);
  const value = (answers[sectionId] as number | undefined) ?? mid;

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Current value bubble */}
      <div className="flex justify-center">
        <span
          className="text-5xl font-bold "
          style={{ color: "var(--tk-accent-primary)" }}
        >
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setAnswer(sectionId, parseInt(e.target.value, 10))}
        className="w-full accent-[var(--tk-accent-primary)] cursor-pointer"
      />

      {/* Min / Max labels */}
      <div
        className="flex justify-between text-sm"
        style={{ color: "var(--tk-text-body)" }}
      >
        <span>{content.config?.scaleMinLabel ?? min}</span>
        <span>{content.config?.scaleMaxLabel ?? max}</span>
      </div>
    </div>
  );
}

// ─── Root Renderer ────────────────────────────────────────────────────────────

/**
 * Quiz1 is a pure answering component. It renders the question heading,
 * category badge, back button, and the appropriate input for the question
 * type. It does NOT own forward navigation.
 *
 * Forward navigation (ProceedButton) is the responsibility of
 * PageProceedButton in funnelContainer, which operates at the page level
 * and activates only when ALL quiz sections on the current page are answered.
 * This ensures users view and answer every section before advancing.
 */
export const Quiz1 = ({ section, pageId }: Props) => {
  const prevStep = useFunnelStore((s) => s.prevStep);
  const answers = useFunnelStore((s) => s.answers);

  const content = section.content as QuizSectionContent;
  const qType = content.questionType ?? "single_choice";
  const sectionId = section.id;

  return (
    <QuizShell content={content} onBack={prevStep}>
      {(qType === "single_choice" || qType === "multiple_choice") && (
        <ChoiceQuestion
          content={content}
          sectionId={sectionId}
          multi={qType === "multiple_choice"}
        />
      )}
      {qType === "short_text" && (
        <TextQuestion
          content={content}
          sectionId={sectionId}
          multiLine={false}
        />
      )}
      {qType === "long_text" && (
        <TextQuestion
          content={content}
          sectionId={sectionId}
          multiLine={true}
        />
      )}
      {qType === "number" && (
        <NumberQuestion content={content} sectionId={sectionId} />
      )}
      {qType === "scale" && (
        <ScaleQuestion content={content} sectionId={sectionId} />
      )}
    </QuizShell>
  );
};
