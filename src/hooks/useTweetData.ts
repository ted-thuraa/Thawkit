import { useState, useEffect, useCallback, useRef } from "react";
import { TweetData } from "@/lib/utils/tweetUtils";

interface UseTweetDataOptions {
  lazy?: boolean;
  showThread?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  cacheTimeout?: number;
}

interface CacheEntry {
  data: TweetData;
  timestamp: number;
}

/**
 * Custom hook for fetching and managing tweet data
 * Provides advanced error handling, caching, and retry logic
 */
export const useTweetData = (
  tweetUrl: string,
  options: UseTweetDataOptions = {}
) => {
  const {
    lazy = true,
    showThread = false,
    retryAttempts = 3,
    retryDelay = 1000,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [retryCount, setRetryCount] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  // Extract tweet ID from various URL formats
  const extractTweetId = useCallback((url: string): string | null => {
    if (!url || typeof url !== "string") return null;

    // Clean the URL
    const cleanUrl = url.trim().replace(/[?#].*$/, "");

    // Handle various Twitter URL formats
    const patterns: RegExp[] = [
      // Standard formats
      /(?:twitter|x)\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i,
      /(?:mobile\.)?(?:twitter|x)\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i,
      // Shortened URLs (we'll need to expand these)
      /t\.co\/\w+/i,
      // Direct tweet ID (if just a number is provided)
      /^(\d{15,20})$/,
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        // Return the tweet ID (last capture group for URL patterns, first for direct ID)
        return match[match.length - 1] || match[1];
      }
    }

    return null;
  }, []);

  // Cache management
  const getCachedData = useCallback(
    (tweetId: string): TweetData | null => {
      const cached = cacheRef.current.get(tweetId);
      if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        return cached.data;
      }
      return null;
    },
    [cacheTimeout]
  );

  const setCachedData = useCallback((tweetId: string, data: TweetData) => {
    cacheRef.current.set(tweetId, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  // Enhanced tweet data fetching with multiple fallback strategies
  const fetchTweetData = useCallback(
    async (tweetId: string, attempt: number = 0): Promise<TweetData> => {
      if (!tweetId) {
        throw new Error("Invalid tweet ID");
      }

      // Check cache first
      const cachedData = getCachedData(tweetId);
      if (cachedData) {
        return cachedData;
      }

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const fetchStrategies = [
        // Strategy 1: Use the internal API route to bypass CORS
        async () => {
          const internalApiUrl = `/api/tweet/oembed?tweetId=${tweetId}&showThread=${!showThread}`;
          const response = await fetch(internalApiUrl, { signal });

          if (!response.ok) {
            throw new Error(`Internal API error: ${response.status}`);
          }

          return await response.json();
        },
      ];
      let lastError: any;

      // Try each strategy
      for (let i = 0; i < fetchStrategies.length; i++) {
        try {
          const rawData = await fetchStrategies[i]();
          const structuredData = parseOEmbedData(rawData, tweetId);

          // Cache successful result
          setCachedData(tweetId, structuredData);
          return structuredData;
        } catch (err: any) {
          lastError = err;
          console.warn(`Fetch strategy ${i + 1} failed:`, err.message);

          // If this was an abort, don't try other strategies
          if (err.name === "AbortError") {
            throw err;
          }
        }
      }

      // If all strategies failed, throw the last error
      throw lastError || new Error("All fetch strategies failed");
    },
    [showThread, getCachedData, setCachedData]
  );

  // Parse oEmbed data into structured format
  const parseOEmbedData = useCallback(
    (oembedData: any, tweetId: string): TweetData => {
      if (!oembedData || !oembedData.html) {
        throw new Error("Invalid oEmbed response");
      }

      try {
        // Parse the HTML to extract structured data
        const parser = new DOMParser();
        const doc = parser.parseFromString(oembedData.html, "text/html");
        const blockquote = doc.querySelector("blockquote.twitter-tweet");

        if (!blockquote) {
          throw new Error("No tweet content found in oEmbed response");
        }

        // Extract tweet text
        const textElements = blockquote.querySelectorAll("p");
        const tweetText = Array.from(textElements)
          .map((p) => p.textContent)
          .filter((text) => text && !text.includes("—"))
          .join("\n")
          .trim();

        // Extract author information
        const authorLink = blockquote.querySelector(
          'a[href*="twitter.com"], a[href*="x.com"]'
        );
        let authorName = "Unknown User";
        let username = "unknown";

        if (authorLink) {
          const authorText = authorLink.textContent || "";
          const match = authorText.match(/^@?(\w+)/);
          if (match) {
            username = match[1];
            authorName = username;
          }
        }

        // Extract date
        const dateLink = blockquote.querySelector('a[href*="/status/"]');
        const dateText =
          dateLink?.textContent || new Date().toLocaleDateString();

        // Extract URL
        const tweetUrl =
          (dateLink as HTMLAnchorElement)?.href ||
          `https://twitter.com/${username}/status/${tweetId}`;

        return {
          id: tweetId,
          text: tweetText,
          author: {
            name: authorName,
            username: username,
            profile_image_url: `https://unavatar.io/twitter/${username}`,
          },
          created_at: dateText,
          public_metrics: {
            like_count: 0,
            retweet_count: 0,
            reply_count: 0,
          },
          url: tweetUrl,
          html: oembedData.html,
          provider: oembedData.provider_name || "Twitter",
          width: oembedData.width,
          height: oembedData.height,
        };
      } catch (err: any) {
        throw new Error(`Failed to parse tweet data: ${err.message}`);
      }
    },
    []
  );

  // Retry logic with exponential backoff
  const retryFetch = useCallback(
    async (tweetId: string): Promise<TweetData> => {
      if (retryCount >= retryAttempts) {
        throw new Error(
          `Failed to fetch tweet after ${retryAttempts} attempts`
        );
      }

      const delay = retryDelay * Math.pow(2, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));

      setRetryCount((prev) => prev + 1);
      return fetchTweetData(tweetId, retryCount + 1);
    },
    [retryCount, retryAttempts, retryDelay, fetchTweetData]
  );

  // Main fetch function with error handling and retry logic
  const loadTweetData = useCallback(
    async (url: string): Promise<TweetData | void> => {
      const tweetId = extractTweetId(url);

      if (!tweetId) {
        throw new Error(
          "Invalid tweet URL format. Please provide a valid Twitter/X URL."
        );
      }

      try {
        setLoading(true);
        setError(null);
        setRetryCount(0);

        const data = await fetchTweetData(tweetId);
        setTweetData(data);
        return data;
      } catch (err: any) {
        // Handle specific error types
        if (err.name === "AbortError") {
          return; // Request was cancelled, don't set error
        }

        // Try retry for certain error types
        if (
          retryCount < retryAttempts &&
          (err.message.includes("fetch") ||
            err.message.includes("network") ||
            err.message.includes("timeout"))
        ) {
          try {
            const data = await retryFetch(tweetId);
            setTweetData(data);
            return data;
          } catch (retryErr: any) {
            setError(retryErr.message);
            throw retryErr;
          }
        } else {
          setError(err.message);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [extractTweetId, fetchTweetData, retryFetch, retryCount, retryAttempts]
  );

  // Load tweet when visible and URL is provided
  useEffect(() => {
    if (!isVisible || !tweetUrl) return;

    loadTweetData(tweetUrl).catch((err) => {
      console.error("Failed to load tweet:", err);
    });

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isVisible, tweetUrl, loadTweetData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    tweetData,
    loading,
    error,
    isVisible,
    setIsVisible,
    retry: () => loadTweetData(tweetUrl),
    clearCache: () => cacheRef.current.clear(),
  };
};
