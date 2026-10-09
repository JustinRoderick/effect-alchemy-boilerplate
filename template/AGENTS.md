# Agent guide

A full-stack Effect v4 + Alchemy v2 app on Cloudflare. Read `docs/README.md` for the conventions;
this file is the short version.

## Where code lives

- `alchemy.run.ts` is the composition root. It only names the Stack, picks providers and state, and
  returns outputs. If it grows, a unit is missing a home in `apps/*`.
- `packages/contracts` holds everything that crosses the wire: Schema models, branded IDs,
  `Schema.TaggedError`s, and the `HttpApi`. It has no runtime logic and depends only on `effect`.
- `apps/api/src/ApiWorker.ts` is wiring only. It binds resources, reads config, adapts bindings into
  layers, and serves the API.
- `apps/api/src/<domain>/` holds one module per service, the domain's `http.ts` handlers, and tests
  next to the code. Domain code never imports `alchemy` and never reads env vars.
- `apps/web` gets its API types from the contract through `ApiClient` atoms. Don't hand-write fetch
  calls.

## Rules

- **Services:** order each module as errors → `Context.Service` tag (interface inline) → `make` →
  `layer`. Get dependencies with `yield*`, never as `make` parameters.
- **Functions and errors:** every reusable effectful function is `Effect.fn("Service.method")`.
  Errors are `Schema.TaggedError`. Catch them with `Effect.catchTags`. Infrastructure failures
  become defects at the repository boundary.
- **Imports:** import Effect as namespaces, one module at a time: `import * as Effect from
  "effect/Effect"`. Relative imports carry `.ts`.
- **Transports stay thin:** a handler decodes, calls one service method, and maps errors.
- **No ambient globals:** use `Clock`, `DateTime`, `Crypto`, `Random`, `Effect.log`, and
  `HttpClient`. The type checker rejects `Date.now`, `Math.random`, `console`, `fetch`, and
  `crypto.randomUUID`.
- **Config:** read it only in the Worker's construction phase. A `Config` read inside `fetch` is
  never bound.
- **Tests:** use `@effect/vitest` (`it.effect`). Fake only external boundaries. Never sleep: use
  `TestClock`.
- **Suppressions:** every diagnostic suppression says why, after `--`.

## Verifying

- Run `pnpm test <file>` for the tests you touched, and `pnpm typecheck`.
- Run `pnpm check` before you hand work back.
- Run `pnpm dev` to try the app locally. It needs no cloud credentials.
- Never run `pnpm run deploy` or `pnpm run destroy` unless the developer asks.

## Reference source

Run `pnpm sync:repos` to clone effect and alchemy at the installed versions into `.repos/`. Prefer
their patterns (`.repos/effect/LLMS.md`, `.repos/effect/ai-docs`, `.repos/alchemy/examples`) over
invented ones. Never edit or import from `.repos/`.
