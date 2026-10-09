import { AppApi } from "@app/contracts/api";
import { TodoId } from "@app/contracts/ids";
import { assert, describe, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as HttpServer from "effect/http/HttpServer";
import * as HttpApiTest from "effect/http-api/HttpApiTest";
import * as Layer from "effect/Layer";

import * as AppConfig from "../AppConfig.ts";
import * as HealthHttp from "../health/http.ts";
import * as TestDatabase from "../testing/TestDatabase.ts";
import * as WebCrypto from "../WebCrypto.ts";
import * as TodosHttp from "./http.ts";
import * as TodoRepo from "./TodoRepo.ts";
import * as Todos from "./Todos.ts";

// A typed client wired straight to the handler layers: the full HTTP pipeline
// (routing, encoding, error status mapping) runs without a server or a Worker.
const makeClient = HttpApiTest.groups(AppApi, ["health", "todos"]);

const layerTest = Layer.mergeAll(HealthHttp.layer, TodosHttp.layer, HttpServer.layerServices).pipe(
  Layer.provide(Todos.layer),
  Layer.provide(TodoRepo.layer),
  Layer.provide(TestDatabase.layer),
  Layer.provide(AppConfig.layer({ maxTodos: 100, allowedOrigins: [] })),
  Layer.provide(WebCrypto.layer),
);

describe("todos HTTP API", () => {
  it.effect("serves the todo lifecycle through the contract", () =>
    Effect.gen(function* () {
      const client = yield* makeClient;

      const created = yield* client.todos.create({ payload: { title: "Try the API" } });
      assert.strictEqual(created.title, "Try the API");

      const updated = yield* client.todos.update({
        params: { id: created.id },
        payload: { completed: true },
      });
      assert.isTrue(updated.completed);
      assert.deepStrictEqual(yield* client.todos.list(), [updated]);

      yield* client.todos.remove({ params: { id: created.id } });
      assert.deepStrictEqual(yield* client.todos.list(), []);
    }).pipe(Effect.provide(layerTest)),
  );

  it.effect("returns TodoNotFound as a typed error", () =>
    Effect.gen(function* () {
      const client = yield* makeClient;
      const id = TodoId.make("00000000-0000-7000-8000-000000000000");

      const error = yield* client.todos.get({ params: { id } }).pipe(Effect.flip);
      assert.strictEqual(error._tag, "TodoNotFound");
    }).pipe(Effect.provide(layerTest)),
  );

  it.effect("reports health", () =>
    Effect.gen(function* () {
      const client = yield* makeClient;
      assert.deepStrictEqual(yield* client.health.check(), { ok: true, service: "api" });
    }).pipe(Effect.provide(layerTest)),
  );
});
