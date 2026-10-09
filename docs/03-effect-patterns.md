# 03: Effect patterns

These are the Effect v4 idioms the boilerplate uses. Snippets come from the generated project's
`todos` domain (see [02](./02-project-structure.md)), sometimes shortened; the file each one comes
from is named in its first line. Every API used here is checked against the installed
`effect@4.0.2`.

> **Check APIs against the installed version, not `main`.** Effect moves fast between releases.
> For example, `Crypto.randomUUIDv7` is an `Effect` in 4.0.2 but a function on the repo's `main`
> branch. Read `node_modules/effect/dist/*.d.ts`, or run `pnpm sync:repos` to get `.repos/effect`
> at exactly the installed tag.

---

## 1. Imports

Import each Effect module as a namespace from its own subpath:

```ts
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as HttpApiBuilder from "effect/http-api/HttpApiBuilder";
import * as SqlClient from "effect/sql/SqlClient";
```

- t3code requires this, and the Effect language service enforces it with
  `namespaceImportPackages: ["effect", ...]`. Alchemy and the Effect library source do the same.
  Effect's `ai-docs` use `import { Effect } from "effect"`. That also works, but pick one style for
  the whole repo. The boilerplate uses namespaces.
- Import your own service modules the same way: `import * as Todos from "./Todos.ts"`, then use
  `yield* Todos.Todos` and `Todos.layer`. Never write `import { layer as todosLayer }`.
- Named imports are fine for contracts, pure helpers, schemas, and types:
  `import { Todo, TodoId } from "@app/contracts/todos"`.
- `effect/unstable/*` paths are gone in 4.0 and have no compatibility exports. Use `effect/http`,
  `effect/http-api`, `effect/rpc`, `effect/sql`, `effect/cli`, and `effect/testing`.

---

## 2. Service modules

**One module per service.** The module contains, in order:

1. Imports.
2. Errors and schemas.
3. The `Context.Service` tag, with its interface written inline.
4. `make`.
5. `layer`.

This order comes from t3code's `docs/internals/effect-services.md`. Its reference files are
`apps/server/src/workspace/WorkspacePaths.ts` and the relay's `agentActivity/Devices.ts`.

```ts
// apps/api/src/todos/TodoRepo.ts (shortened)
import { TodoId } from "@app/contracts/ids";
import { Todo, TodoTitle } from "@app/contracts/todos";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import * as SqlClient from "effect/sql/SqlClient";
import * as SqlSchema from "effect/sql/SqlSchema";

// Row shape is a persistence detail: SQLite stores booleans as 0/1.
const TodoRow = Schema.Struct({ id: TodoId, title: TodoTitle, completed: Schema.BooleanFromBit });

/** Persistence for todos, written against `SqlClient` so it runs on D1 or SQLite alike. */
export class TodoRepo extends Context.Service<
  TodoRepo,
  {
    readonly list: Effect.Effect<ReadonlyArray<Todo>>;
    readonly findById: (id: TodoId) => Effect.Effect<Option.Option<Todo>>;
    /** Returns whether a todo was deleted. */
    readonly remove: (id: TodoId) => Effect.Effect<boolean>;
    // ...count, insert, setCompleted
  }
>()("@app/api/todos/TodoRepo") {}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient; // a port: D1 in the Worker, SQLite in tests

  const listRows = SqlSchema.findAll({
    Request: Schema.Void,
    Result: TodoRow,
    execute: () => sql`SELECT id, title, completed FROM todos ORDER BY created_at, id`,
  });
  const findRow = SqlSchema.findOneOption({
    Request: TodoId,
    Result: TodoRow,
    execute: (id) => sql`SELECT id, title, completed FROM todos WHERE id = ${id}`,
  });
  const deleteRow = SqlSchema.findOneOption({
    Request: TodoId,
    Result: Schema.Struct({ id: TodoId }),
    execute: (id) => sql`DELETE FROM todos WHERE id = ${id} RETURNING id`,
  });

  // SqlError and SchemaError aren't something callers can handle: they become defects here,
  // so the service interface only carries domain errors.
  return TodoRepo.of({
    list: listRows(undefined).pipe(Effect.orDie, Effect.withSpan("TodoRepo.list")),
    findById: Effect.fn("TodoRepo.findById")((id) => findRow(id).pipe(Effect.orDie)),
    remove: Effect.fn("TodoRepo.remove")((id) =>
      deleteRow(id).pipe(Effect.map(Option.isSome), Effect.orDie),
    ),
  });
});

export const layer = Layer.effect(TodoRepo, make);
```

