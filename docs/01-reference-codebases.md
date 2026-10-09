# 01: Reference codebases

We studied four codebases. Each one answers a different question.

| Codebase | Why it matters | What we take from it |
| --- | --- | --- |
| **Effect-TS/effect** | The library itself, plus its curated `ai-docs/` and migration guides | The correct v4 APIs, service/layer/error idioms, and HttpApi and test patterns |
| **alchemy-run/alchemy** | Infrastructure-as-Effects, built on Effect 4 | How to lay out a deployable project: Stack, resources, Workers, bindings, stages, dev, CI |
| **pingdotgg/t3code** (`apps/server`, `packages/*`) | A large Effect v4 production app (400k+ users) | Monorepo shape, contracts package, service module anatomy, lint-enforced rules, testing discipline |
| **pingdotgg/t3code `infra/relay`** | A production Effect v4 + Alchemy v2 Cloudflare Worker | How the pieces combine in one deployable unit. This is our template |

---

## Effect-TS/effect (v4.0.x)

**Where to look:**
- `LLMS.md`: the do/don't list
- `ai-docs/src/**`: runnable examples by topic
- `migration/*.md`: v3 → v4 changes
- `packages/effect/HTTPAPI.md`, `CONFIG.md`, `SCHEMA.md`: long guides

**What it teaches:**

- **Services are classes.**
  `class Database extends Context.Service<Database, { ... }>()("myapp/db/Database") {}`.
  `Effect.Service`, `Context.Tag`, accessors, and the auto-generated `.Default` layer are all gone
  in v4. You write the layer yourself, usually as `static readonly layer = Layer.effect(...)`.
- **Layer naming:** `layer` for the fully provided version, then `layerTest`, `layerConfig`,
  `layerNoDeps`, `layerMemory` for variants (`migration/services.md:196-199`).
- **Wire dependencies close to the service.** Dependencies are provided on the service's own layer
  so the entrypoint stays small (`ai-docs/src/40_sql/10_basics.ts:150-153`).
- **API contracts are separate from servers.** The ai-docs say this should "ideally" be a separate
  package in a monorepo (`ai-docs/src/51_http-server/10_basics.ts:12-15`). Their fixture uses
  `api/` (contract), `domain/` (models and errors), and `server/` (services and handler layers).
- **Use `Effect.fn("name")` for reusable functions.** Don't `.pipe` an `Effect.fn`; pass the
  combinators as extra arguments instead (`ai-docs/src/01_effect/01_basics/02_effect-fn.ts`).
- **Use the "reason" error pattern.** It keeps service error unions small:
  `UsersError { reason: UserNotFound | SearchQueryTooShort }`, handled with
  `Effect.catchReason(s)`.
- **Library internals use one module per PascalCase file.** Each package has a generated
  `index.ts` barrel (`export * as Module from "./Module.ts"`). Private code lives in `internal/`,
  which `package.json` exports block.

**v3 → v4 changes you'll hit most:**

| v3 | v4 |
| --- | --- |
| `Context.Tag` / `Effect.Tag` / `Effect.Service` | `Context.Service<Self, Shape>()("id")` |
| `.Default` / `Live` layers, `dependencies: [...]` | Hand-written `layer`, composed with `Layer.provide` |
| `Either`, `Effect.either` | `Result`, `Effect.result` |
| `Effect.catchAll` / `catchAllCause` | `Effect.catch` / `Effect.catchCause` |
| `Effect.fork` / `forkDaemon` | `Effect.forkChild` / `forkDetach` |
| `Layer.scoped`, `Layer.unwrapEffect` | `Layer.effect` (scoped by default), `Layer.unwrap` |
| `Schema.Union(A, B)`, `Schema.Literal("a", "b")` | `Schema.Union([A, B])`, `Schema.Literals(["a", "b"])` |
| `Schema.decodeUnknown` | `Schema.decodeUnknownEffect` |
| `@effect/platform`, `@effect/rpc`, `@effect/sql` | `effect/http`, `effect/http-api`, `effect/rpc`, `effect/sql` |
| `effect/unstable/*` (4.0 betas) | `effect/*`, with no compatibility exports |
| `HttpApiBuilder.toWebHandler` | `HttpRouter.toWebHandler` / `HttpRouter.toHttpEffect` |
| `effect/TestClock` | `effect/testing/TestClock` |

