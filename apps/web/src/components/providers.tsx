'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { PwaInstallBanner } from '@/components/pwa-install-banner'
import { ErrorBoundary } from '@/components/error-boundary'
import { useAuthHydrate } from '@/hooks/useAuthHydrate'

function AuthHydrator() {
  useAuthHydrate()
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <PwaInstallBanner />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
