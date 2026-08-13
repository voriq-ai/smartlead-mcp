import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
          environment: 'node',
          restoreMocks: true,
          unstubEnvs: true,
        },
      },
      {
        test: {
          name: 'live',
          include: ['tests/live/**/*.test.ts'],
          environment: 'node',
          testTimeout: 60_000,
          hookTimeout: 60_000,
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      // Entry points: argv dispatch and interactive prompts. Their pure logic
      // (maskKey, isCliInvocation, clientSnippets) is covered in tests/unit/cli.test.ts.
      exclude: ['src/index.ts', 'src/cli.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
