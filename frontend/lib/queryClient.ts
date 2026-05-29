import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - cache stays fresh
      gcTime: 1000 * 60 * 15, // 15 minutes - longer garbage collection
      retry: 1,
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      refetchOnMount: false, // Prevent refetch on component mount
    },
    mutations: {
      retry: 1,
    },
  },
});

