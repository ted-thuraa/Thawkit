/**
 * Utility functions for tweet processing and validation
 */

// URL validation patterns
const TWITTER_URL_PATTERNS: RegExp[] = [
  /^https?:\/\/(www\.)?(twitter|x)\.com\/\w+\/status\/\d+/i,
  /^https?:\/\/mobile\.(twitter|x)\.com\/\w+\/status\/\d+/i,
  /^https?:\/\/t\.co\/\w+/i,
];

/**
 * Validates if a URL is a valid Twitter/X tweet URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidTweetUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;

  const cleanUrl = url.trim();
  return TWITTER_URL_PATTERNS.some((pattern) => pattern.test(cleanUrl));
};

/**
 * Extracts tweet ID from various URL formats
 * @param {string} url - The tweet URL
 * @returns {string|null} - The tweet ID or null if invalid
 */
export const extractTweetId = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;

  // Clean the URL
  const cleanUrl = url.trim().replace(/[?#].*$/, "");

  // Handle various Twitter URL formats
  const patterns: RegExp[] = [
    /(?:twitter|x)\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i,
    /(?:mobile\.)?(?:twitter|x)\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i,
    /^(\d{15,20})$/, // Direct tweet ID
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match) {
      return match[match.length - 1] || match[1];
    }
  }

  return null;
};

/**
 * Formats numbers for display (1.2K, 1.5M, etc.)
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num: number): string => {
  if (!num || isNaN(num)) return "0";

  const absNum = Math.abs(num);

  if (absNum >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (absNum >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }

  return num.toString();
};

/**
 * Formats date for display
 * @param {string|Date} dateInput - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateInput: string | Date): string => {
  if (!dateInput) return "";

  try {
    let date: Date;

    if (typeof dateInput === "string") {
      // Handle various date formats
      if (dateInput.includes("T")) {
        date = new Date(dateInput);
      } else {
        // Try to parse relative dates like "Dec 15, 2023"
        date = new Date(dateInput);
      }
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
      return dateInput.toString();
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Show relative time for recent tweets
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 1 ? "now" : `${diffMinutes}m`;
      }
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    }

    // Show formatted date for older tweets
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch (error) {
    console.warn("Error formatting date:", error);
    return dateInput.toString();
  }
};

/**
 * Sanitizes tweet text for safe display
 * @param {string} text - The tweet text
 * @returns {string} - Sanitized text
 */
export const sanitizeTweetText = (text: string): string => {
  if (!text || typeof text !== "string") return "";

  return (
    text
      .trim()
      // Remove potential XSS vectors
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      // Preserve line breaks
      .replace(/\n/g, "\n")
  );
};

/**
 * Extracts hashtags from tweet text
 * @param {string} text - The tweet text
 * @returns {string[]} - Array of hashtags
 */
export const extractHashtags = (text: string): string[] => {
  if (!text) return [];

  const hashtagRegex = /#[\w]+/g;
  return text.match(hashtagRegex) || [];
};

/**
 * Extracts mentions from tweet text
 * @param {string} text - The tweet text
 * @returns {string[]} - Array of mentions
 */
export const extractMentions = (text: string): string[] => {
  if (!text) return [];

  const mentionRegex = /@[\w]+/g;
  return text.match(mentionRegex) || [];
};

/**
 * Generates error messages based on error type
 * @param {Error|string} error - The error object or message
 * @returns {object} - Formatted error object with title and message
 */
