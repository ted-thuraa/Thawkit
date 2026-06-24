"use client";

import { getQueryClient } from "@/lib/utils/react-query";
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

type ReactQueryProviderProps = {
  children: ReactNode;
  dehydratedState?: DehydratedState;
};

// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         // Default staleTime: 0ms. For public data that doesn't change rapidly,
//         // we can set a higher default staleTime. This can be overridden per query.
//         staleTime: 5 * 60 * 1000, // 5 minutes
//         // Default cacheTime: 5 minutes. Data is removed from cache after this.
//         //cacheTime: 10 * 60 * 1000, // 10 minutes
//         // Refetching defaults can be aggressive. Tone them down for public pages.
//         refetchOnWindowFocus: false,
//         refetchOnMount: false, // Can be true if fresh data on mount is critical
//         refetchOnReconnect: false,
//         retry: 1, // Retry failed requests once
//       },
//     },
//   });
// }

// let browserQueryClient: QueryClient | undefined = undefined;

// function getQueryClient() {
//   if (typeof window === "undefined") {
//     // Server: alwaysmake a new query client
//     return makeQueryClient();
//   } else {
//     // Browser: use singleton pattern to keep the same query client
//     if (!browserQueryClient) browserQueryClient = makeQueryClient();
//     return browserQueryClient;
//   }
// }

//const client = new QueryClient();

export const HydrationProvider = ({
  children,
  dehydratedState,
}: ReactQueryProviderProps) => {
  // Create a stable query client instance
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      {/* Show React Query devtools in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
};

export function ClientHydrationProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
