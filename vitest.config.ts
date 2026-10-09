import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // template/ is its own project with its own test config.
    include: ["src/**/*.test.ts"],
  },
});