> **Gotchas:**
> - `packages/effect/HTTPAPI.md` still mentions `HttpApiBuilder.toWebHandler` in prose. That export
>   does not exist; use `HttpRouter.toWebHandler`.
> - Some Alchemy docs use `Schema.TaggedErrorClass`. In 4.0.2 the export is `Schema.TaggedError`.

---

## alchemy-run/alchemy (v2 beta)

**Where to look:**
- `AGENTS.md`: concepts and the typed-error doctrine
- `website/src/content/docs/project-structure/*.mdx`
- `examples/**`, especially:
  - `cloudflare-effect-sql-d1`
  - `cloudflare-federated-api`
  - `cloudflare-tanstack-rpc-drizzle`
  - `monorepo-single-stack`
  - `monorepo-multi-stack`

**What it teaches:**

- **Infrastructure and application logic are one Effect program.** A Worker's declaration and its
  runtime code live in the same `.ts` file (`main: import.meta.url`). There is no `wrangler.toml`.
- **The official file-layout guide has three rules**
  (`website/.../project-structure/file-layout.mdx`):
  1. One file per Resource or Layer.
  2. Group Resources that share a lifecycle.
  3. Keep `alchemy.run.ts` as the composition root. *"If `alchemy.run.ts` is growing, something is
     missing a home in `src/`."*
- **Resource declarations are inert values**, memoized by logical ID. Importing one deploys nothing.
  Yielding it from several places provisions it once.
- **Workers run in two phases.** The outer generator (Construction) runs at deploy/plan time and
  once per cold start: it binds resources, reads Config, and builds layers. The inner `fetch` runs
  per request.
- **Bindings are capability services.** `Cloudflare.R2.ReadWriteBucket(bucket)` returns a typed
  client and also registers the deploy-time binding. You provide the matching
  `...ReadWriteBucketBinding` layer. Prefer least privilege: use `Read`/`Write` over `ReadWrite`
  where you can.
- **Config is bound automatically.** Any `Config` yielded during Construction is bound into the
  Worker as a secret. A `Config` read only inside `fetch` is **never bound**. That is the documented
  footgun.
- **Typed-error doctrine:**
  - Handle errors with `catchTag`/`catchTags`.
  - Retry with bounded `Schedule`s.
  - Never use duck-typed `_tag` checks or loosened types. If a `catchTag` doesn't typecheck, fix
    the error union upstream.
- **Testing deploys the real Stack.** `Test.make({ providers, state })`, then `deploy(Stack)` and
  call the live URL. Alchemy offers no mocks, so unit tests of domain logic belong in plain
  `@effect/vitest`.

---

## t3code (`apps/server`, `packages/*`)

**Where to look:**
- `AGENTS.md`
- `docs/internals/effect-services.md`
- `.macroscope/check-run-agents/effect-service-conventions.md`
- `oxlint-plugin-t3code/rules/*`
- `apps/server/src/workspace/WorkspacePaths.ts`, the reference service module

**What it teaches:**

- **Package graph:** `contracts` → `shared` → `client-runtime` / `provider-core` → `apps/*`.
  `contracts` depends only on `effect`.
- **Packages ship TypeScript source.** `exports` point at `./src/*.ts`. `shared` and
  `client-runtime` use **subpath exports and no root barrel**, and a lint rule enforces that.
- **One module per service, inside a domain folder, with no `Services/` and `Layers/` split.**
  Julius removed that split in commit `3d17862e58` (2026-10-05, 191 files): *"one module per
  service instead of Services/ and Layers/ folders"*. If you're tempted to separate "interfaces"
  from "implementations" into folders, don't.
