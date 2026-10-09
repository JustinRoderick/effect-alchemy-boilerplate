/**
 * Clones read-only reference copies of effect and alchemy into .repos/, pinned to the
 * versions installed in node_modules, so coding agents can read the real source,
 * LLMS.md, and examples instead of guessing APIs. Never edit or import from .repos/.
 *
 *   node scripts/sync-repos.ts
 */
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";
import * as ChildProcess from "effect/process/ChildProcess";
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner";
import * as Schema from "effect/Schema";

interface ReferenceRepo {
  readonly name: string;
  readonly url: string;
  /** The installed package whose version picks the tag. */
  readonly packageName: string;
  readonly tagFor: (version: string) => string;
}

const referenceRepos: ReadonlyArray<ReferenceRepo> = [
  {
    name: "effect",
    url: "https://github.com/Effect-TS/effect.git",
    packageName: "effect",
    tagFor: (version) => `effect@${version}`,
  },
  {
    name: "alchemy",
    url: "https://github.com/alchemy-run/alchemy.git",
    packageName: "alchemy",
    tagFor: (version) => `v${version}`,
  },
];

class SyncRepoError extends Schema.TaggedError<SyncRepoError>()("SyncRepoError", {
  repo: Schema.String,
  step: Schema.Literals(["read-version", "clone"]),
  cause: Schema.Defect(),
}) {
  override get message(): string {
    return `Failed to sync .repos/${this.repo} during ${this.step}.`;
  }
}

const PackageVersion = Schema.fromJsonString(Schema.Struct({ version: Schema.String }));
const decodePackageVersion = Schema.decodeUnknownEffect(PackageVersion);

const syncRepo = Effect.fn("syncRepo")(function* (repo: ReferenceRepo) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;

  const { version } = yield* fs
    .readFileString(path.join("node_modules", repo.packageName, "package.json"))
    .pipe(
      Effect.flatMap(decodePackageVersion),
      Effect.mapError(
        (cause) => new SyncRepoError({ repo: repo.name, step: "read-version", cause }),
      ),
    );
  const tag = repo.tagFor(version);
  const dir = path.join(".repos", repo.name);

  // A release commit can carry several tags (effect tags every package), so check membership.
  const tagsAtHead = yield* spawner
    .lines(ChildProcess.make("git", ["-C", dir, "tag", "--points-at", "HEAD"]))
    .pipe(Effect.orElseSucceed((): ReadonlyArray<string> => []));
  if (tagsAtHead.includes(tag)) {
    yield* Console.log(`.repos/${repo.name} is already at ${tag}`);
    return;
  }

  // .repos/ is a disposable cache: replace whatever is there with the pinned tag.
  yield* fs.remove(dir, { recursive: true, force: true }).pipe(Effect.orDie);
  yield* Console.log(`Cloning ${repo.url} at ${tag} into .repos/${repo.name}`);
  const exitCode = yield* spawner
    .exitCode(
      ChildProcess.make(
        "git",
        [
          "-c",
          "advice.detachedHead=false",
          "clone",
          "--depth",
          "1",
          "--branch",
          tag,
          repo.url,
          dir,
        ],
        {
          stdout: "inherit",
          stderr: "inherit",
        },
      ),
    )
    .pipe(Effect.mapError((cause) => new SyncRepoError({ repo: repo.name, step: "clone", cause })));
  if (exitCode !== 0) {
    return yield* new SyncRepoError({
      repo: repo.name,
      step: "clone",
      cause: `git exited ${exitCode}`,
    });
  }
});

Effect.forEach(referenceRepos, syncRepo, { discard: true }).pipe(
  Effect.provide(NodeServices.layer),
  NodeRuntime.runMain,
);