Rules for service modules:

- **Write the interface inline. Don't add a separate `FooShape` type.** Refer to the type as
  `TodoRepo["Service"]`. This is t3code's rule, and its review bot flags new `Shape` interfaces.
- **Get dependencies with `yield*`, never as parameters to `make`.** Then the types of `make` and
  `layer` list what they need. Here `layer: Layer<TodoRepo, never, SqlClient>`.
  - Configuration values and plain callbacks can be parameters; they aren't services.
  - Example: `export const layer = (cfg: AppConfig["Service"]) => Layer.succeed(AppConfig, cfg)`.
- **Name the tag id `"<package>/<path>/<Name>"`.** For example `"@app/api/todos/TodoRepo"`.
  Effect's `LLMS.md` and t3code both use this format.
- **Return `Tag.of({...})` from `make`.** It type-checks the object against the interface.
- **Pick the constructor that fits.** Use `Layer.effect` when construction is effectful,
  `Layer.succeed` for a constant, and `Layer.sync` for lazy pure work. Don't write
  `make = Effect.succeed(...)` just so you can use `Layer.effect`.
- **Only export `make` if another module imports it.** Knip fails on unused exports.
- **Don't use accessors.** `Service.use(fn)` exists, but Effect's migration guide says to
  "prefer `yield*`" because `use` hides the dependency.
- **Ambient values with a sensible default are `Context.Reference`, not services.** t3code uses
  `HostProcessPlatform`; feature flags are another example:
  `Context.Reference<boolean>("@app/FeatureX", { defaultValue: () => false })`.

### Ports and adapters

A port is a service whose implementation depends on where the code runs. The template has two,
both Effect built-ins:

| Port | In the Worker | In unit tests |
| --- | --- | --- |
| `SqlClient.SqlClient` | `SQL.D1Layer(d1)` (from `alchemy/SQL/D1`) | `TestDatabase.layer`: in-memory SQLite running `migrations/*.sql` |
| `Crypto.Crypto` | `WebCrypto.layer`: the Workers Web Crypto API | the same `WebCrypto.layer` (Node 24 has Web Crypto) |

For your own ports, such as a queue, an email sender, or a blob store, put the implementations in
the port's module and give each one a name. The relay does this with
`ApnsDeliveryQueue.layerCloudflareQueues(...)`; t3code does it with
`RelayClient.layerCloudflared`. This example isn't in the template:

```ts
// apps/api/src/notifications/Mailer.ts
export class Mailer extends Context.Service<
  Mailer,
  { readonly send: (msg: Email) => Effect.Effect<void, MailerError> }
>()("@app/api/notifications/Mailer") {}

/** Records sent mail so tests can assert on it. */
export const layerMemory = Layer.sync(Mailer, () => { /* ... */ });

/** Sends through a Cloudflare Queue producer. The Worker passes the binding in. */
export const layerCloudflareQueue = (queue: Cloudflare.Queues.WriteQueueClient) =>
  Layer.succeed(Mailer, Mailer.of({ send: (msg) => queue.send(msg).pipe(/* map errors */) }));
```

Domain services `yield* Mailer.Mailer` and have no idea which implementation they got.

---

## 3. Layers

