"use client";

import React, { useState } from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import { LeadData, LeadFormField } from "@/types/PageCMS/pageSchema";

// ─── Local types ──────────────────────────────────────────────────────────────

/** Raw form state — all values start as string | boolean before conversion. */
type RawValues = Record<string, string | boolean>;
type FieldErrors = Record<string, string>;

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(
  fields: LeadFormField[],
  values: RawValues,
): FieldErrors {
  const errs: FieldErrors = {};
  for (const field of fields) {
    if (!field.required) continue;

    const raw = values[field.id];

    if (field.type === "custom_checkbox") {
      if (!raw) errs[field.id] = "This field is required.";
    } else {
      const str = String(raw ?? "").trim();
      if (!str) {
        errs[field.id] = `${field.label} is required.`;
      } else if (field.type === "email" && !EMAIL_RE.test(str)) {
        errs[field.id] = "Please enter a valid email address.";
      }
    }
  }
  return errs;
}

// ─── Shared input class tokens ────────────────────────────────────────────────

const inputBase = [
  "w-full rounded-2xl border-2 border-gray-200",
  "px-5 py-3.5 text-base",
  "placeholder:text-gray-400 outline-none",
  "focus:border-[var(--tk-accent-primary)] transition-colors duration-150",
].join(" ");

const inputError = "!border-red-400 focus:!border-red-400";

const themedInputStyle: React.CSSProperties = {
  color: "var(--tk-text-body)",
  backgroundColor: "var(--tk-card-bg)",
};

// ─── FieldInput — renders the correct input for each LeadFieldType ────────────

