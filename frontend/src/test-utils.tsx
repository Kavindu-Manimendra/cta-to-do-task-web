import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { render } from "@testing-library/react";

export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });
}

export function renderWithProviders(ui: React.ReactElement) {
    const queryClient = createTestQueryClient();
    return {
        ...render(
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider maxSnack={5}>{ui}</SnackbarProvider>
            </QueryClientProvider>
        ),
        queryClient,
    };
}
