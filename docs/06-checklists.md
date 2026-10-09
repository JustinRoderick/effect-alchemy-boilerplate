# 06: Checklists

## Adding a feature

Example: "users can mark a todo complete".

1. **Contract** (`packages/contracts/src/todos.ts`)
   - Add the endpoint to `TodosGroup`:
     `HttpApiEndpoint.post("complete", "/:id/complete", { params, success, error })`.
   - Add any new wire error as a `Schema.TaggedError` with `{ httpApiStatus }`.
2. **Service** (`apps/api/src/todos/Todos.ts`)
   - Add `complete` to the `Todos` interface, implement it with `Effect.fn("Todos.complete")`, and
     return it from `make`.
   - Extend the service that already owns the domain. Only create a new service when no existing
     one fits.
3. **Persistence**, if needed (`TodoRepo.ts` and `migrations/000N_*.sql`)
   - Add the repo method and the migration.
4. **Handler** (`apps/api/src/todos/http.ts`)
   - `.handle("complete", ({ params }) => todos.complete(params.id))`. One call, nothing else.
5. **Test** (`apps/api/src/todos/Todos.test.ts`)
   - `it.effect` through the real service, with SQLite standing in for D1. Include the failure
     path: `Effect.flip` → assert on `_tag`.
6. **Client**, if there is one (`apps/web`)
   - It already has the endpoint, because `HttpApiClient.make(AppApi)` derives it from the
     contract.
7. **Other entry points**
   - Should a queue consumer, cron job, or agent tool also reach this? If it's a service method,
     it already can. If it isn't, is that deliberate?
8. **Reverse states.** If you added a way in, add a way out. Complete needs uncomplete.

## Adding infrastructure

1. Declare the resource in its own file under `apps/api/src/` (`Bucket.ts`), or add it to the file
   that groups resources with the same lifecycle.
2. Bind it in the Worker's construction phase with the narrowest capability
   (`ReadBucket` over `ReadWriteBucket`), and provide the matching `*Binding` layer.
3. **Adapt it into a port.** Don't hand the binding to domain code. Either:
   - write `Layer.succeed(Port, {...})` in the Worker, or
   - add a named `layerCloudflareX(binding)` adapter to the port's module.
4. Make stage-specific decisions next to the resource: `RemovalPolicy.retain(stage === "prod")`,
   or a `.ref(...)` that borrows prod's resource.
5. Add new config keys to `.env.example`, with a comment saying where the value comes from.

## Do / don't

### Structure

| ✅ Do | ❌ Don't |
| --- | --- |
| Keep `alchemy.run.ts` to Stack, providers, state, and outputs | Grow resources, runtime code, or stage `if`s in it |
| Put wire types in `packages/contracts` | Import server code into a client to reuse a type |
| Use flat domain folders with one module per service and tests next to the code | Split into `Services/` and `Layers/` folders (t3code removed exactly this) |
| Use subpath exports to `.ts` source | Add a root barrel, or add a build step to internal packages |
| Delete the old file and update every consumer when a service moves | Leave re-export shims |

### Services and layers

| ✅ Do | ❌ Don't |
| --- | --- |
| `class X extends Context.Service<X, { ...inline }>()("@app/pkg/area/X") {}` | `Context.Tag`, `Effect.Service`, `.Default`, `XShape` interfaces |
| Order the module: errors → tag → `make` → `layer` | Spread one service across files |
| Get dependencies with `yield* Dep` inside `make` | Take services as `make` parameters, or hide them in module globals |
| Name layers `layer`, `layerTest`, `layerMemory`, `layerConfig`, `layer<Adapter>` | Name layers `Live`, `Default`, `XLive.ts` |
| Provide fixed dependencies on the service's own layer; leave ports for the composition root | Wire the whole graph in `main`, or provide the same layer in many places |
| Use `yield* Service` | Use `Service.use(...)` accessors in domain code |

### Functions and errors

| ✅ Do | ❌ Don't |
| --- | --- |
| `Effect.fn("Service.method")(function* ...)` for every reusable effectful function | Write functions that just return `Effect.gen`, or `.pipe()` an `Effect.fn` |
| Use `Schema.TaggedError` with structured attributes and `cause: Schema.Defect()` | Throw, or build messages from `cause.message` |
| Use `return yield* new NotFound({ id })` | Call `Effect.fail(...)` without `return` in a generator |
| Use `Effect.catchTags({ A: ..., B: ... })` | Check `_tag` by hand, use `catchIf` with a schema predicate, or loosen to `unknown` |
| Turn infrastructure failures into defects (`Effect.orDie`) at the repository boundary | Leak `SqlError` / `SchemaError` into domain interfaces |
| Map to transport errors only in the transport | Wrap a whole pipeline in one generic error |

### Edges

| ✅ Do | ❌ Don't |
| --- | --- |
| Read `Config` once, in Worker construction, and pass it in as a typed service | Read `process.env` or `Config` inside `fetch` (it won't be bound) or inside services |
| Keep handlers to decode → one service call → map errors | Put retries, persistence, or multi-step logic in handlers |
| Use one runtime per app, at the edge | Call `Effect.runPromise` inside services, or create a runtime per feature |
| Use `Clock`, `DateTime`, `Random`, `Effect.log`, `HttpClient`, `Schedule` | Use `Date.now`, `Math.random`, `console.log`, `fetch`, or `setTimeout` |
| Acquire per-request resources inside `fetch` (scoped) | Open connections or pools during Worker construction |

### Tests

| ✅ Do | ❌ Don't |
| --- | --- |
| Use `it.effect` and `it.layer` from `@effect/vitest` | Call `Effect.runPromise` or `ManagedRuntime.make` in tests |
| Test through real services, faking only external boundaries | Mock the logic under test |
| Use `TestClock.adjust`, a `Deferred`, or a drain | Use `sleep`, polling, or a longer timeout to make a test pass |
| Use `it.effect.each(cases)` | Write tests inside `for` loops |
| Test handlers with `HttpApiTest.groups(AppApi, [...])` | Start a real server for handler logic |

## Before you push

- [ ] Does any handler you touched do more than decode, call one service method, and map errors?
- [ ] Could a cron job, queue consumer, or agent tool use this capability? If not, is that deliberate?
- [ ] Did you extend the domain's existing service before adding a new one?
- [ ] Are new errors `Schema.TaggedError` with bounded attributes, and are messages free of `cause` text?
- [ ] Do new reusable effectful functions use `Effect.fn("...")`?
- [ ] Is new config read during Worker construction and listed in `.env.example`?
- [ ] Does every new lint, type-checker, or diagnostic suppression say why?
- [ ] `pnpm check` passes: format, lint, typecheck, unit tests, knip.
- [ ] For infrastructure changes, did you run `alchemy plan` (or deploy to your own stage) and read the diff?
