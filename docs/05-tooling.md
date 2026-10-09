# 05: Tooling

The reference codebases rely on **tooling, not memory**, to keep Effect code consistent. t3code
turns most of its conventions into type errors or lint failures. This doc lists the toolchain the
boilerplate uses and the specific settings that matter.

| Concern | Tool | Source |
| --- | --- | --- |
| Package manager | pnpm workspaces + **catalog** + overrides | t3code, Alchemy |
| Type checking | TypeScript 7 patched by **`@effect/tsgo`** | t3code (`prepare: effect-tsgo patch`), Alchemy |
| Effect diagnostics | `@effect/language-service` plugin in `tsconfig.base.json` | t3code |
| Lint | **oxlint** (optionally with Effect rules via `effect-tsgo patch --oxlint`) | Alchemy, t3code, Effect |
| Format | **oxfmt** | Alchemy, t3code (via vite-plus) |
| Tests | **Vitest** + **`@effect/vitest`** | All three |
| Dead code | **knip** (fails on unused exports and deps) | t3code |
| Agent context | `AGENTS.md` + read-only `.repos/` reference clones | t3code |

## pnpm: one version of Effect

```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*

# One version of each shared dependency, referenced as "catalog:" from every package.json.
catalog:
  "@alchemy.run/frontend-frameworks": 2.0.0-beta.81
  "@cloudflare/workers-types": 5.20261009.1
  "@effect/atom-react": 4.0.2
  "@effect/platform-bun": 4.0.2
  "@effect/platform-node": 4.0.2
  "@effect/sql-sqlite-node": 4.0.2
  "@effect/tsgo": 0.51.1
  "@effect/vitest": 4.0.2
  "@types/node": 26.6.4
  "@types/react": 19.3.0
  "@types/react-dom": 19.3.0
  "@vitejs/plugin-react": 6.1.2
  alchemy: 2.0.0-beta.81
  effect: 4.0.2
  knip: 6.40.0
  oxfmt: 0.72.0
  oxlint: 1.87.0
  react: 19.3.0
  react-dom: 19.3.0
  typescript: 7.0.2
  vite: 8.3.4
  vitest: 5.0.3

# Two copies of effect break service identity: force every dependent onto the catalog version.
overrides:
  effect: "catalog:"

# Dependencies allowed to run install scripts (pnpm 11+ uses allowBuilds, pnpm 10 onlyBuiltDependencies).
allowBuilds:
  esbuild: true
  workerd: true
onlyBuiltDependencies:
  - esbuild
  - workerd
```

- **Every package.json uses `"effect": "catalog:"`.** Bump versions in one place.
- **The `overrides` entry keeps transitive deps on the same `effect`.** Two copies break service
  identity and `instanceof` checks. t3code, Alchemy, and Effect all pin this way.
- **Internal packages use `"@app/contracts": "workspace:*"`.**
- **Install scripts must be allowed explicitly.** pnpm 10+ blocks dependency install scripts, so
  `allowBuilds` (pnpm 11+) and `onlyBuiltDependencies` (pnpm 10) allow `esbuild` and `workerd`.
- **pnpm 11+ may append a `minimumReleaseAgeExclude` block** when a pinned version was published
  very recently. It's harmless, and you can commit it or delete it.

## Packages ship TypeScript source

```jsonc
// packages/contracts/package.json
{
  "name": "@app/contracts",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./api": "./src/api.ts",
    "./health": "./src/health.ts",
    "./ids": "./src/ids.ts",
    "./todos": "./src/todos.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "effect": "catalog:"
  }
}
```

- **Packages don't need a build step.** Node 24 strips types, and Vite and the Alchemy bundler
  read `.ts` directly. t3code and Alchemy both point `exports` at `./src/*.ts`.
- **Use explicit subpath exports and no root barrel.** Consumers write
  `import { Todo } from "@app/contracts/todos"`. t3code's `shared` and `client-runtime` follow
  this rule, and a lint rule enforces it. It keeps each import graph small and makes knip precise.
- **If you need a barrel, re-export whole modules as namespaces:**
  `export * as Todos from "./todos.ts"`. Never re-export renamed `make` or `layer` functions.

## TypeScript

