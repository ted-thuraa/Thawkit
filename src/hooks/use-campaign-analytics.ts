"use client";

import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

// Hook to be used in client components
export const useCampaignAnalytics = (
  projectId: string,
  funnelPageId?: string
) => {
  const sessionRef = useRef<string | null>(null);

  // 1. Get/Set Visitor ID (Long-term, e.g., 1 year)
  const getVisitorId = () => {
    if (typeof window === "undefined") return "server-side";
    let vid = localStorage.getItem("analytics_vid");
    if (!vid) {
      vid = uuidv4();
      localStorage.setItem("analytics_vid", vid);
    }
    return vid;
  };

  // 2. Get/Set Session ID (Short-term, e.g., browser tab)
  const getSessionId = () => {
    if (!sessionRef.current) {
      sessionRef.current = uuidv4();
    }
    return sessionRef.current;
  };

  const trackEvent = async (
    eventType: string,
    extraData: Record<string, any> = {}
  ) => {
    if (typeof window === "undefined") return;

    const payload = {
      projectId,
      funnelPageId,
      eventType,
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      metadata: extraData,
      timestamp: Date.now(),
    };

    // Use sendBeacon for reliability on navigation, fallback to fetch
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    const endpoint = "/api/analytics/track";

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((err) => console.error(err));
    }
  };

  return { trackEvent };
};
