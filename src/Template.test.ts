import { assert, describe, it } from "@effect/vitest";

import * as Template from "./Template.ts";

const catalog = { effect: "4.0.2", alchemy: "2.0.0-beta.81", vitest: "5.0.3" };

const settings = (packageManager: Template.ProjectSettings["packageManager"]) =>
  ({
    name: "my-app",
    stackName: "MyApp",
    packageManager,
    packageManagerVersion: "1.2.3",
    catalog,
  }) satisfies Template.ProjectSettings;

const rootPackage = {
  name: Template.templatePackageName,
  scripts: { dev: "alchemy dev", check: "pnpm fmt:check && pnpm test" },
  devDependencies: { alchemy: "catalog:", effect: "catalog:", vitest: "catalog:" },
};

describe("Template", () => {
  it("names projects from directories", () => {
    assert.strictEqual(Template.toPackageName("My Cool App!"), "my-cool-app");
    assert.strictEqual(Template.toStackName("my-cool-app"), "MyCoolApp");
    assert.strictEqual(Template.toStackName("2fast"), "App2fast");
  });

  it("parses the catalog block of pnpm-workspace.yaml", () => {
    const yaml = [
      "packages:",
      "  - apps/*",
      "catalog:",
      '  "@effect/vitest": 4.0.2',
      "  effect: 4.0.2",
      "overrides:",
      '  effect: "catalog:"',
    ].join("\n");
    assert.deepStrictEqual(Template.parseCatalog(yaml), {
      "@effect/vitest": "4.0.2",
      effect: "4.0.2",
    });
  });

  it("keeps the pnpm workspace as authored", () => {
    const pkg = Template.rootPackageJson(rootPackage, settings("pnpm"));
    assert.strictEqual(pkg["name"], "my-app");
    assert.strictEqual(pkg["packageManager"], "pnpm@1.2.3");
    assert.deepStrictEqual(pkg["devDependencies"], rootPackage.devDependencies);
    assert.deepStrictEqual(pkg["scripts"], rootPackage.scripts);
  });

  it("moves the catalog into package.json for bun", () => {
    const pkg = Template.rootPackageJson(rootPackage, settings("bun"));
    assert.deepStrictEqual(pkg["workspaces"], {
      packages: ["apps/*", "packages/*"],
      catalog,
    });
    assert.deepStrictEqual(pkg["overrides"], { effect: "4.0.2" });
    assert.deepStrictEqual(pkg["scripts"], {
      dev: "alchemy dev",
      check: "bun run fmt:check && bun run test",
    });
  });

  it("pins exact versions for npm, which has no catalog or workspace protocol", () => {
    const pkg = Template.rootPackageJson(rootPackage, settings("npm"));
    assert.deepStrictEqual(pkg["devDependencies"], catalog);
    assert.deepStrictEqual(pkg["workspaces"], ["apps/*", "packages/*"]);

    const workspace = Template.workspacePackageJson(
      { dependencies: { "@app/contracts": "workspace:*", effect: "catalog:" } },
      settings("npm"),
    );
    assert.deepStrictEqual(workspace["dependencies"], { "@app/contracts": "*", effect: "4.0.2" });
  });

  it("rewrites commands in docs, keeping trailing comments", () => {
    const readme = [
      "pnpm install",
      "pnpm dev          # local Worker",
      "Run `pnpm test <file>` or `pnpm run deploy --stage prod`.",
      "Log in: `pnpm exec alchemy profile edit --add Cloudflare`.",
    ].join("\n");
    assert.strictEqual(
      Template.rewriteCommands(readme, "npm"),
      [
        "npm install",
        "npm run dev          # local Worker",
        "Run `npm run test -- <file>` or `npm run deploy -- --stage prod`.",
        "Log in: `npx alchemy profile edit --add Cloudflare`.",
      ].join("\n"),
    );
    assert.strictEqual(
      Template.rewriteCommands("`pnpm test` then `pnpm run deploy`", "bun"),
      "`bun run test` then `bun run deploy`",
    );
  });
});
