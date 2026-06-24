import { QueryClient, DefaultOptions } from "@tanstack/react-query";

// Default query options - these are production-grade settings
const queryConfig: DefaultOptions = {
  queries: {
    // How long data stays fresh (no refetch during this time)
    staleTime: 5 * 60 * 1000, // 5 minutes

    // How long data stays in cache after component unmounts
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

    // Retry failed requests
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on window focus (good for keeping data fresh)
    refetchOnWindowFocus: true,

    // Don't refetch on reconnect by default (can be enabled per query)
    refetchOnReconnect: "always",

    // Don't refetch on mount if data is fresh
    refetchOnMount: true,
  },
  mutations: {
    // Retry mutations once on failure
    retry: 1,

    // Retry delay for mutations
    retryDelay: 1000,
  },
};

// Create a function to make a new query client
// This is important for SSR to avoid sharing state between requests
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

// Browser-side query client (singleton)
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// Query key factory - this ensures consistent query keys across the app
export const queryKeys = {
  // Public queries (for landing pages)
  public: {
    all: ["public"] as const,
    publicTools: () => [...queryKeys.public.all, "public-tool"] as const,
    publicQuizs: () => [...queryKeys.public.all, "public-tool-quiz"] as const,
    publicResults: () => [...queryKeys.public.all, "public-tool-res"] as const,
    publicTool: (domain: string) =>
      [...queryKeys.public.publicTools(), domain] as const,
    publicToolQuiz: (domain: string) =>
      [...queryKeys.public.publicQuizs(), domain] as const,
    publicToolResult: (domain: string) =>
      [...queryKeys.public.publicResults(), domain] as const,
    landingPageAnalytics: (slug: string) =>
      [...queryKeys.public.publicTool(slug), "analytics"] as const,
  },

  // Private queries (for authenticated users)
  private: {
    all: ["private"] as const,
    user: () => [...queryKeys.private.all, "user"] as const,
    userLandingPages: () =>
      [...queryKeys.private.all, "user-landing-pages"] as const,
    userLandingPage: (id: string) =>
      [...queryKeys.private.userLandingPages(), id] as const,
    userAnalytics: () => [...queryKeys.private.all, "analytics"] as const,
  },

  // Shared queries
  shared: {
    all: ["shared"] as const,
    slugAvailability: (slug: string) =>
      [...queryKeys.shared.all, "slug-availability", slug] as const,
  },
} as const;

// Mutation keys for consistent naming
export const mutationKeys = {
  // Authentication mutations
  auth: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    logout: ["auth", "logout"] as const,
  },

  // Landing page mutations
  landingPage: {
    create: ["landing-page", "create"] as const,
    update: (id: string) => ["landing-page", "update", id] as const,
    delete: (id: string) => ["landing-page", "delete", id] as const,
    publish: (id: string) => ["landing-page", "publish", id] as const,
    unpublish: (id: string) => ["landing-page", "unpublish", id] as const,
  },

  // Link mutations
  link: {
    create: (landingPageId: string) =>
      ["link", "create", landingPageId] as const,
    update: (id: string) => ["link", "update", id] as const,
    delete: (id: string) => ["link", "delete", id] as const,
    reorder: (landingPageId: string) =>
      ["link", "reorder", landingPageId] as const,
  },
} as const;