**Naming.** In v4 there's no `.Default` and no `Live` suffix.

| Name | Meaning |
| --- | --- |
| `layer` | The primary implementation |
| `layerTest` / `layerMemory` | In-memory or test implementation |
| `layerConfig` | Reads its options from `Config` |
| `layerNoDeps` | The implementation with its dependencies still open (Effect ai-docs) |
| `layer<Adapter>` | A named adapter on a port, e.g. `layerCloudflareQueue`, `layerD1` |

**Where dependencies get provided.**

- Provide **fixed** dependencies right on the service's layer. Effect's ai-docs explain why:
  *"Provide the layers locally, so lots of messy wiring doesn't need to happen in the 'main'
  entrypoint."*
  ```ts
  export const layer = Layer.effect(Todos, make).pipe(Layer.provide(IdGenerator.layer));
  ```
- Leave **environment-dependent** ports open: `SqlClient`, `AppConfig`, and anything backed by a
  binding. The composition root (`ApiWorker.ts`) provides those, because only it knows whether
  they're D1, KV, or in-memory.

**Composing the runtime: one flat, readable layer.** This is the relay's `layerRuntime` shape. List
the most dependent services at the top and the foundations at the bottom:

```ts
// apps/api/src/ApiWorker.ts
const layerRuntime = Layer.empty.pipe(
  Layer.provideMerge(Todos.layer), // needs TodoRepo, AppConfig, Crypto
  Layer.provideMerge(TodoRepo.layer), // needs SqlClient
  Layer.provideMerge(SQL.D1Layer(d1)), // adapter: D1 binding -> SqlClient
  Layer.provideMerge(AppConfig.layer(config)),
  Layer.provideMerge(WebCrypto.layer), // adapter: Web Crypto -> Crypto
);
```

`Layer.provideMerge` keeps each layer's outputs available to the layers above it, and to whatever
the runtime is finally provided to (HTTP handlers, queue consumers, crons).

**Other building blocks:**

| Need | Use |
| --- | --- |
| A layer that depends on config or runtime values | `Layer.unwrap(Effect.gen(function* () { ...; return SomeLayer }))` |
| A background worker that provides no service | `Layer.effectDiscard(loop.pipe(Effect.forkScoped))` |
| Acquire/release | `Effect.acquireRelease` directly inside `Layer.effect`. In v4 it is scoped, and `Layer.scoped` is gone |

**Memoization.** v4 shares one MemoMap across `Effect.provide` calls. That is a safety net, not a
reason to provide the same layer in many places. Compose the graph once. Use `Layer.fresh(L)` when
you really need a second instance.

---

## 4. Errors

### Defining them

```ts
export class TodoTitleTaken extends Schema.TaggedError<TodoTitleTaken>()("TodoTitleTaken", {
  title: Schema.String,
}) {
  override get message(): string {
    return `A todo titled "${this.title}" already exists.`;
  }
}

export class TodoImportFailed extends Schema.TaggedError<TodoImportFailed>()("TodoImportFailed", {
  source: Schema.Literals(["csv", "json"]),
  cause: Schema.Defect(), // wraps the underlying failure
}) {
  override get message(): string {
    return `Failed to import todos from ${this.source}.`;
  }
}
```

Errors that cross the wire live in `@app/contracts` and set an HTTP status:

```ts
export class TodoNotFound extends Schema.TaggedError<TodoNotFound>()(
  "TodoNotFound",
  { id: TodoId },
  { httpApiStatus: 404 },
) {}
```

These rules come from t3code's `effect-services.md`, which is enforced by its review bot:

- **Attributes are structured and bounded.** Record the operation or stage, an entity id, a
  category. Never store raw payloads, credentials, signed URLs, or defect text in them; the exact
  value lives only in `cause`.
- **`message` is fixed or built from attributes. Never build it from `cause`.** Don't add a
  `detail` field that copies `cause.message`.
