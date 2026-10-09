import { TodoId } from "@app/contracts/ids";
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

const missingId = TodoId.make("00000000-0000-7000-8000-000000000000");

describe("Todos", () => {
  it.effect("creates todos and lists them in creation order", () =>
    Effect.gen(function* () {
      const todos = yield* Todos.Todos;
      const first = yield* todos.create({ title: "Write the contract" });
      yield* TestClock.adjust("1 second");
      const second = yield* todos.create({ title: "Implement the service" });

      assert.deepStrictEqual(yield* todos.list, [first, second]);
      assert.isFalse(first.completed);
    }).pipe(Effect.provide(layerTest())),
  );

  it.effect("rejects new todos once the configured limit is reached", () =>
    Effect.gen(function* () {
      const todos = yield* Todos.Todos;
      yield* todos.create({ title: "one" });
      yield* todos.create({ title: "two" });

      const error = yield* todos.create({ title: "three" }).pipe(Effect.flip);
      assert.strictEqual(error._tag, "TodoLimitReached");
      assert.strictEqual(error.limit, 2);
    }).pipe(Effect.provide(layerTest({ maxTodos: 2 }))),
  );

  it.effect("marks a todo completed", () =>
    Effect.gen(function* () {
      const todos = yield* Todos.Todos;
      const todo = yield* todos.create({ title: "Ship it" });

      const updated = yield* todos.setCompleted({ id: todo.id, completed: true });
      assert.isTrue(updated.completed);
      assert.deepStrictEqual(yield* todos.get(todo.id), updated);
    }).pipe(Effect.provide(layerTest())),
  );

  it.effect("removes a todo", () =>
    Effect.gen(function* () {
      const todos = yield* Todos.Todos;
      const todo = yield* todos.create({ title: "Temporary" });

      yield* todos.remove(todo.id);
      assert.deepStrictEqual(yield* todos.list, []);
    }).pipe(Effect.provide(layerTest())),
  );

  it.effect.each([
    { operation: "get", run: (todos: Todos.Todos["Service"]) => todos.get(missingId) },
    {
      operation: "setCompleted",
      run: (todos: Todos.Todos["Service"]) =>
        todos.setCompleted({ id: missingId, completed: true }),
    },
    { operation: "remove", run: (todos: Todos.Todos["Service"]) => todos.remove(missingId) },
  ])("$operation fails with TodoNotFound for an unknown id", ({ run }) =>
    Effect.gen(function* () {
      const todos = yield* Todos.Todos;
      const error = yield* run(todos).pipe(Effect.flip);
      assert.strictEqual(error._tag, "TodoNotFound");
      assert.strictEqual(error.id, missingId);
    }).pipe(Effect.provide(layerTest())),
  );
});
