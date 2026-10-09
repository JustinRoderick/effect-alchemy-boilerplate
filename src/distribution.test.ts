import { assert, describe, it } from "@effect/vitest";

import packageJson from "../package.json" with { type: "json" };

// npm and pnpm build a git dependency before installing it when it has any of these scripts: npm
// installs every devDependency to run them, and pnpm 10+ refuses unless the build is allowed.
// dist/bin.mjs is committed instead (scripts/bundle.ts), so `npx github:...` has nothing to build.
const gitInstallBuildScripts = [
  "preinstall",
  "install",
  "postinstall",
  "prepare",
  "prepack",
  "prepublish",
  "publish",
  "build",
];

describe("distribution", () => {
  it("installs from git without a build step", () => {
    assert.deepStrictEqual(
      Object.keys(packageJson.scripts).filter((name) => gitInstallBuildScripts.includes(name)),
      [],
    );
  });
});
