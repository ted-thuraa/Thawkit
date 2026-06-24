import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  isValidTweetUrl,
  formatNumber,
  formatDate,
  sanitizeTweetText,
  formatError,
  TweetData,
} from "@/lib/utils/tweetUtils";
import { useTweetData } from "@/hooks/useTweetData";

/**
 * TweetEmbed Component
 *
 * A performant, scalable, and customizable React component for embedding tweets
 * without relying on Twitter's heavy widget.js script.
 *
 * Features:
 * - Uses Twitter's oEmbed API for data fetching
 * - Static HTML/CSS rendering (no iframe)
 * - SSR/Next.js compatible
 * - Lazy loading support
 * - Comprehensive error handling
 * - Extensive customization options
 * - Optimized for testimonials use case
 */

interface Appearance {
  theme?: "light" | "dark" | "auto";
  border?: string;
  padding?: string;
  shadow?: string;
}

interface TweetEmbedProps {
  tweetUrl: string;
  appearance?: Appearance;
  className?: string;
  lazy?: boolean;
  showActions?: boolean;
  showThread?: boolean;
  maxWidth?: number;
  retryAttempts?: number;
  cacheTimeout?: number;
  onLoad?: ((tweetData: TweetData) => void) | null;
  onError?: ((error: Error) => void) | null;
}

const TweetEmbed = ({
  tweetUrl,
  appearance = {},
  className = "",
  lazy = true,
  showActions = true,
  showThread = false,
  maxWidth = 550,
  retryAttempts = 3,
  cacheTimeout = 5 * 60 * 1000, // 5 minutes
  onLoad = null,
  onError = null,
}: TweetEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Validate URL before processing
  const isValidUrl = isValidTweetUrl(tweetUrl);

  // Use custom hook for tweet data management
  const { tweetData, loading, error, isVisible, setIsVisible, retry } =
    useTweetData(tweetUrl, {
      lazy,
      showThread,
      retryAttempts,
      cacheTimeout,
    });

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isVisible, setIsVisible]);

  // Call callbacks when data changes
  useEffect(() => {
    if (tweetData && onLoad) {
      onLoad(tweetData);
    }
  }, [tweetData, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(new Error(error));
    }
  }, [error, onError]);

  // Default appearance settings
  const defaultAppearance: Required<Appearance> = {
    theme: "light",
    border: "rounded-lg",
    padding: "p-4",
    shadow: "shadow-sm",
    ...appearance,
  };

  // Theme classes
  const themeClasses: { [key: string]: string } = {
    // light: "bg-white text-gray-900 border-gray-200",
    // dark: "bg-gray-900 text-white border-gray-700",
    // auto: "bg-background text-foreground border-border",
    light: "",
    dark: "",
    auto: "",
  };

  const containerClasses = [
    "tweet-embed",
    "transition-all duration-200",
    "w-full max-w-lg  p-5 flex flex-col gap-[32px]",
    themeClasses[defaultAppearance.theme] || themeClasses.auto,
    defaultAppearance.border,
    defaultAppearance.padding,
    defaultAppearance.shadow,
    "border",
    "hover:shadow-md",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Early return for invalid URL
  if (!isValidUrl && tweetUrl) {
    const errorInfo = formatError("Invalid tweet URL format");
    return (
      <div
        ref={containerRef}
        className={`${containerClasses} border-red-200 bg-red-50 text-red-800`}
        style={{ maxWidth }}
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">{errorInfo.title}</p>
            <p className="text-xs text-red-600 mt-1">{errorInfo.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div ref={containerRef} className={containerClasses} style={{ maxWidth }}>
        <div className="flex items-start space-x-3">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            {showActions && (
              <div className="flex space-x-4 mt-3 pt-3 border-t border-border">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    const errorInfo = formatError(error);
    return (
      <div
        ref={containerRef}
        className={`${containerClasses} border-red-200 bg-red-50 text-red-800`}
        style={{ maxWidth }}
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">{errorInfo.title}</p>
            <p className="text-xs text-red-600 mt-1">{errorInfo.message}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={retry}
              className="mt-2 h-7 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Lazy loading placeholder
  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className={`${containerClasses} min-h-[120px] flex items-center justify-center`}
        style={{ maxWidth }}
      >
        <div className="text-muted-foreground">Loading tweet...</div>
      </div>
    );
  }

  // No data state
  if (!tweetData) {
    return null;
  }

  return (
    <div ref={containerRef} className={containerClasses} style={{ maxWidth }}>
      {/* Tweet Actions */}
      {showActions && (
        <div className="w-full flex items-center justify-center">
          <div className="w-full flex flex-row items-center justify-between space-x-6">
            <div className="flex  items-center space-x-6">
              <button className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">
                  {formatNumber(tweetData.public_metrics.reply_count)}
                </span>
              </button>

              <button className="flex items-center space-x-1 text-muted-foreground hover:text-green-500 transition-colors">
                <Repeat2 className="h-4 w-4" />
                <span className="text-xs">
                  {formatNumber(tweetData.public_metrics.retweet_count)}
                </span>
              </button>

              <button className="flex items-center space-x-1 text-muted-foreground hover:text-red-500 transition-colors">
                <Heart className="h-4 w-4" />
                <span className="text-xs">
                  {formatNumber(tweetData.public_metrics.like_count)}
                </span>
              </button>
            </div>

            <div className="flex flex-row flex-nowrap gap-x-1 items-center">
              <div>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(tweetData.created_at)}
                </span>
              </div>
              <a
                href={tweetData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View tweet on Twitter"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tweet Content */}
      <div className="mt-3 text-content">
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {sanitizeTweetText(tweetData.text)}
        </p>
      </div>

      {/* Tweet Header */}
      <div className="flex items-center space-x-3  ">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={tweetData.author.profile_image_url}
            alt={`@${tweetData.author.username}`}
          />
          <AvatarFallback>
            {tweetData.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col flex-1 text-content">
              <h3 className="font-semibold text-sm truncate">
                {tweetData.author.name}
              </h3>
              <span className=" text-xs">@{tweetData.author.username}</span>
            </div>
          </div>
        </div>

        <a
          href={tweetData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="View tweet on Twitter"
        >
          <svg
            viewBox="0 0 1200 1227"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
          >
            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6902H306.615L611.412 515.685L658.88 583.579L1055.08 1150.31H892.476L569.165 687.854V687.828Z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default TweetEmbed;
