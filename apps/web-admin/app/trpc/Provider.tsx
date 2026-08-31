'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { useState } from 'react';
import trpc from './client';
import superjson from 'superjson';
import { getBrowserFingerprint } from '@/utils/fingerprint';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          // enabled: (opts) =>
          //   process.env.NODE_ENV === 'development' ||
          //   (opts.direction === 'down' && opts.result instanceof Error),
          enabled: () => false
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/trpc`,
          async headers() {

            const fingerprint = await getBrowserFingerprint();

            return {
              'x-device-fingerprint': fingerprint || '',
            };
          },
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include', // Include cookies
            });
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}