- **Service module order** (`docs/internals/effect-services.md`):
  1. imports
  2. errors and schemas
  3. the `Context.Service` tag with its interface inline (no `FooShape`; use `Foo["Service"]`)
  4. `make`
  5. `layer`
- **Dependencies come from `yield*`, never from `make` parameters or module globals.** The types
  of `make` and `layer` should show what they need.
- **"Server features are services; transports stay thin."** A handler decodes, calls one service
  method, and maps errors. This lets the WebSocket, HTTP, MCP tools, the CLI, and scheduled tasks
  all reach the same capability.
- **Most conventions are enforced by tooling, not by memory:**
  - The Effect language service (via `@effect/tsgo`) turns misuse into type errors:
    `globalDate`, `globalFetch`, `globalConsole`, `missingEffectServiceDependency`,
    `leakingRequirements`, `anyUnknownInErrorContext`, and others.
  - Custom oxlint rules: `prefer-catch-tags`, `no-inline-schema-compile`,
    `no-manual-effect-runtime-in-tests`, `require-suppression-reason`, and others.
  - Knip fails CI on unused exports.
- **Tests:**
  - `Foo.test.ts` sits next to `Foo.ts`.
  - Use `@effect/vitest` `it.effect` / `it.layer`.
  - Never `Effect.run*` in tests.
  - *"A test that needs a timeout to pass is wrong."*
- **Reference repos are vendored.** `.repos/effect-smol` and `.repos/alchemy-effect` are read-only
  references pinned to the installed versions. Agents are told to prefer their patterns over
  invented ones. This boilerplate does the same with `.repos/`.

---

## Case study: t3code `infra/relay`

This is the closest analog to what the boilerplate produces: a single Cloudflare Worker deployed
with Alchemy v2, written entirely in Effect v4, with shared contracts in a sibling package.

```
infra/relay/
├── alchemy.run.ts             # Stack: providers + Cloudflare.state(); yields db, zones, Worker; returns outputs
├── package.json               # scripts: deploy = alchemy deploy, destroy, test, typecheck
├── tsconfig.json              # extends ../../tsconfig.base.json; lib WebWorker; types workers-types
├── .env.example               # every config key, documented
├── migrations/postgres/       # generated by Drizzle.Schema
└── src/
    ├── worker.ts              # the Worker: 1) provision infra 2) create bindings 3) runtime layers
    ├── Config.ts              # RelayConfiguration service + Config combinators
    ├── db.ts                  # RelayDb service tag + Planetscale/Hyperdrive resource effects
    ├── queues.ts              # Cloudflare.Queues.Queue(...) declarations
    ├── zone.ts                # stage-aware zone resources + deployment config
    ├── observability.ts       # Axiom datasets/tokens + span helpers
    ├── persistence/schema.ts  # Drizzle tables
    ├── http/Api.ts            # HttpApiBuilder.group(...) handler layers + auth middleware layers
    ├── auth/                  # DpopProofs.ts, RelayTokens.ts (+ .test.ts)
    ├── environments/          # EnvironmentLinker.ts, EnvironmentCredentials.ts, ... (+ .test.ts)
    ├── agentActivity/         # Devices.ts, ApnsClient.ts, FcmDeliveries.ts, ... (+ .test.ts)
    └── hooks/                 # HookForwarder.ts, HookInbox.ts (port), HookInboxObject.ts (Durable Object)
```

**Patterns worth copying:**

1. **The Worker file has three labelled sections.** `src/worker.ts` is literally commented
   `// 1. Provision Infrastructure`, `// 2. Create bindings`, and
   `// 3. Runtime layers and app construction`, and it returns `{ fetch }`.
