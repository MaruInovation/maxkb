import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/locales';

const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
