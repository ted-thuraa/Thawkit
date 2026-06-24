"use client";

import React, { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  DailyAnalyticsData,
  TimeRange,
} from "@/lib/querries/campaignAnalytics";
import { AppVisitsChart } from "./appVisitsChart";

type ClientWrapperProps = {
  initialData: DailyAnalyticsData[];
  timeRange: TimeRange;
};

/**
 * Handles the client-side interaction (time range selection)
 * by updating the URL search parameters, which triggers a re-fetch
 * on the server component (the parent page).
 */
export function AppVisitsClientSideWrapper({
  initialData,
  timeRange,
}: ClientWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTimeRangeChange = useCallback(
    (range: TimeRange) => {
      // Construct the new URL with the updated 'range' search parameter
      const newUrl = `${pathname}?range=${range}`;
      // router.replace is typically better than router.push for non-history-altering changes
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  return (
    <AppVisitsChart
      initialData={initialData}
      timeRange={timeRange}
      onTimeRangeChange={handleTimeRangeChange}
    />
  );
}
