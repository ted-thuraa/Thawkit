import { createServerApiClient } from "../api-client";
import { QueryClient } from "@tanstack/react-query";
import { makeQueryClient, queryKeys } from "./react-query";
import { ProjectPublicDataMainPageResponse } from "../querries/campaignPublic";

/**
 * Create a server-side query client with prefetched data
 * This is used in getServerSideProps or getStaticProps
 */
export async function createServerQueryClient(
  token?: string
): Promise<QueryClient> {
  const queryClient = makeQueryClient();
  const serverApi = createServerApiClient(token);

  // You can add common prefetching logic here
  // For example, always prefetch user data if token exists
  if (token) {
    try {
      // Prefetch user data for authenticated requests
      // await queryClient.prefetchQuery({
      //   queryKey: queryKeys.private.user(),
      //   queryFn: () => serverApi.get('/user/me'),
      // });
    } catch (error) {
      // Handle auth errors gracefully
      console.warn("Failed to prefetch user data:", error);
    }
  }

  return queryClient;
}

/**
 * Fetches and caches public landing page data.
 * Used for SSR in App Router pages.
 * This function will fetch data, cache it with React Query, and return it.
 * It throws an error if the fetch fails.
 */
export async function fetchPublicLandingPage(
  queryClient: QueryClient,
  domain: string
) {
  const serverApi = createServerApiClient();

  // try {
  //   await queryClient.prefetchQuery({
  //     queryKey: queryKeys.public.publicTool(domain),
  //     queryFn: () => serverApi.get(`/tool/${domain}`),
  //     staleTime: 5 * 60 * 1000, // 5 minutes
  //   });
  // } catch (error) {
  //   // Don't throw here - let the client handle the error
  //   console.warn(`Failed to prefetch landing page ${domain}:`, error);
  // }

  return await queryClient.fetchQuery({
    queryKey: queryKeys.public.publicTool(domain),
    queryFn: () =>
      serverApi.get<ProjectPublicDataMainPageResponse>(`/project/${domain}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetches and caches public quiz page data.
 * Used for SSR in App Router pages.
 * This function will fetch data, cache it with React Query, and return it.
 * It throws an error if the fetch fails.
 */
export async function fetchPublicQuizPage(
  queryClient: QueryClient,
  domain: string
) {
  const serverApi = createServerApiClient();

  // try {
  //   await queryClient.prefetchQuery({
  //     queryKey: queryKeys.public.publicTool(domain),
  //     queryFn: () => serverApi.get(`/tool/${domain}`),
  //     staleTime: 5 * 60 * 1000, // 5 minutes
  //   });
  // } catch (error) {
  //   // Don't throw here - let the client handle the error
  //   console.warn(`Failed to prefetch landing page ${domain}:`, error);
  // }

  return await queryClient.fetchQuery({
    queryKey: queryKeys.public.publicToolQuiz(domain),
    queryFn: () =>
      serverApi.get<ProjectPublicDataMainPageResponse>(
        `/project/quiz/${domain}`
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export async function fetchPublicResultPage(
  queryClient: QueryClient,
  domain: string,
  responseId: string
) {
  const serverApi = createServerApiClient();

  // try {
  //   await queryClient.prefetchQuery({
  //     queryKey: queryKeys.public.publicTool(domain),
  //     queryFn: () => serverApi.get(`/tool/${domain}`),
  //     staleTime: 5 * 60 * 1000, // 5 minutes
  //   });
  // } catch (error) {
  //   // Don't throw here - let the client handle the error
  //   console.warn(`Failed to prefetch landing page ${domain}:`, error);
  // }

  return await queryClient.fetchQuery({
    queryKey: queryKeys.public.publicToolResult(domain),
    queryFn: () =>
      serverApi.get<ProjectPublicDataMainPageResponse>(
        `/project/result/${domain}/${responseId}/`
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
