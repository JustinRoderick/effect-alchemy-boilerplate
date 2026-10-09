/**
 * Bundles the CLI into dist/bin.mjs, the file `bin` points at. dist/ is committed so the CLI also
 * runs straight from GitHub (`npx github:...`, `bunx github:...`) with no build step on install.
 *
 *   node scripts/bundle.ts           # write dist/bin.mjs
 *   node scripts/bundle.ts --check   # fail if the committed dist/bin.mjs doesn't match src/
 */
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";
import * as Schema from "effect/Schema";
import * as esbuild from "esbuild";

class BundleFailed extends Schema.TaggedError<BundleFailed>()("BundleFailed", {
  cause: Schema.Defect(),
}) {
  override get message(): string {
    return "esbuild couldn't bundle src/bin.ts.";
  }
}

class BundleOutdated extends Schema.TaggedError<BundleOutdated>()("BundleOutdated", {}) {
  override get message(): string {
    return "dist/bin.mjs doesn't match src/. Run `pnpm bundle` and commit dist/bin.mjs.";
  }
}

const bundle = Effect.fn("bundle")(function* (options: { readonly check: boolean }) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const root = path.resolve(import.meta.dirname, "..");
  const outfile = path.join(root, "dist", "bin.mjs");

  const result = yield* Effect.tryPromise({
    try: () =>
      esbuild.build({
        // Fixed so the source-path comments in the bundle don't depend on the caller's cwd.
        absWorkingDir: root,
        entryPoints: ["src/bin.ts"],
        outfile,
        bundle: true,
        platform: "node",
        format: "esm",
        target: "node22",
        // Bundled CommonJS dependencies call require(), which ESM output doesn't define.
        banner: {
          js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
        },
        logLevel: "warning",
        write: false,
      }),
    catch: (cause) => new BundleFailed({ cause }),
  });
  const [output] = result.outputFiles;
  if (output === undefined) {
    return yield* new BundleFailed({ cause: "esbuild produced no output file" });
  }

  if (options.check) {
    const committed = yield* fs
      .readFile(outfile)
      .pipe(Effect.orElseSucceed(() => new Uint8Array()));
    if (!Buffer.from(output.contents).equals(committed)) {
      return yield* new BundleOutdated();
    }
    yield* Console.log("dist/bin.mjs is up to date.");
    return;
  }

  yield* fs.makeDirectory(path.dirname(outfile), { recursive: true });
  yield* fs.writeFile(outfile, output.contents);
  yield* fs.chmod(outfile, 0o755);
});

bundle({ check: process.argv.includes("--check") }).pipe(
  Effect.provide(NodeServices.layer),
  NodeRuntime.runMain,
);
