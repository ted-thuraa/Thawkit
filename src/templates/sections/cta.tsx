// File: cta.tsx
"use client";

import React, { useState } from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import {
  CTAFormSection,
  LeadFormField,
  PageSection,
} from "@/types/PageCMS/pageSchema";

type Props = {
  section: PageSection;
};

type RawValues = Record<string, string | boolean>;

// Legacy fallback — preserves current behaviour for any CTA content authored
// before `content.fields` existed (e.g. the landing page's newsletter card).
const DEFAULT_EMAIL_FIELD: LeadFormField = {
  id: "email",
  type: "email",
  label: "Email address",
  required: true,
};

export const Cta1 = ({ section }: Props) => {
  const content = section.content as CTAFormSection;

  const leadData = useFunnelStore((s) => s.leadData);
  const updateLeadData = useFunnelStore((s) => s.updateLeadData);
  const nextStep = useFunnelStore((s) => s.nextStep);

  // ── Dynamic field list for THIS instance ──────────────────────────────
  const fields: LeadFormField[] =
    content.fields && content.fields.length > 0
      ? content.fields
      : [DEFAULT_EMAIL_FIELD];

  // ── Local state, hydrated from anything already captured earlier in the
  //    funnel (e.g. an even-earlier CTA collected the same field id) ─────
  const [values, setValues] = useState<RawValues>(() => {
    const init: RawValues = {};
    fields.forEach((f) => {
      const existing = leadData[f.id];
      init[f.id] =
        f.type === "custom_checkbox"
          ? Boolean(existing ?? false)
          : String(existing ?? "");
    });
    return init;
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (id: string, val: string | boolean) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    if (error) setError(null);
  };

  const handleSubmit = () => {
    // Validate only the fields actually rendered in this section instance.
    for (const field of fields) {
      if (!field.required) continue;
      const raw = values[field.id];
      if (field.type === "custom_checkbox") {
        if (!raw) {
          setError(`${field.checkboxLabel ?? field.label} is required.`);
          return;
        }
      } else if (String(raw ?? "").trim().length === 0) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    // ── Dynamic capture: build a payload containing ONLY keys for fields
    //    rendered here. Blank optional fields are omitted entirely so they
    //    can never overwrite a value already merged in from elsewhere. ────
    const payload: Partial<Record<string, string | boolean | number>> = {};
    fields.forEach((f) => {
      const raw = values[f.id];
      if (f.type === "custom_checkbox") {
        payload[f.id] = Boolean(raw);
      } else if (f.type === "custom_number") {
        const n = parseFloat(String(raw));
        if (!isNaN(n)) payload[f.id] = n;
      } else {
        const str = String(raw ?? "").trim();
        if (str.length > 0) payload[f.id] = str;
      }
    });

    updateLeadData(payload); // merge into global leadData
    nextStep(); // advance the funnel — same pattern as hero.tsx's primary CTA
  };

  const renderField = (field: LeadFormField) => {
    const value =
      values[field.id] ?? (field.type === "custom_checkbox" ? false : "");

    if (field.type === "custom_checkbox") {
      return (
        <label
          key={field.id}
          className="flex items-center gap-2 text-xs text-zinc-400 ml-1"
        >
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleChange(field.id, e.target.checked)}
            className="h-4 w-4 rounded accent-[#c5f0a4]"
          />
          {field.checkboxLabel ?? field.label}
        </label>
      );
    }

    const inputType =
      field.type === "email"
        ? "email"
        : field.type === "phone"
          ? "tel"
          : field.type === "custom_number"
            ? "number"
            : "text";

    return (
      <input
        key={field.id}
        type={inputType}
        placeholder={field.placeholder ?? field.label}
        value={String(value)}
        onChange={(e) => handleChange(field.id, e.target.value)}
        className="w-full bg-[#1a4b44] border-none text-zinc-300 placeholder:text-zinc-500 rounded-full py-4 px-6 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
      />
    );
  };

  return (
    <section className=" font-sans">
      <div className=" ">
        <div className="max-w-6xl mx-auto bg-[#0b3d36] rounded-[40px] p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Text Content */}
          <div className="flex-1 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-[1.1] tracking-tight">
              {content.heading}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
              {content.subtext}
            </p>
          </div>

          {/* Right Column: Dynamic Form Content */}
          <div className="w-full lg:w-auto flex flex-col gap-4 min-w-[320px] md:min-w-[440px]">
            {content.form_eyebrow && (
              <p className="text-zinc-400 text-sm mb-1 ml-1">
                {content.form_eyebrow}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="flex flex-col gap-3 w-full">
                {fields.map(renderField)}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-[#c5f0a4] hover:bg-[#b5e692] text-[#0b3d36] font-semibold py-4 px-8 rounded-full transition-colors whitespace-nowrap"
              >
                {content.submit_label ?? "Subscribe"}
              </button>
            </div>

            {error && <p className="text-red-400 text-xs ml-1">{error}</p>}

            {content.privacy_notice && (
              <p className="text-[11px] md:text-xs text-zinc-500 mt-2 text-center lg:text-left">
                {content.privacy_notice}{" "}
                {content.privacy_policy_cta && (
                  <a
                    href={content.privacy_policy_cta.href}
                    className="underline underline-offset-2 hover:text-zinc-300 transition-colors"
                  >
                    {content.privacy_policy_cta.label}
                  </a>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
