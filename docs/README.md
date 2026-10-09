# Effect + Alchemy boilerplate: architecture docs

These docs define how projects built from this boilerplate are laid out and how they write Effect
code. They ship inside every project created with `create-effect-alchemy`, and the template in
this repo implements everything they describe. Every rule here is taken from a production codebase that relies heavily on Effect, and each
one cites where it came from. Where the sources disagree, the docs say so and pick one.

| Doc | What it answers |
| --- | --- |
| [01 Reference codebases](./01-reference-codebases.md) | What we studied, what each codebase teaches, and how their conventions compare |
| [02 Project structure](./02-project-structure.md) | The recommended monorepo layout, what goes where, and dependency rules |
| [03 Effect patterns](./03-effect-patterns.md) | Services, layers, errors, `Effect.fn`, Schema, config, HTTP, runtime boundaries, testing |
| [04 Alchemy patterns](./04-alchemy-patterns.md) | Stacks, resources, Workers, bindings, stages, secrets, dev, tests, CI |
| [05 Tooling](./05-tooling.md) | pnpm catalogs, tsconfig, the Effect language service, lint, format, tests, knip |
| [06 Checklists](./06-checklists.md) | Do/don't list, the recipe for adding a feature, and a pre-push checklist |
| [Architecture visualizations](./visualizations/architecture.html) | Interactive diagrams of the layout, layer graph, Worker phases, and request flow |

## Versions this is written against

| Package | Version | Notes |
| --- | --- | --- |
| `effect` | `4.0.x` (4.0.2 at time of writing) | 4.x is the LTS line. HTTP, RPC, SQL, CLI and testing now ship inside `effect` as `effect/http`, `effect/http-api`, `effect/rpc`, `effect/sql`, `effect/cli`, `effect/testing` |
| `alchemy` | `2.0.0-beta.81` | v2 is "Infrastructure-as-Effects" and is built on Effect 4. Still beta: expect breaking changes |
| `@effect/vitest` | `4.0.x` | `it.effect`, `it.layer`, `TestClock` |
| `@effect/tsgo` | `0.51.x` | Patches TypeScript 7 so Effect diagnostics fail `tsc` |
| `typescript` | `7.0.x` | Effect requires 5.9 or newer and recommends 7 |
| Node | 24 | Runs `.ts` directly. Bun also works with Alchemy |

## The rules in brief

1. **`alchemy.run.ts` is the composition root and stays thin.** It names the Stack, merges
   providers, picks a state store, and returns outputs. Resources and Workers live in `src/`.
2. **Contracts live in their own package.** Schemas, branded IDs, tagged errors, and
   `HttpApi`/`RpcGroup` definitions go in `packages/contracts`. Servers and clients both import
   them, and the package has no runtime logic.
3. **Each feature is a service.** A domain folder holds one module per service. Each module has, in
   order: errors, the `Context.Service` tag with its interface inline, `make`, and `layer`.
4. **Transports are thin.** An HTTP or RPC handler decodes input, calls one service method, and
   maps errors. That's all it does.
5. **Infrastructure is an adapter.** Domain services depend on Effect services (ports). The Worker
   file turns Cloudflare bindings into layers (adapters) and provides them. Domain code can then be
   tested without Cloudflare.
6. **Errors are `Schema.TaggedError`.** They carry structured attributes and a `cause:
   Schema.Defect()`. Catch them with `Effect.catchTags`. Infrastructure failures that callers
   can't handle become defects.
7. **Every reusable effectful function is `Effect.fn("Service.method")`.** You get a tracing span
   for free.
8. **Import Effect modules one at a time as namespaces:** `import * as Effect from "effect/Effect"`.
9. **Read config once, during Worker construction.** Read it with `effect/Config` and turn it into
   a typed service. Business logic never reads env vars.
10. **Tests use `@effect/vitest`.** Use `it.effect` and `it.layer`, use real services, and fake
    only external boundaries. No sleeps: use `TestClock`, `Deferred`, or a drain.

## Sources

The repos were cloned into `.repos/` (gitignored) for this research:

- [Effect-TS/effect](https://github.com/Effect-TS/effect): `LLMS.md`, `MIGRATION.md`, `migration/`,
  `ai-docs/src/**`, `packages/effect/{HTTPAPI,CONFIG,SCHEMA}.md`, `packages/vitest`
- [alchemy-run/alchemy](https://github.com/alchemy-run/alchemy): `AGENTS.md`,
  `website/src/content/docs/**` (especially `project-structure/`), `examples/**`
- [pingdotgg/t3code](https://github.com/pingdotgg/t3code), focusing on Julius Marminge's work:
  - `docs/internals/effect-services.md`
  - `.macroscope/check-run-agents/effect-service-conventions.md`
  - `apps/server/src/**`, `packages/contracts`, `oxlint-plugin-t3code/`
  - **`infra/relay`**: a production Effect v4 + Alchemy v2 Cloudflare Worker. Julius wrote 81 of
    its ~95 commits. This is the closest real-world match for this boilerplate.
