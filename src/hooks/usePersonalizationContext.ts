"use client";

import { useMemo } from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import { buildPersonalizationContext } from "@/lib/funnelPersonalisation/buildContext";
import { PersonalizationContext } from "@/lib/funnelPersonalisation/types";

/**
 * Single call site for deriving the Result Page's PersonalizationContext.
 * Memoized against the store slices it depends on — every consumer that
 * calls this hook within the same render tree gets a referentially-stable
 * context object as long as schema/scoreResult/leadData haven't changed,
 * which is what lets downstream cards (e.g. DetailedCategoryResults'
 * per-category cards) cheaply share it as a prop without each re-deriving
 * their own copy.
 */
export function usePersonalizationContext(): PersonalizationContext {
  const schema = useFunnelStore((s) => s.schema);
  const scoreResult = useFunnelStore((s) => s.scoreResult);
  const leadData = useFunnelStore((s) => s.leadData);
  const calcResults = useFunnelStore((s) => s.calcResults);

  return useMemo(
    () =>
      buildPersonalizationContext(schema, scoreResult, leadData, calcResults),
    [schema, scoreResult, leadData, calcResults],
  );
}
