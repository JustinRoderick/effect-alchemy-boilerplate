import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["{apps,packages}/*/src/**/*.test.{ts,tsx}"],
        },
      },
      {
        test: {
          // Deploys real Stacks (local emulation by default): run with `test:integ`.
          name: "integ",
          include: ["apps/*/test/**/*.integ.test.ts"],
          testTimeout: 300_000,
          hookTimeout: 300_000,
        },
      },
    ],
  },
});