- **Encode a distinction once.** Use either a separate tag or a field, not both. Split into
  separate classes when the distinction drives control flow or the user-facing message.
- **Don't write trivial mappers** like `(e) => new X({ ...e })`. A mapper is only worth having
  when it normalizes the error, lets domain errors pass through, or adds context.
- **Export predicates directly:** `export const isTodoNotFound = Schema.is(TodoNotFound)`.

### Expected errors vs defects

| Kind | Channel | Example |
| --- | --- | --- |
| Something the caller can act on | Typed `E` | `TodoNotFound`, `TodoTitleTaken`, `Unauthorized` |
| An infrastructure failure the caller can't fix | Defect (`Effect.orDie`, `Effect.die`) | `SqlError` while listing, `SchemaError` decoding a row we wrote |

The Effect ai-docs show a translation boundary inside a repository. It keeps the domain error and
turns infrastructure errors into defects:

```ts
repo.findById(id).pipe(
  Effect.catchTags({
    NoSuchElementError: () => new GroupNotFound({ id }),
    SchemaError: Effect.die,
    SqlError: Effect.die,
  }),
);
```

### Handling them

- **Use `Effect.catchTags({ Tag: handler })`, even for a single tag.** t3code's `prefer-catch-tags`
  lint rule enforces this. Use `Effect.catch` only when you mean "the whole error channel".
- **Never check `_tag` by hand or cast to `unknown`.** If a `catchTags` doesn't typecheck, fix the
  error union upstream. Alchemy's `AGENTS.md` calls this the "Typed Error Doctrine".
- **Map to transport errors only in the transport.** A service returns `TodoNotFound`; the HTTP
  layer decides it's a 404, either by passing it through because the contract declares it, or by
  mapping it.
- **To fail, write `return yield* new TodoNotFound({ id })`.** The `return` tells TypeScript the
  branch ends there.

If a service's error union gets large, use Effect's **reason pattern**: one tagged error per
service with a `reason` union, handled with `Effect.catchReason` / `catchReasons`
(`ai-docs/src/01_effect/04_errors/20_reason-errors.ts`).

---

## 5. `Effect.fn` and `Effect.gen`

From Effect's `LLMS.md`: use `Effect.gen` for inline code. For reusable functions, use
`Effect.fn("name")` when tracing is useful and `Effect.fnUntraced` when it isn't. Don't write
functions that only wrap and return an `Effect.gen`.

```ts
// apps/api/src/todos/Todos.ts
const create: Todos["Service"]["create"] = Effect.fn("Todos.create")(function* (input) {
  const total = yield* repo.count;
  if (total >= config.maxTodos) return yield* new TodoLimitReached({ limit: config.maxTodos });

  // UUIDv7 is time-ordered, and both the clock and randomness come from services,
  // so tests control them.
  const id = TodoId.make(yield* crypto.randomUUIDv7.pipe(Effect.orDie));
  const createdAt = yield* Clock.currentTimeMillis;
  yield* Effect.annotateCurrentSpan({ "todo.id": id });
  return yield* repo.insert({ id, title: input.title, createdAt });
});
```

To add behaviour such as `Effect.annotateLogs({ service: "Todos" })`, pass it as an extra argument
after the generator. Don't `.pipe()` an `Effect.fn`. Extra arguments also receive the call's
arguments: the CLI's `Scaffold.writeFile` uses that to put the file path into its error.

- **Name it `"Service.method"`.** Every method becomes a span. The relay uses a
  `"relay.devices.register"` prefix; either style works, but be consistent.
- **Type the method from the service interface:**
  `const create: Todos["Service"]["create"] = Effect.fn(...)`. The parameters are then inferred.
- **Use `Effect.fnUntraced` for hot paths and for builder callbacks** such as
  `HttpApiBuilder.group(..., Effect.fnUntraced(function* (handlers) { ... }))`.
- **Add `Effect.fn.Return<A, E, R>` when you want an explicit return annotation.**