export const formatError = (
  error: Error | string
): { title: string; message: string } => {
  const errorMessage =
    typeof error === "string" ? error : error?.message || "Unknown error";

  // Common error patterns and their user-friendly messages
  const errorPatterns: { pattern: RegExp; title: string; message: string }[] = [
    {
      pattern: /invalid.*url/i,
      title: "Invalid URL",
      message: "Please provide a valid Twitter or X.com tweet URL.",
    },
    {
      pattern: /not found|404/i,
      title: "Tweet Not Found",
      message: "This tweet may have been deleted or made private.",
    },
    {
      pattern: /rate limit|429/i,
      title: "Rate Limited",
      message: "Too many requests. Please try again in a few minutes.",
    },
    {
      pattern: /network|fetch|connection/i,
      title: "Connection Error",
      message:
        "Unable to connect to Twitter. Please check your internet connection.",
    },
    {
      pattern: /timeout/i,
      title: "Request Timeout",
      message: "The request took too long. Please try again.",
    },
    {
      pattern: /cors|cross-origin/i,
      title: "Access Error",
      message: "Unable to access tweet data due to browser restrictions.",
    },
  ];

  for (const { pattern, title, message } of errorPatterns) {
    if (pattern.test(errorMessage)) {
      return { title, message };
    }
  }

  // Default error
  return {
    title: "Error Loading Tweet",
    message: "Something went wrong while loading the tweet. Please try again.",
  };
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Creates a cache key for tweet data
 * @param {string} tweetId - The tweet ID
 * @param {object} options - Additional options
 * @returns {string} - Cache key
 */
export const createCacheKey = (
  tweetId: string,
  options: { showThread?: boolean; theme?: string } = {}
): string => {
  const { showThread = false, theme = "auto" } = options;
  return `tweet_${tweetId}_${showThread}_${theme}`;
};

export interface TweetData {
  id: string;
  text: string;
  author: {
    name: string;
    username: string;
    profile_image_url: string;
  };
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
  url: string;
  html: string;
  provider: string;
  width?: number;
  height?: number;
}

/**
 * Validates tweet data structure
 * @param {object} tweetData - The tweet data to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidTweetData = (tweetData: any): tweetData is TweetData => {
  if (!tweetData || typeof tweetData !== "object") return false;

  const requiredFields = ["id", "text", "author"];
  const hasRequiredFields = requiredFields.every(
    (field) => tweetData.hasOwnProperty(field) && tweetData[field] != null
  );

  if (!hasRequiredFields) return false;

  // Validate author object
  if (!tweetData.author || typeof tweetData.author !== "object") return false;
  if (!tweetData.author.username || !tweetData.author.name) return false;

  return true;
};

// {#customization}
// Comprehensive Theme System
// The TweetEmbed component includes an extensive theming system
// that provides both preset themes and the flexibility for complete customization.
// The theme architecture is built on a structured approach that ensures consistency while allowing for creative freedom:

// const createTheme = (config) => ({
//   container: {
//     background: config.background || 'bg-white',
//     text: config.text || 'text-gray-900',
//     border: config.border || 'border-gray-200',
//     shadow: config.shadow || 'shadow-sm',
//     radius: config.radius || 'rounded-lg',
//     padding: config.padding || 'p-4',
//   },
//   header: {
//     name: config.headerName || 'font-semibold text-gray-900',
//     username: config.headerUsername || 'text-gray-500',
//     date: config.headerDate || 'text-gray-400',
//     badge: config.headerBadge || 'bg-gray-100 text-gray-600',
//   },
//   content: {
//     text: config.contentText || 'text-gray-800 leading-relaxed',
//   },
//   actions: {
//     button: config.actionsButton || 'text-gray-500 hover:text-gray-700',
//     count: config.actionsCount || 'text-gray-400',
//   },
//   states: {
//     hover: config.statesHover || 'hover:shadow-md hover:border-gray-300',
//     loading: config.statesLoading || 'animate-pulse',
//     error: config.statesError || 'border-red-200 bg-red-50 text-red-800',
//   },
// });

// Caching Architecture
// The caching system implements a sophisticated approach that balances performance with data freshness:

// const getCachedData = useCallback((tweetId) => {
//   const cached = cacheRef.current.get(tweetId);
//   if (cached && Date.now() - cached.timestamp < cacheTimeout) {
//     return cached.data;
//   }
//   return null;
// }, [cacheTimeout]);

// const setCachedData = useCallback((tweetId, data) => {
//   cacheRef.current.set(tweetId, {
//     data,
//     timestamp: Date.now(),
//   });
// }, []);