```jsonc
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "plugins": [
      {
        "name": "@effect/language-service",
        "namespaceImportPackages": ["effect", "@effect/platform-node"],
        "diagnosticSeverity": {
          // HttpApi, sql, Crypto and cli are marked unstable in effect 4.0; this project uses them on purpose.
          "unstableApiUsage": "off",
          "anyUnknownInErrorContext": "error",
          "missingEffectServiceDependency": "error",
          "leakingRequirements": "error",
          "unsafeEffectTypeAssertion": "error",
          "instanceOfSchema": "error",
          "globalErrorInEffectCatch": "error",
          "globalErrorInEffectFailure": "error",
          "unknownInEffectCatch": "error",
          "preferSchemaOverJson": "error",
          "schemaSyncInEffect": "error",
          "cryptoRandomUUID": "error",
          "cryptoRandomUUIDInEffect": "error",
          "globalDate": "error",
          "globalDateInEffect": "error",
          "globalConsole": "error",
          "globalConsoleInEffect": "error",
          "globalRandom": "error",
          "globalRandomInEffect": "error",
          "globalTimers": "error",
          "globalTimersInEffect": "error",
          "globalFetch": "error",
          "globalFetchInEffect": "error"
        },
        "overrides": [
          {
            "include": ["**/*.test.ts"],
            "options": { "diagnosticSeverity": { "preferSchemaOverJson": "off" } }
          }
        ]
      }
    ]
  }
}
```

- **The options make Node's type stripping work:** `NodeNext`, `.ts` import extensions,
  `erasableSyntaxOnly`, and `verbatimModuleSyntax`. Write `import * as X from "./X.ts"`.
- **The strictness flags are the ones t3code uses:** `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, and `noImplicitOverride`. Turning them on later is painful, so
  start with them.
- **Run `effect-tsgo patch` in the `prepare` script.** Without it, the language service only shows
  these diagnostics in the editor. With it, `tsc --noEmit` reports them as errors in CI.
- **Every package has its own `tsconfig.json` for its runtime.**
  - `apps/api` adds `"lib": ["ES2023", "WebWorker"]` and
    `"types": ["@cloudflare/workers-types", "node"]`, as the relay does.
  - `apps/web` switches to `moduleResolution: "Bundler"` with DOM libs and `vite/client`.
  - The template's browser code didn't need any diagnostics relaxed. If yours does (for example
    `globalDate` in UI code), turn it off in that package only, as t3code does.
- **`unstableApiUsage` is off.** HttpApi, `effect/sql`, `Crypto`, and `effect/cli` are all marked
  unstable in 4.0, and the template uses them on purpose. Alchemy turns the same warning off.
- **Every suppression must say why:**
  `// @effect-diagnostics-next-line nodeBuiltinImport:off -- Effect's Crypto has no createHmac`.
  t3code enforces this with `require-suppression-reason`.

The diagnostics are what turn the guidance in [03](./03-effect-patterns.md) into errors:

| Diagnostic | Catches |
| --- | --- |
| `missingEffectServiceDependency` / `leakingRequirements` | A service whose layer doesn't declare what it uses, or that leaks requirements into its interface |
| `anyUnknownInErrorContext` / `unknownInEffectCatch` | `any`/`unknown` in error channels, and untyped catches |
| `globalDate` / `globalRandom` / `globalTimers` / `globalConsole` / `globalFetch` | Ambient globals that make code untestable (use `Clock`, `Random`, `Schedule`, `Effect.log`, `HttpClient`) |
| `preferSchemaOverJson` / `schemaSyncInEffect` | `JSON.parse`, and sync decoders inside effects |
| `cryptoRandomUUID` | `crypto.randomUUID()` (inject an ID service or use `Random`) |

## Lint and format

```jsonc
// .oxlintrc.json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "unicorn", "oxc", "import", "react"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "rules": {
    "import/no-cycle": "error",
    "react/react-in-jsx-scope": "off",
    "no-underscore-dangle": [
      "warn",
      {
        "allow": ["_tag"]
      }
    ],
    "import/no-unassigned-import": [
      "warn",
      {
        "allow": ["**/*.css"]
      }
    ]
  },
  "ignorePatterns": [".alchemy/**", ".repos/**", "**/dist/**", "docs/**"]
}
```

```jsonc
// .oxfmtrc.json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "semi": true,
  "singleQuote": false,
  "printWidth": 100,
  "trailingComma": "all",
  "sortPackageJson": true,
  "ignorePatterns": [
    ".alchemy/**",
    ".repos/**",
    "**/dist/**",
    "**/*.md",
    "docs/**",
    "pnpm-lock.yaml"
  ]
}
```

- **Effect-specific lint rules (optional).** `effect-tsgo patch --oxlint` adds an `effecttsgo`
  oxlint plugin with about 50 idiom rules, such as `effect-fn-opportunity`,
  `catch-if-tag-to-catch-tag`, `unnecessary-effect-gen`, and `redundant-or-die`. Alchemy runs most
  of them at `warn`. They need `typeAware: true` and `oxlint-tsgolint`.
- **Rules worth porting from `t3code/oxlint-plugin-t3code` when the codebase grows:**

