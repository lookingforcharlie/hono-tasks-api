import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.config.ts',
        'coverage/**',
      ],
    },
  },
  // need to specify the alias inside vitest.config.ts to use the alias in the test files
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}) 