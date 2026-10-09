import * as HttpApiEndpoint from "effect/http-api/HttpApiEndpoint";
import * as HttpApiGroup from "effect/http-api/HttpApiGroup";
import * as Schema from "effect/Schema";

import { TodoId } from "./ids.ts";

export const TodoTitle = Schema.Trim.pipe(
  Schema.check(Schema.isNonEmpty(), Schema.isMaxLength(200)),
);
export type TodoTitle = typeof TodoTitle.Type;

export const Todo = Schema.Struct({
  id: TodoId,
  title: TodoTitle,
  completed: Schema.Boolean,
});
export type Todo = typeof Todo.Type;

export const CreateTodo = Schema.Struct({ title: TodoTitle });
export type CreateTodo = typeof CreateTodo.Type;

const UpdateTodo = Schema.Struct({ completed: Schema.Boolean });
export type UpdateTodo = typeof UpdateTodo.Type;

export class TodoNotFound extends Schema.TaggedError<TodoNotFound>()(
  "TodoNotFound",
  { id: TodoId },
  { httpApiStatus: 404 },
) {
  override get message(): string {
    return `Todo ${this.id} was not found.`;
  }
}

export class TodoLimitReached extends Schema.TaggedError<TodoLimitReached>()(
  "TodoLimitReached",
  { limit: Schema.Int },
  { httpApiStatus: 409 },
) {
  override get message(): string {
    return `The limit of ${this.limit} todos has been reached.`;
  }
}

const todoParams = { id: TodoId };

export const TodosGroup = HttpApiGroup.make("todos")
  .add(
    HttpApiEndpoint.get("list", "/", { success: Schema.Array(Todo) }),
    HttpApiEndpoint.get("get", "/:id", {
      params: todoParams,
      success: Todo,
      error: TodoNotFound,
    }),
    HttpApiEndpoint.post("create", "/", {
      payload: CreateTodo,
      success: Todo,
      error: TodoLimitReached,
    }),
    HttpApiEndpoint.patch("update", "/:id", {
      params: todoParams,
      payload: UpdateTodo,
      success: Todo,
      error: TodoNotFound,
    }),
    HttpApiEndpoint.delete("remove", "/:id", {
      params: todoParams,
      error: TodoNotFound,
    }),
  )
  .prefix("/todos");