---

## 6. Schema and contracts

```ts
// packages/contracts/src/ids.ts
export const TodoId = Schema.String.pipe(Schema.brand("TodoId"));
export type TodoId = typeof TodoId.Type;

// packages/contracts/src/todos.ts (shortened)
export const TodoTitle = Schema.Trim.pipe(Schema.check(Schema.isNonEmpty(), Schema.isMaxLength(200)));

export const Todo = Schema.Struct({ id: TodoId, title: TodoTitle, completed: Schema.Boolean });
export type Todo = typeof Todo.Type;

export const CreateTodo = Schema.Struct({ title: TodoTitle });
export type CreateTodo = typeof CreateTodo.Type;

export class TodoNotFound extends Schema.TaggedError<TodoNotFound>()(
  "TodoNotFound",
  { id: TodoId },
  { httpApiStatus: 404 },
) {
  override get message(): string {
    return `Todo ${this.id} was not found.`;
  }
}

export const TodosGroup = HttpApiGroup.make("todos")
  .add(
    HttpApiEndpoint.get("list", "/", { success: Schema.Array(Todo) }),
    HttpApiEndpoint.get("get", "/:id", { params: { id: TodoId }, success: Todo, error: TodoNotFound }),
    HttpApiEndpoint.post("create", "/", { payload: CreateTodo, success: Todo, error: TodoLimitReached }),
    // ...update, remove
  )
  .prefix("/todos");

// packages/contracts/src/api.ts
export class AppApi extends HttpApi.make("app")
  .add(HealthGroup)
  .add(TodosGroup)
  .annotate(OpenApi.Title, "App API") {}
```

- **Pair every schema with a type of the same name:**
  `export const X = ...; export type X = typeof X.Type`. t3code does this everywhere.
- **Brand every entity ID** so a `TodoId` can't be passed where a `UserId` is expected.
  Construct them with `TodoId.make(...)`.
- **Keep wire schemas separate from persistence rows.** `Todo` is in contracts; `TodoRow` is
  private to `TodoRepo.ts`. For SQL-heavy domains, `Model.Class` from `effect/schema` derives
  `insert`/`update`/`json` variants from one declaration.
- **Hoist compiled schemas to module scope:** `const decodeTodo = Schema.decodeUnknownEffect(Todo)`.
  t3code's `no-inline-schema-compile` lint rule catches decoders rebuilt on every call.
- **Parse untrusted data with Schema, not hand-written predicates.** From `LLMS.md`: "AVOID
  using predicates or manual parsing."
- **Name the v4 schema APIs correctly:**
  - `Schema.Union([A, B])` and `Schema.Literals(["a", "b"])`
  - `Schema.decodeUnknownEffect`
  - `Schema.TaggedError` (not `TaggedErrorClass`)
  - `Schema.check(...)` for refinements
- **Middleware *tags* (`HttpApiMiddleware.Service`) belong in contracts.** Their implementations
  go in the server.
- **Transforming schemas only transform on decode.** `TodoTitle` is `Schema.Trim` with checks.
  The server decodes `"  hi  "` into `"hi"`, but a typed client *encodes*, and encoding demands an
  already-valid value. So the client refuses to send an untrimmed title. Clients normalize before
  sending; the web app's form calls `title.trim()`.
- **Don't export a schema value nobody imports.** Knip's `includeEntryExports` flags it. Keep the
  `const` private and export only its type (`HealthStatus`, `UpdateTodo`).

---

## 7. Config

Config is read **once, at the edge**, and turned into a typed service. Business logic never calls
`Config.*` and never reads `process.env`.

