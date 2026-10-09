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
const TodoRow = Schema.Struct({
  id: TodoId,
  title: TodoTitle,
  completed: Schema.BooleanFromBit,
});

const NewTodoRow = Schema.Struct({
  id: TodoId,
  title: TodoTitle,
  createdAt: Schema.Int,
});

const CompletedUpdate = Schema.Struct({
  id: TodoId,
  completed: Schema.BooleanFromBit,
});

/** Persistence for todos, written against `SqlClient` so it runs on D1 or SQLite alike. */
export class TodoRepo extends Context.Service<
  TodoRepo,
  {
    readonly list: Effect.Effect<ReadonlyArray<Todo>>;
    readonly count: Effect.Effect<number>;
    readonly findById: (id: TodoId) => Effect.Effect<Option.Option<Todo>>;
    readonly insert: (input: {
      readonly id: TodoId;
      readonly title: TodoTitle;
      readonly createdAt: number;
    }) => Effect.Effect<Todo>;
    /** Returns the updated todo, or none when it doesn't exist. */
    readonly setCompleted: (input: {
      readonly id: TodoId;
      readonly completed: boolean;
    }) => Effect.Effect<Option.Option<Todo>>;
    /** Returns whether a todo was deleted. */
    readonly remove: (id: TodoId) => Effect.Effect<boolean>;
  }
>()("@app/api/todos/TodoRepo") {}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const listRows = SqlSchema.findAll({
    Request: Schema.Void,
    Result: TodoRow,
    execute: () => sql`SELECT id, title, completed FROM todos ORDER BY created_at, id`,
  });

  const countRows = SqlSchema.findOne({
    Request: Schema.Void,
    Result: Schema.Struct({ total: Schema.Int }),
    execute: () => sql`SELECT COUNT(*) AS total FROM todos`,
  });

  const findRow = SqlSchema.findOneOption({
    Request: TodoId,
    Result: TodoRow,
    execute: (id) => sql`SELECT id, title, completed FROM todos WHERE id = ${id}`,
  });

  const insertRow = SqlSchema.findOne({
    Request: NewTodoRow,
    Result: TodoRow,
    execute: (row) =>
      sql`INSERT INTO todos (id, title, completed, created_at)
          VALUES (${row.id}, ${row.title}, 0, ${row.createdAt})
          RETURNING id, title, completed`,
  });

  const updateCompleted = SqlSchema.findOneOption({
    Request: CompletedUpdate,
    Result: TodoRow,
    execute: (row) =>
      sql`UPDATE todos SET completed = ${row.completed} WHERE id = ${row.id}
          RETURNING id, title, completed`,
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
    count: countRows(undefined).pipe(
      Effect.map((row) => row.total),
      Effect.orDie,
      Effect.withSpan("TodoRepo.count"),
    ),
    findById: Effect.fn("TodoRepo.findById")((id) => findRow(id).pipe(Effect.orDie)),
    insert: Effect.fn("TodoRepo.insert")((input) => insertRow(input).pipe(Effect.orDie)),
    setCompleted: Effect.fn("TodoRepo.setCompleted")((input) =>
      updateCompleted(input).pipe(Effect.orDie),
    ),
    remove: Effect.fn("TodoRepo.remove")((id) =>
      deleteRow(id).pipe(Effect.map(Option.isSome), Effect.orDie),
    ),
  });
});

export const layer = Layer.effect(TodoRepo, make);
