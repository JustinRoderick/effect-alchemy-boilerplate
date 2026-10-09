import { AppApi } from "@app/contracts/api";
import * as Effect from "effect/Effect";
import * as HttpApiBuilder from "effect/http-api/HttpApiBuilder";

import * as Todos from "./Todos.ts";

/** HTTP handlers for the `todos` group: decode (done by the contract), call one method, return. */
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
