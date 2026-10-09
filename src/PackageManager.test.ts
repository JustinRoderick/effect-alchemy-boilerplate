import { assert, describe, it } from "@effect/vitest";
import * as Option from "effect/Option";

import * as PackageManager from "./PackageManager.ts";

describe("PackageManager", () => {
  it.each([
    ["pnpm/12.9.1 npm/? node/v24.21.0 linux x64", { name: "pnpm", version: "12.9.1" }],
    ["bun/1.4.2 npm/? node/v24.3.0 linux x64", { name: "bun", version: "1.4.2" }],
    ["npm/11.19.0 node/v24.21.0 linux x64 workspaces/false", { name: "npm", version: "11.19.0" }],
  ] as const)("detects %s", (userAgent, expected) => {
    assert.deepStrictEqual(PackageManager.fromUserAgent(userAgent), Option.some(expected));
  });

  it.each(["", "yarn/4.0.0 npm/? node/v24.0.0", "pnpm"])("ignores %j", (userAgent) => {
    assert.isTrue(Option.isNone(PackageManager.fromUserAgent(userAgent)));
  });

  it("builds run commands that reach the package.json script", () => {
    assert.strictEqual(PackageManager.runCommand("pnpm", "dev"), "pnpm dev");
    // `pnpm deploy` and `bun test` are built-ins that would shadow the scripts.
    assert.strictEqual(PackageManager.runCommand("pnpm", "deploy"), "pnpm run deploy");
    assert.strictEqual(PackageManager.runCommand("bun", "test"), "bun run test");
    // npm needs `--` to forward flags.
    assert.strictEqual(
      PackageManager.runCommand("npm", "deploy", "--stage prod"),
      "npm run deploy -- --stage prod",
    );
  });
});