| Rule | Enforces |
| --- | --- |
| `prefer-catch-tags` | `Effect.catchTags({...})` instead of `catchTag` |
| `no-inline-schema-compile` | Hoist `Schema.decode*/encode*/is` to module scope |
| `no-manual-effect-runtime-in-tests` | No `Effect.run*` or `ManagedRuntime.make` in `*.test.ts` |
| `no-test-in-loop` | `it.effect.each(...)` instead of tests inside `for` loops |
| `require-suppression-reason` | Every disable directive has a `-- reason` |

Each rule is a small JS plugin, around 50–150 lines, with its own test. Copy them into a local
`oxlint-plugin-app/` and list them under `jsPlugins` once the conventions start to slip.

## Tests

```ts
// vitest.config.ts
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
```

- **`pnpm test` runs only `--project unit`.** Run `pnpm test:integ` when you mean it.
- **Effect's repo also runs `addEqualityTesters()` in a `vitest.setup.ts`.** That lets `expect`
  compare Effect data types (`Option`, `Exit`, ...) structurally.

## knip

```jsonc
// knip.jsonc
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  // Exported types are part of the contract surface even before something uses them.
  "rules": { "types": "off", "nsTypes": "off" },
  "workspaces": {
    ".": {
      "entry": ["alchemy.run.ts"],
      // The tsconfig plugin is built into @effect/tsgo, which `prepare` patches in.
      "ignoreDependencies": ["@effect/language-service"],
    },
    "apps/api": {
      "entry": ["src/ApiWorker.ts", "test/**/*.ts"],
    },
    "packages/*": {
      // An export nobody imports is dead code, even in a shared package.
      "includeEntryExports": true,
    },
  },
}
```

Knip enforces "export only what's imported." This is why t3code keeps `make` private unless
another module uses it.

## Root scripts

```jsonc
// package.json (pnpm flavor; create-effect-alchemy rewrites these for bun and npm)
{
  "scripts": {
    "prepare": "effect-tsgo patch",
    "dev": "alchemy dev",
    "deploy": "alchemy deploy",
    "destroy": "alchemy destroy",
    "plan": "alchemy plan",
    "typecheck": "tsc --noEmit && tsc --noEmit -p packages/contracts && tsc --noEmit -p apps/api && tsc --noEmit -p apps/web",
    "lint": "oxlint",
    "fmt": "oxfmt",
    "fmt:check": "oxfmt --check",
    "test": "vitest run --project unit",
    "test:watch": "vitest --project unit",
    "test:integ": "vitest run --project integ",
    "knip": "knip",
    "check": "pnpm fmt:check && pnpm lint && pnpm typecheck && pnpm test && pnpm knip",
    "sync:repos": "node scripts/sync-repos.ts"
  }
}
```

## Package managers

The template is authored and tested as a pnpm workspace. `create-effect-alchemy` derives the other
two flavors from it (see `src/Template.ts` in the boilerplate repo):

| | pnpm | bun | npm |
| --- | --- | --- | --- |
| Workspaces | `pnpm-workspace.yaml` | `package.json` `workspaces.packages` | `package.json` `workspaces` |
| Catalog | `catalog:` in `pnpm-workspace.yaml` | `workspaces.catalog`, still `catalog:` | Exact versions written into each `package.json` |
| Internal packages | `workspace:*` | `workspace:*` | `*` |
| Install scripts | `allowBuilds` | `trustedDependencies` | Allowed by default (npm 11 warns) |
| Lockfile | The template's `pnpm-lock.yaml` (v9) | Generated on install | Generated on install |
| Running scripts | `pnpm dev` (`pnpm run deploy`: `deploy` is a pnpm built-in) | `bun run <script>` (`bun test` is Bun's own runner) | `npm run <script> -- <args>` |

The root `typecheck` script runs `tsc -p` once per package, so it doesn't depend on any
manager's recursive-run syntax. When you add a package, add it to that list.

## Agent context: `AGENTS.md` and `.repos/`

t3code's setup is worth copying as-is:

- **`AGENTS.md` at the root, and `CLAUDE.md` containing only `@AGENTS.md`.** Keep it short.
  Include the glossary, how to run and verify, where code lives, and the "taste" rules, and link
  to these docs for detail. t3code's documentation rule: *"Before adding a paragraph, ask what a
  maintainer would get wrong without it."*
- **`.repos/` holds gitignored, read-only clones of `effect` and `alchemy`,** pinned to the
  installed versions. Agents read real source and `LLMS.md` / `ai-docs` instead of guessing APIs.
  t3code's `AGENTS.md` says: *"Prefer their patterns over invented ones. Never edit or import from
  them."*
  - `scripts/sync-repos.ts` (run it with `pnpm sync:repos`) clones each one at the installed tag
    (`effect@<version>`, `v<version>`).
  - It skips a clone that's already at that tag. It checks with `git tag --points-at`, because the
    effect release commit carries a tag for every package.
- **Exclude `.repos/**` from the formatter, linter, knip, Vitest, and TypeScript.**
