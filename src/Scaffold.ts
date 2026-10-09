import * as Console from "effect/Console";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as ChildProcess from "effect/process/ChildProcess";
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner";
import * as Schema from "effect/Schema";

import { PackageManager } from "./PackageManager.ts";
import * as Template from "./Template.ts";

export class TargetNotEmpty extends Schema.TaggedError<TargetNotEmpty>()("TargetNotEmpty", {
  path: Schema.String,
}) {
  override get message(): string {
    return `${this.path} already exists and is not empty. Pick a new or empty directory.`;
  }
}

export class TemplateUnreadable extends Schema.TaggedError<TemplateUnreadable>()(
  "TemplateUnreadable",
  { path: Schema.String, cause: Schema.Defect() },
) {
  override get message(): string {
    return `Couldn't read the template at ${this.path}.`;
  }
}

export class ProjectWriteFailed extends Schema.TaggedError<ProjectWriteFailed>()(
  "ProjectWriteFailed",
  { path: Schema.String, cause: Schema.Defect() },
) {
  override get message(): string {
    return `Couldn't write ${this.path}.`;
  }
}

export class PackageManagerUnavailable extends Schema.TaggedError<PackageManagerUnavailable>()(
  "PackageManagerUnavailable",
  { packageManager: PackageManager, cause: Schema.Defect() },
) {
  override get message(): string {
    return `${this.packageManager} isn't installed or isn't on PATH.`;
  }
}

export class InstallFailed extends Schema.TaggedError<InstallFailed>()("InstallFailed", {
  packageManager: PackageManager,
  exitCode: Schema.optional(Schema.Int),
  cause: Schema.optional(Schema.Defect()),
}) {
  override get message(): string {
    return `${this.packageManager} install failed${this.exitCode === undefined ? "" : ` (exit code ${this.exitCode})`}.`;
  }
}

export interface CreateOptions {
  readonly directory: string;
  readonly packageManager: PackageManager;
  /** Known when the package manager launched us (npm_config_user_agent); otherwise asked. */
  readonly packageManagerVersion: Option.Option<string>;
  readonly install: boolean;
  readonly git: boolean;
}

export interface CreateResult {
  readonly directory: string;
  readonly settings: Template.ProjectSettings;
  readonly installed: boolean;
  readonly git: "initialized" | "skipped" | "unavailable";
}

/** Creates a new project from the template. */
export class Scaffold extends Context.Service<
  Scaffold,
  {
    readonly create: (
      options: CreateOptions,
    ) => Effect.Effect<
      CreateResult,
      | TargetNotEmpty
      | TemplateUnreadable
      | ProjectWriteFailed
      | PackageManagerUnavailable
      | InstallFailed
    >;
  }
>()("create-effect-alchemy/Scaffold") {}

/** Never copied out of the template: local installs, state, caches, and secrets. */
const ignoredEntries = new Set(["node_modules", ".alchemy", ".repos", "dist", ".env", ".DS_Store"]);
const isIgnored = (entry: string) => ignoredEntries.has(entry) || entry.endsWith(".tsbuildinfo");

const pnpmOnlyFiles = new Set(["pnpm-workspace.yaml", "pnpm-lock.yaml"]);
const workspacePackageJson = /^(apps|packages)\/[^/]+\/package\.json$/;
const PackageJsonFile = Schema.fromJsonString(Schema.Record(Schema.String, Schema.Unknown), {
  space: 2,
});
const decodePackageJson = Schema.decodeUnknownEffect(PackageJsonFile);
const encodePackageJson = Schema.encodeEffect(PackageJsonFile);

