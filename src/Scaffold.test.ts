import * as NodeServices from "@effect/platform-node/NodeServices";
import { assert, describe, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Schema from "effect/Schema";

import * as Scaffold from "./Scaffold.ts";

// The real template and docs, rendered into temp directories. Install and git are
// skipped, so the only external boundary exercised is the file system.
const layerTest = Layer.unwrap(
  Effect.gen(function* () {
    const path = yield* Path.Path;
    return Scaffold.layer({
      templateDir: yield* path.fromFileUrl(new URL("../template", import.meta.url)),
      docsDir: yield* path.fromFileUrl(new URL("../docs", import.meta.url)),
    });
  }).pipe(Effect.orDie),
).pipe(Layer.provideMerge(NodeServices.layer));

const PackageJson = Schema.fromJsonString(Schema.Record(Schema.String, Schema.Unknown));
const readPackageJson = (file: string) =>
  FileSystem.FileSystem.pipe(
    Effect.flatMap((fs) => fs.readFileString(file)),
    Effect.flatMap(Schema.decodeUnknownEffect(PackageJson)),
  );

const scaffoldInto = (packageManager: Scaffold.CreateOptions["packageManager"]) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const directory = path.join(yield* fs.makeTempDirectoryScoped(), "My App");
    const service = yield* Scaffold.Scaffold;
    const result = yield* service.create({
      directory,
      packageManager,
      packageManagerVersion: Option.some("1.0.0"),
      install: false,
      git: false,
    });
    return { fs, path, directory, result };
  });

describe("Scaffold", () => {
  it.effect("renders a pnpm project", () =>
    Effect.gen(function* () {
      const { fs, path, directory, result } = yield* scaffoldInto("pnpm");
      assert.strictEqual(result.settings.name, "my-app");

      const root = yield* readPackageJson(path.join(directory, "package.json"));
      assert.strictEqual(root["name"], "my-app");
      assert.strictEqual(root["packageManager"], "pnpm@1.0.0");
      assert.isTrue(yield* fs.exists(path.join(directory, "pnpm-workspace.yaml")));
      assert.isTrue(yield* fs.exists(path.join(directory, ".gitignore")));
      assert.isFalse(yield* fs.exists(path.join(directory, "_gitignore")));
      assert.isFalse(yield* fs.exists(path.join(directory, "node_modules")));
      assert.isTrue(yield* fs.exists(path.join(directory, "docs", "README.md")));

      const stack = yield* fs.readFileString(path.join(directory, "alchemy.run.ts"));
      assert.include(stack, '"MyApp"');
    }).pipe(Effect.provide(layerTest)),
  );

  it.effect("renders an npm project without pnpm-only protocols", () =>
    Effect.gen(function* () {
      const { fs, path, directory } = yield* scaffoldInto("npm");
      assert.isFalse(yield* fs.exists(path.join(directory, "pnpm-workspace.yaml")));

      for (const file of ["package.json", "apps/api/package.json", "apps/web/package.json"]) {
        const text = yield* fs.readFileString(path.join(directory, file));
        assert.notInclude(text, "catalog:", file);
        assert.notInclude(text, "workspace:", file);
      }
      const readme = yield* fs.readFileString(path.join(directory, "README.md"));
      assert.include(readme, "npm run dev");
      assert.notInclude(readme, "pnpm ");
    }).pipe(Effect.provide(layerTest)),
  );

  it.effect("renders a bun project with the catalog in package.json", () =>
    Effect.gen(function* () {
      const { path, directory } = yield* scaffoldInto("bun");
      const root = yield* readPackageJson(path.join(directory, "package.json"));
      assert.deepInclude(root, { packageManager: "bun@1.0.0" });
      assert.property(root, "trustedDependencies");
      const workspaces = root["workspaces"];
      assert.isObject(workspaces);
    }).pipe(Effect.provide(layerTest)),
  );

  it.effect("refuses a directory that already has files", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const directory = yield* fs.makeTempDirectoryScoped();
      yield* fs.writeFileString(path.join(directory, "keep.txt"), "mine");

      const service = yield* Scaffold.Scaffold;
      const error = yield* service
        .create({
          directory,
          packageManager: "pnpm",
          packageManagerVersion: Option.some("1.0.0"),
          install: false,
          git: false,
        })
        .pipe(Effect.flip);
      assert.strictEqual(error._tag, "TargetNotEmpty");
    }).pipe(Effect.provide(layerTest)),
  );
});
