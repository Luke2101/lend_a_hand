import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
      globals: true, // enable global describe, it, test, expect
      environment: 'node',
      globalSetup: ['./tests/setup/globalSetup.ts'],
      hookTimeout: 60000
  },
});
