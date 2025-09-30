import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './testQueryClient';

export const withProviders = (ui: React.ReactNode) => {
    const queryClient = createTestQueryClient();
    return <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>;
};