```ts
// apps/api/src/AppConfig.ts
export class AppConfig extends Context.Service<
  AppConfig,
  {
    readonly maxTodos: number;
    /** Origins allowed to call the API from a browser. Empty allows any origin. */
    readonly allowedOrigins: ReadonlyArray<string>;
  }
>()("@app/api/AppConfig") {}

/** Raw reads. The Worker yields this during construction, so Alchemy binds the values. */
export const fromEnv = Config.all({
  maxTodos: Config.Int("MAX_TODOS").pipe(Config.withDefault(100)),
  allowedOrigins: Config.String("ALLOWED_ORIGINS").pipe(
    Config.withDefault(""),
    Config.map((value) => value.split(",").map((origin) => origin.trim()).filter((origin) => origin.length > 0)),
  ),
});

export const layer = (config: AppConfig["Service"]) => Layer.succeed(AppConfig, AppConfig.of(config));
```

- **Wrap secrets in `Config.Redacted`.** They print as `<redacted>`. Call `Redacted.value(x)` only
  at the point of use.
- **Use `Config.schema(Schema, "NAME")` for validated values**, such as literal unions or numbers
  with bounds. The relay's `Config.ts` validates `RELAY_TUNNEL_CLEANUP_MODE` this way.
- **`withDefault` and `option` only recover from a missing value.** A malformed value still fails.
- **In Alchemy Workers, read config only during construction.** A `Config` read inside `fetch` is
  never bound to the deployed Worker. See [04](./04-alchemy-patterns.md#config-and-secrets).
- **In tests, provide config directly:** `AppConfig.layer({...})`, or
  `ConfigProvider.layer(ConfigProvider.fromUnknown({...}))` when testing the raw reads.

---

## 8. HTTP handlers: thin transports

```ts
// apps/api/src/todos/http.ts
import { AppApi } from "@app/contracts/api";
import * as Effect from "effect/Effect";
import * as HttpApiBuilder from "effect/http-api/HttpApiBuilder";
import * as Todos from "./Todos.ts";

export const layer = HttpApiBuilder.group(
  AppApi,
  "todos",
  Effect.fnUntraced(function* (handlers) {
    const todos = yield* Todos.Todos;
    return handlers
      .handle("list", () => todos.list)
      .handle("get", ({ params }) => todos.get(params.id))
      .handle("create", ({ payload }) => todos.create(payload))
      .handle("update", ({ params, payload }) =>
        todos.setCompleted({ id: params.id, completed: payload.completed }),
      )
      .handle("remove", ({ params }) => todos.remove(params.id));
  }),
);
```

A handler does three things: **decode** (the contract does this), **call one service method**, and
**map errors**. Retries, multi-step logic, persistence, and authorization rules all belong in the
service or middleware. This is t3code's most-repeated rule: *"Server features are services;
transports stay thin."* Following it lets HTTP, RPC, crons, queue consumers, and MCP tools all
reach the same capability.

Don't add spans or metrics in individual handlers. `Effect.fn` on the service method already
traces it. Add per-call context with `Effect.annotateCurrentSpan`.

**Serving the API:**
- **Inside a Worker:** `HttpApiBuilder.layer(AppApi)` → `HttpRouter.toHttpEffect`. See
  [04](./04-alchemy-patterns.md#serving-an-httpapi-from-a-worker).
- **On Node:** `HttpRouter.serve(...)` + `NodeHttpServer.layer(...)` +
  `Layer.launch(...).pipe(NodeRuntime.runMain)`.
- **Docs:** `HttpApiScalar.layer(AppApi, { path: "/docs" })` serves interactive docs, and
  `openapiPath: "/openapi.json"` serves the spec.

**Typed clients come from the same contract.** In Effect code:

```ts
const client = yield* HttpApiClient.make(AppApi, { baseUrl });
const todo = yield* client.todos.get({ params: { id } }); // fails with TodoNotFound, typed
```

In React (`apps/web`), use `AtomHttpApi` to get query and mutation atoms:

```ts
// apps/web/src/lib/ApiClient.ts
export class ApiClient extends AtomHttpApi.Service<ApiClient>()("@app/web/ApiClient", {
  api: AppApi,
  httpClient: FetchHttpClient.layer,
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:1337",
}) {}

// apps/web/src/todos/atoms.ts
export const todosAtom = ApiClient.query("todos", "list", { reactivityKeys: ["todos"] });
export const createTodoAtom = ApiClient.mutation("todos", "create");
// Components use useAtomValue(todosAtom) and useAtomSet(createTodoAtom). A mutation called with
// { reactivityKeys: ["todos"] } refreshes every query that shares the key.
```

**HttpApi or RPC?** Alchemy's `apis/effect-http.mdx` gives this guidance:

| Use | When |
| --- | --- |
| **HttpApi** | Trust boundaries and non-Effect consumers. You get OpenAPI for free |
| **Effect RPC** (`effect/rpc`) | Effect-to-Effect clients, especially for streaming. t3code's WebSocket API is one `RpcGroup` in contracts |
| **Plain Durable Object or service-binding methods** | Internal Worker-to-Worker calls, so you don't decode the schema on every hop |

---

## 9. Runtime boundaries

`Effect.runPromise`, `runFork`, and `ManagedRuntime.make` belong **only at application and
framework edges**: the Worker entry (Alchemy handles this), `main.tsx`, a CLI, or a callback from a
non-Effect SDK. Never call them inside a service, repository, or layer constructor. This rule comes
from t3code's `effect-services.md`.

- **Have one runtime per app.** In `apps/web` that's the `ApiClient` service's atom runtime. Don't
  create a runtime per feature.
- **Bridging a Promise-based SDK:** inside an adapter, capture
  `const ctx = yield* Effect.context<R>()` and use `Effect.runPromiseWith(ctx)` in the callback.
  t3code's `ClaudeAdapterV2.ts` does this.
- **Node entrypoints:** `NodeRuntime.runMain(program)` or `Layer.launch(appLayer)`. Both handle
  SIGINT/SIGTERM.

### Use Effect services instead of globals

t3code turns these into **type errors** through the Effect language service. The boilerplate
enables the same diagnostics; see [05](./05-tooling.md).

| Instead of | Use | Why |
| --- | --- | --- |
| `Date.now()`, `new Date()` | `Clock.currentTimeMillis`, `DateTime.now` | `TestClock` controls it |
| `Math.random()`, `crypto.randomUUID()` | `Random.*`, or an injected ID service | Deterministic in tests |
| `setTimeout` / `setInterval` | `Effect.sleep`, `Schedule`, `Effect.repeat` | Interruptible and testable |
| `console.log` | `Effect.log*` | Structured, attached to spans |
| `fetch` | `HttpClient` (`FetchHttpClient.layer`) | Typed errors, tracing, retries |
| `JSON.parse` | `Schema.decodeUnknown*(Schema.fromJsonString(...))` | Validated |
| `process.env.X` | `Config.*` at the edge → a config service | Bound and typed |

---

## 10. Observability

- **Every `Effect.fn("name")` is a span.** Add attributes with `Effect.annotateCurrentSpan` and log
  context with `Effect.annotateLogs`. For inline effects, use `Effect.withSpan("name")`.
- **Logging:** `Effect.logInfo/Warning/Error` with structured data. Choose the logger format with a
  layer: `Logger.layer([Logger.consoleJson])`. Set the level with
  `Layer.succeed(References.MinimumLogLevel, "Warn")`.
- **Export telemetry from the edge.** New projects use the lightweight `effect/observability` OTLP
  modules (`OtlpTracer`, `OtlpLogger`). On Workers, Alchemy has `Axiom.Telemetry(...)` and
  `Alchemy.Telemetry.layer(...)`; the relay uses both.

---

## 11. Testing

```ts
// apps/api/src/todos/Todos.test.ts (shortened)
import { assert, describe, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as TestClock from "effect/testing/TestClock";

import * as AppConfig from "../AppConfig.ts";
import * as TestDatabase from "../testing/TestDatabase.ts";
import * as WebCrypto from "../WebCrypto.ts";
import * as TodoRepo from "./TodoRepo.ts";
import * as Todos from "./Todos.ts";

// The real Todos and TodoRepo layers; only the platform adapters are swapped
// (in-memory SQLite for D1, literal config for env vars).
const layerTest = (config: Partial<AppConfig.AppConfig["Service"]> = {}) =>
  Layer.empty.pipe(
    Layer.provideMerge(Todos.layer),
    Layer.provideMerge(TodoRepo.layer),
    Layer.provideMerge(TestDatabase.layer),
    Layer.provideMerge(AppConfig.layer({ maxTodos: 100, allowedOrigins: [], ...config })),
    Layer.provideMerge(WebCrypto.layer),
  );

describe("Todos", () => {
  it.effect("creates todos and lists them in creation order", () =>
    Effect.gen(function* () {
      const todos = yield* Todos.Todos;
      const first = yield* todos.create({ title: "Write the contract" });
      yield* TestClock.adjust("1 second"); // createdAt comes from Clock, so the test controls it
      const second = yield* todos.create({ title: "Implement the service" });
      assert.deepStrictEqual(yield* todos.list, [first, second]);
    }).pipe(Effect.provide(layerTest())),
  );

  it.effect("rejects new todos once the configured limit is reached", () =>
    Effect.gen(function* () {
      const todos = yield* Todos.Todos;
      yield* todos.create({ title: "one" });
      yield* todos.create({ title: "two" });
      const error = yield* todos.create({ title: "three" }).pipe(Effect.flip);
      assert.strictEqual(error._tag, "TodoLimitReached");
    }).pipe(Effect.provide(layerTest({ maxTodos: 2 }))),
  );
});
```

`TestDatabase.layer` (in `apps/api/src/testing/`) is an in-memory SQLite `SqlClient` that runs
the same `migrations/*.sql` files D1 runs on deploy, so tests and production share one schema.
`Effect.provide(layer)` on each test gives every test a fresh database.

Rules from t3code, enforced by lint or documented, and from Effect's test skill:

- **Colocate tests.** `Foo.test.ts` sits next to `Foo.ts`. Deploy tests that run the real Stack
  live in `test/*.integ.test.ts`.
- **Test through the real service. Fake only the external boundaries:** the SQL driver, the
  network, queues, the clock. Don't mock the logic under test. `Layer.mock(Service)({ partial })`
  is available for collaborators you don't care about; unimplemented methods throw.
- **Use `it.effect` and `it.layer` / `layer(...)`.** Never call `Effect.runPromise` or
  `ManagedRuntime.make` in a test; t3code enforces this with `no-manual-effect-runtime-in-tests`.
  `it.effect` already provides a `Scope`, so don't wrap it in `Effect.scoped`.
- **State inside `it.layer(...)` is shared across that block's tests.** When a test needs a clean
  instance, like the database-backed tests here, use `Effect.provide(layer)` on that test instead.
- **Never sleep.** Use `TestClock.adjust("5 minutes")` (from `effect/testing/TestClock`), await a
  `Deferred`, or drain a worker. t3code's `AGENTS.md`: *"A test that needs a timeout to pass is
  wrong."*
- **Don't write tests in loops.** Use `it.effect.each(cases)(...)`.
- **Test handlers without a server.** `HttpApiTest.groups(AppApi, ["todos"])` gives you a typed
  client wired directly to the handler layers, plus `HttpServer.layerServices`. The pattern comes
  from `ai-docs/src/51_http-server/20_testing.ts`; the template's version is
  `apps/api/src/todos/http.test.ts`.
- **Assert on errors** with `Effect.flip` + `assert.strictEqual(error._tag, "...")`.
- **`it.effect` hides logs.** Use `it.live` or provide a console logger when you need to see them.
