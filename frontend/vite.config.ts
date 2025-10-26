// import { defineConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        port: 3000,
    },
    preview: {
        port: 3001,
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./tests/setup.ts"],
        include: ["tests/**/*.test.{ts,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
        },
    }
})