2. **Ports live in domain folders; adapters are built in the Worker.**
   - `hooks/HookInbox.ts` is a plain `Context.Service` with `hold`/`wake`/`clear` and a typed
     `HookInboxError`.
   - `worker.ts` builds `Layer.succeed(HookInbox.HookInbox, { hold: ... })` on top of the Durable
     Object binding.
   - Other modules expose named adapter layers, such as
     `ApnsDeliveryQueue.layerCloudflareQueues(sender, ctx)` and
     `ManagedEndpointProvider.layerCloudflareBindings(...)`.
   - Domain services never touch a Cloudflare binding, which is why they test with plain
     `@effect/vitest`.
3. **One flat runtime layer.** `layerRuntime = Layer.empty.pipe(Layer.provideMerge(A),
   Layer.provideMerge(B), ...)`. It is listed from top (most dependent) to bottom (foundations:
   DB, config, crypto), then provided to the HTTP layer, the queue consumers, and the cron job.
4. **Contracts are shared.** `RelayApi` (an `HttpApi`) lives in `packages/contracts/src/relay.ts`
   with its schemas and `Schema.TaggedError`s (with `{ httpApiStatus }`). The Worker serves it with
   `HttpApiBuilder.layer(RelayApi, { openapiPath: "/openapi.json" })` plus `HttpApiScalar` docs at
   `/docs`.
5. **Config becomes a service.** Raw `Config.String`/`Config.Redacted` reads happen once, in
   Construction, and are packed into `RelayConfiguration.of({...})`. Services `yield*
   RelayConfiguration` and never read the environment.
6. **Infrastructure is stage-aware, next to the resource it affects.** `db.ts` creates a real
   Planetscale DB on `prod` and a branch per personal stage. `zone.ts` adopts or references zones
   per stage.
7. **Background work is first-class.** `Cloudflare.Queues.consumeQueueMessages(queue, opts, stream
   => ...)` and `Cloudflare.Workers.cron("*/5 * * * *", () => ...)` run in the same Effect
   runtime layer as the HTTP handlers.
8. **Every service method is traced.** Methods use `Effect.fn("relay.devices.register")` plus
   `Effect.annotateCurrentSpan({...})`, exported to Axiom through `Axiom.Telemetry`.

---

## Convention matrix

When the sources disagree, the "Boilerplate" column is our pick.

| Topic | Effect repo | Alchemy | t3code | **Boilerplate** |
| --- | --- | --- | --- | --- |
| Effect imports | ai-docs: `import { Effect } from "effect"`; library: namespace per module | `import * as Effect from "effect/Effect"` | Namespace per module (LSP-enforced) | **Namespace per module** |
| Service definition | `Context.Service` class + `static layer` | `Context.Service` + `Layer.effect` | `Context.Service` + module-level `make` / `layer` | **Module-level `make` + `layer`** (the class stays a pure tag) |
| Service id | `"myapp/db/Database"` | `"app/Auth"` | `"t3/area/Name"` | **`"@app/<pkg>/<area>/<Name>"`** |
| Errors | `Schema.TaggedError` | `Data.TaggedError` internally, `Schema.TaggedError` on the wire | `Schema.TaggedError` + `cause: Schema.Defect()` | **`Schema.TaggedError` everywhere** |
| Catching | `catchTag` / `catchTags` / `catchReason` | `catchTag` / `catchTags` | `catchTags` only (lint) | **`catchTags`** |
| Test location | `test/` mirrors `src/` | `test/` (integration) | Colocated `Foo.test.ts` | **Colocated unit tests; `test/` for deploy tests** |
| Formatter | dprint (no semicolons) | oxfmt | oxfmt via vite-plus | **oxfmt** |
| Linter | oxlint + `@effect/oxc` | oxlint + effect-tsgo rules | oxlint + custom plugin | **oxlint** |
| Package exports | Generated barrel per package | `./*` → `./src/*.ts` | Subpath exports, no barrel | **Subpath exports to `.ts` source** |
| Folder style | One module per file | One file per Resource | Flat domain folders | **Flat domain folders** |