function FieldInput({
  field,
  value,
  hasError,
  onChange,
}: {
  field: LeadFormField;
  value: string | boolean;
  hasError: boolean;
  onChange: (id: string, val: string | boolean) => void;
}) {
  const cls = `${inputBase} ${hasError ? inputError : ""}`;

  // ── Checkbox ────────────────────────────────────────────────────────────────
  if (field.type === "custom_checkbox") {
    const checked = Boolean(value);
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(field.id, !checked)}
        className="flex items-start gap-3 cursor-pointer group"
      >
        <span
          className={[
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center",
            "rounded-md border-2 transition-all duration-150",
            checked
              ? ""
              : "border-gray-300 bg-white group-hover:border-gray-400",
            hasError && !checked ? "border-red-400" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={
            checked
              ? {
                  borderColor: "var(--tk-accent-primary)",
                  backgroundColor: "var(--tk-accent-primary)",
                }
              : undefined
          }
        >
          {checked && (
            <svg
              className="h-3 w-3"
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
        <span
          className="text-sm leading-relaxed"
          style={{
            color: checked ? "var(--tk-text-heading)" : "var(--tk-text-body)",
          }}
        >
          {field.checkboxLabel ?? field.label}
        </span>
      </button>
    );
  }

  // ── Select-based fields: country | industry | custom_dropdown ───────────────
  if (
    field.type === "country" ||
    field.type === "industry" ||
    field.type === "custom_dropdown"
  ) {
    return (
      <div className="relative">
        <select
          value={String(value)}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`${cls} appearance-none pr-12 cursor-pointer`}
          style={themedInputStyle}
        >
          <option value="" disabled>
            {field.placeholder ?? "Select an option…"}
          </option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    );
  }

  // ── Number ──────────────────────────────────────────────────────────────────
  if (field.type === "custom_number") {
    return (
      <input
        type="number"
        className={cls}
        style={themedInputStyle}
        placeholder={field.placeholder ?? "Enter a number…"}
        value={String(value)}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    );
  }

  // ── Phone ───────────────────────────────────────────────────────────────────
  if (field.type === "phone") {
    return (
      <input
        type="tel"
        className={cls}
        style={themedInputStyle}
        placeholder={field.placeholder ?? "+1 (555) 000-0000"}
        value={String(value)}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    );
  }

  // ── Email ───────────────────────────────────────────────────────────────────
  if (field.type === "email") {
    return (
      <input
        type="email"
        className={cls}
        style={themedInputStyle}
        placeholder={field.placeholder ?? "you@example.com"}
        value={String(value)}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    );
  }

  // ── Default: text (first_name | last_name | custom_text) ────────────────────
  return (
    <input
      type="text"
      className={cls}
      style={themedInputStyle}
      placeholder={field.placeholder ?? ""}
      value={String(value)}
      onChange={(e) => onChange(field.id, e.target.value)}
    />
  );
}

// ─── Inline error message ─────────────────────────────────────────────────────

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
      <svg
        className="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * LeadFormPage — full-page lead capture intercept rendered by FunnelContainer
 * between the last quiz step and the result page.
 *
 * Behaviour:
 *  - Reads lead_form config from the Zustand store schema.
 *  - Validates required fields client-side before calling submitLeadForm().
 *  - Shows a loading state (isCalculating) while scores are being computed.
 *  - Renders a "Skip" link when lead_signup_required is false.
 */
export function LeadFormPage() {
  const schema = useFunnelStore((s) => s.schema);
  const leadData = useFunnelStore((s) => s.leadData);
  const submitLeadForm = useFunnelStore((s) => s.submitLeadForm);
  const skipLeadForm = useFunnelStore((s) => s.skipLeadForm);
  const prevStep = useFunnelStore((s) => s.prevStep);
  const isCalculating = useFunnelStore((s) => s.isCalculating);

  const leadForm = schema?.lead_form;

  // ── Initial form values keyed by field id ──────────────────────────────────
  const [values, setValues] = useState<RawValues>(() => {
    const init: RawValues = {};
    (leadForm?.fields ?? []).forEach((f) => {
      const existing = leadData[f.id];
      init[f.id] =
        f.type === "custom_checkbox"
          ? Boolean(existing ?? false)
          : String(existing ?? "");
    });
    return init;
  });

  const [errors, setErrors] = useState<FieldErrors>({});

  // Guard: schema or lead_form not yet loaded
  if (!leadForm) return null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (id: string, val: string | boolean) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    // Clear the per-field error as the user starts correcting it
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    const errs = validateFields(leadForm.fields, values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Convert raw HTML-string values to properly typed LeadData
    const leadData: LeadData = {};
    leadForm.fields.forEach((f) => {
      const raw = values[f.id];
      if (f.type === "custom_checkbox") {
        leadData[f.id] = Boolean(raw);
      } else if (f.type === "custom_number") {
        const n = parseFloat(String(raw));
        leadData[f.id] = isNaN(n) ? 0 : n;
      } else {
        leadData[f.id] = String(raw ?? "").trim();
      }
    });

    submitLeadForm(leadData);
  };

  const isRequired = leadForm.lead_signup_required;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center min-h-screen py-16 px-4 gap-8">
      {/* ── Back button ── */}
      <div className="w-full max-w-md">
        <button
          onClick={prevStep}
          disabled={isCalculating}
          aria-label="Go back to previous step"
          className="flex items-center gap-2 text-sm font-medium text-gray-500
                     hover:text-[var(--tk-text-link)] transition-colors group
                     disabled:opacity-40 disabled:cursor-not-allowed"
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
          Back
        </button>
      </div>

      {/* ── Heading ── */}
      <div className="text-center max-w-md space-y-3">
        <h1
          className="text-4xl md:text-5xl leading-tight"
          style={{
            color: "var(--tk-text-heading)",
            fontFamily: "var(--tk-font-heading)",
            fontWeight:
              "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
          }}
        >
          {leadForm.heading ?? "Almost there!"}
        </h1>
        {leadForm.subtext && (
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--tk-text-body)" }}
          >
            {leadForm.subtext}
          </p>
        )}
      </div>

      {/* ── Form fields ── */}
      <div className="w-full max-w-md space-y-5">
        {leadForm.fields.map((field) => (
          <div key={field.id}>
            {/* Label — hidden for checkbox since the label is rendered inline */}
            {field.type !== "custom_checkbox" && (
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--tk-text-heading)" }}
              >
                {field.label}
                {field.required && (
                  <span className="text-red-400 ml-1" aria-hidden="true">
                    *
                  </span>
                )}
              </label>
            )}

            <FieldInput
              field={field}
              value={
                values[field.id] ??
                (field.type === "custom_checkbox" ? false : "")
              }
              hasError={Boolean(errors[field.id])}
              onChange={handleChange}
            />

            {errors[field.id] && <FieldError message={errors[field.id]} />}
          </div>
        ))}
      </div>

      {/* ── Privacy notice ── */}
      {leadForm.privacy_notice && (
        <div
          className="flex items-center gap-2 text-xs max-w-md w-full"
          style={{ color: "var(--tk-text-body)" }}
        >
          <svg
            className="w-3.5 h-3.5 shrink-0 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>{leadForm.privacy_notice}</span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="w-full max-w-md flex flex-col items-center gap-4">
        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isCalculating}
          className={[
            "w-full py-4 rounded-full font-semibold text-base",
            "transition-all duration-200 flex items-center justify-center gap-2",
            isCalculating
              ? "cursor-not-allowed opacity-60"
              : "hover:brightness-90 active:scale-95",
          ].join(" ")}
          style={{
            backgroundColor: "var(--tk-accent-primary)",
            color: "var(--tk-accent-primary-fg)",
            boxShadow: isCalculating
              ? undefined
              : "0 10px 25px -8px var(--tk-accent-primary-border)",
          }}
        >
          {isCalculating ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Calculating your score…
            </>
          ) : (
            (leadForm.submit_label ?? "Get My Results")
          )}
        </button>

        {/* Skip link — only shown when the form is optional */}
        {!isRequired && !isCalculating && (
          <button
            onClick={() => skipLeadForm()}
            className="text-sm hover:text-[var(--tk-text-link)]
                       transition-colors underline underline-offset-2
                       decoration-gray-300 hover:decoration-[var(--tk-text-link)]"
            style={{ color: "var(--tk-text-body)" }}
          >
            {leadForm.skip_label ?? "Skip for now"}
          </button>
        )}
      </div>
    </div>
  );
}