const make = (source: { readonly templateDir: string; readonly docsDir: string }) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;

    /** Relative paths (with `/` separators) of every template file worth copying. */
    const listFiles = (root: string) => {
      const visit = (relative: string): Effect.Effect<ReadonlyArray<string>, TemplateUnreadable> =>
        Effect.gen(function* () {
          const dir = path.join(root, relative);
          const entries = yield* fs
            .readDirectory(dir)
            .pipe(Effect.mapError((cause) => new TemplateUnreadable({ path: dir, cause })));
          const files: Array<string> = [];
          for (const entry of entries.toSorted()) {
            if (isIgnored(entry)) continue;
            const child = relative === "" ? entry : `${relative}/${entry}`;
            const info = yield* fs
              .stat(path.join(root, child))
              .pipe(Effect.mapError((cause) => new TemplateUnreadable({ path: child, cause })));
            if (info.type === "Directory") files.push(...(yield* visit(child)));
            else if (info.type === "File") files.push(child);
          }
          return files;
        });
      return visit("");
    };

    const readTemplateFile = (file: string) =>
      fs
        .readFileString(path.join(source.templateDir, file))
        .pipe(Effect.mapError((cause) => new TemplateUnreadable({ path: file, cause })));

    const writeFile = Effect.fn("Scaffold.writeFile")(
      function* (target: string, contents: string) {
        yield* fs.makeDirectory(path.dirname(target), { recursive: true });
        yield* fs.writeFileString(target, contents);
      },
      (effect, target) =>
        effect.pipe(Effect.mapError((cause) => new ProjectWriteFailed({ path: target, cause }))),
    );

    const copyFile = Effect.fn("Scaffold.copyFile")(
      function* (from: string, to: string) {
        yield* fs.makeDirectory(path.dirname(to), { recursive: true });
        yield* fs.copyFile(from, to);
      },
      (effect, _from, to) =>
        effect.pipe(Effect.mapError((cause) => new ProjectWriteFailed({ path: to, cause }))),
    );

    const ensureEmpty = Effect.fn("Scaffold.ensureEmpty")(function* (directory: string) {
      const exists = yield* fs.exists(directory).pipe(Effect.orElseSucceed(() => false));
      if (!exists) return;
      const entries = yield* fs
        .readDirectory(directory)
        .pipe(Effect.mapError((cause) => new ProjectWriteFailed({ path: directory, cause })));
      // An existing empty git repository is fine to scaffold into.
      if (entries.some((entry) => entry !== ".git")) {
        return yield* new TargetNotEmpty({ path: directory });
      }
    });

    const packageManagerVersion = Effect.fn("Scaffold.packageManagerVersion")(function* (
      options: CreateOptions,
    ) {
      if (Option.isSome(options.packageManagerVersion)) return options.packageManagerVersion.value;
      const output = yield* spawner
        .string(ChildProcess.make(options.packageManager, ["--version"], { shell: isWindows }))
        .pipe(
          Effect.mapError(
            (cause) =>
              new PackageManagerUnavailable({ packageManager: options.packageManager, cause }),
          ),
        );
      return output.trim();
    });

    /** Renders one template file into the project, or skips it for this package manager. */
    const renderFile = Effect.fn("Scaffold.renderFile")(function* (
      file: string,
      directory: string,
      settings: Template.ProjectSettings,
    ) {
      const from = path.join(source.templateDir, file);
      // pnpm-workspace.yaml and the lockfile are pnpm's; bun and npm get package.json workspaces.
      if (pnpmOnlyFiles.has(file) && settings.packageManager !== "pnpm") return;
      const to = path.join(directory, file === "_gitignore" ? ".gitignore" : file);

      if (file === "package.json" || workspacePackageJson.test(file)) {
        const pkg = yield* readTemplateFile(file).pipe(
          Effect.flatMap(decodePackageJson),
          Effect.mapError((cause) => new TemplateUnreadable({ path: file, cause })),
        );
        const rendered =
          file === "package.json"
            ? Template.rootPackageJson(pkg, settings)
            : Template.workspacePackageJson(pkg, settings);
        const json = yield* encodePackageJson(rendered).pipe(Effect.orDie);
        return yield* writeFile(to, `${json}\n`);
      }
      if (file === "alchemy.run.ts" || file === "README.md" || file === "AGENTS.md") {
        const text = yield* readTemplateFile(file);
        const renamed = Template.renameProject(text, settings);
        return yield* writeFile(
          to,
          file === "alchemy.run.ts"
            ? renamed
            : Template.rewriteCommands(renamed, settings.packageManager),
        );
      }
      yield* copyFile(from, to);
    });

    const install = Effect.fn("Scaffold.install")(function* (
      directory: string,
      packageManager: PackageManager,
    ) {
      yield* Console.log(`\nInstalling dependencies with ${packageManager}…\n`);
      const exitCode = yield* spawner
        .exitCode(
          ChildProcess.make(packageManager, ["install"], {
            cwd: directory,
            shell: isWindows,
            stdin: "inherit",
            stdout: "inherit",
            stderr: "inherit",
          }),
        )
        .pipe(Effect.mapError((cause) => new InstallFailed({ packageManager, cause })));
      if (exitCode !== 0) return yield* new InstallFailed({ packageManager, exitCode });
    });

    /** Runs the project's own formatter so rendered package.json files match its oxfmt config. */
    const format = (directory: string, packageManager: PackageManager) =>
      spawner
        .exitCode(
          ChildProcess.make(packageManager, ["run", "fmt"], { cwd: directory, shell: isWindows }),
        )
        .pipe(Effect.asVoid, Effect.ignore);

    /** Initializes a repository with one commit, unless the project is already inside one. */
    const initGit = Effect.fn("Scaffold.initGit")(function* (directory: string) {
      const git = (args: ReadonlyArray<string>) =>
        spawner
          .exitCode(ChildProcess.make("git", args, { cwd: directory }))
          .pipe(Effect.orElseSucceed(() => -1));
      const insideRepo = yield* spawner
        .string(
          ChildProcess.make("git", ["rev-parse", "--is-inside-work-tree"], { cwd: directory }),
        )
        .pipe(
          Effect.map((output) => output.trim() === "true"),
          Effect.orElseSucceed(() => false),
        );
      if (insideRepo) return "skipped" as const;
      if ((yield* git(["init", "-q"])) !== 0) return "unavailable" as const;
      yield* git(["add", "-A"]);
      // Fails harmlessly when git has no user configured; the repository still exists.
      yield* git(["commit", "-q", "-m", "Initial commit from create-effect-alchemy"]);
      return "initialized" as const;
    });

    const create: Scaffold["Service"]["create"] = Effect.fn("Scaffold.create")(function* (options) {
      const directory = path.resolve(options.directory);
      yield* ensureEmpty(directory);

      const name = Template.toPackageName(path.basename(directory));
      const settings: Template.ProjectSettings = {
        name,
        stackName: Template.toStackName(name),
        packageManager: options.packageManager,
        packageManagerVersion: yield* packageManagerVersion(options),
        catalog: Template.parseCatalog(yield* readTemplateFile("pnpm-workspace.yaml")),
      };

      for (const file of yield* listFiles(source.templateDir)) {
        yield* renderFile(file, directory, settings);
      }
      for (const file of yield* listFiles(source.docsDir)) {
        yield* copyFile(path.join(source.docsDir, file), path.join(directory, "docs", file));
      }

      if (options.install) {
        yield* install(directory, options.packageManager);
        yield* format(directory, options.packageManager);
      }
      const git = options.git ? yield* initGit(directory) : ("skipped" as const);
      return { directory, settings, installed: options.install, git };
    });

    return Scaffold.of({ create });
  });

const isWindows = process.platform === "win32";

/** The template and docs ship next to the CLI: `<package>/template` and `<package>/docs`. */
export const layer = (source: { readonly templateDir: string; readonly docsDir: string }) =>
  Layer.effect(Scaffold, make(source));
