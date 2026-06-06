"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // useState(() => ...) keeps a single QueryClient per mounted tree, instead
  // of recreating it (and dropping the cache) on every render.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Suggestions for a term and cuisines for given coordinates are
            // stable within a session: re-typing the same term hits the cache
            // instead of the network.
            staleTime: 5 * 60 * 1000,
            // One automatic retry on failure; after that the explicit
            // "Riprova" button in the error state takes over.
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
