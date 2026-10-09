import { TodoId } from "@app/contracts/ids";
import { type CreateTodo, type Todo, TodoLimitReached, TodoNotFound } from "@app/contracts/todos";
import * as Clock from "effect/Clock";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";

import * as AppConfig from "../AppConfig.ts";
import * as TodoRepo from "./TodoRepo.ts";

/** Todo business rules. Every transport (HTTP today; queues, crons, agents later) calls these. */
export class Todos extends Context.Service<
  Todos,
  {
    readonly list: Effect.Effect<ReadonlyArray<Todo>>;
    readonly get: (id: TodoId) => Effect.Effect<Todo, TodoNotFound>;
    readonly create: (input: CreateTodo) => Effect.Effect<Todo, TodoLimitReached>;
    readonly setCompleted: (input: {
      readonly id: TodoId;
      readonly completed: boolean;
    }) => Effect.Effect<Todo, TodoNotFound>;
    readonly remove: (id: TodoId) => Effect.Effect<void, TodoNotFound>;
  }
>()("@app/api/todos/Todos") {}

const make = Effect.gen(function* () {
  const repo = yield* TodoRepo.TodoRepo;
  const config = yield* AppConfig.AppConfig;
  const crypto = yield* Crypto.Crypto;

  const get: Todos["Service"]["get"] = Effect.fn("Todos.get")(function* (id) {
    const todo = yield* repo.findById(id);
    if (Option.isNone(todo)) return yield* new TodoNotFound({ id });
    return todo.value;
  });

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

  const setCompleted: Todos["Service"]["setCompleted"] = Effect.fn("Todos.setCompleted")(
    function* (input) {
      const todo = yield* repo.setCompleted(input);
      if (Option.isNone(todo)) return yield* new TodoNotFound({ id: input.id });
      return todo.value;
    },
  );

  const remove: Todos["Service"]["remove"] = Effect.fn("Todos.remove")(function* (id) {
    const deleted = yield* repo.remove(id);
    if (!deleted) return yield* new TodoNotFound({ id });
  });

  return Todos.of({ list: repo.list, get, create, setCompleted, remove });
});

export const layer = Layer.effect(Todos, make);
