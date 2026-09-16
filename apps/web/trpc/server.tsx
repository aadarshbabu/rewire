import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter, type AppRouter } from "./routers/_app";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for
 * the tRPC API when handling a tRPC call from a React Server Component.
 */
export const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

/**
 * Stable getter for the query client per request on the server.
 */
export const getQueryClient = cache(makeQueryClient);

/**
 * Server-side tRPC query options proxy for prefetching in React Server Components.
 *
 * Example:
 * ```tsx
 * import { trpc, HydrateClient, prefetch } from "@/trpc/server";
 *
 * export default async function Page() {
 *   prefetch(trpc.user.list.queryOptions());
 *
 *   return (
 *     <HydrateClient>
 *       <ClientUserList />
 *     </HydrateClient>
 *   );
 * }
 * ```
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

/**
 * Hydrates query client state for client components rendered within this boundary.
 */
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

/**
 * Helper to prefetch queries in Server Components.
 */
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

/**
 * Direct server-side tRPC caller (detached from React Query cache).
 * Useful when you just need the data directly inside an async Server Component.
 */
export const caller = createCallerFactory(appRouter)(createContext);

