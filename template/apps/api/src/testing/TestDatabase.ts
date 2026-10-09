import * as NodeServices from "@effect/platform-node/NodeServices";
import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";
import * as SqlClient from "effect/sql/SqlClient";

/** Splits a migration file into statements. Keep migrations to plain DDL/DML for this to hold. */
const splitStatements = (contents: string): ReadonlyArray<string> =>
  contents
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

/** Applies apps/api/migrations/*.sql in filename order: the same files D1 runs on deploy. */
const applyMigrations = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const sql = yield* SqlClient.SqlClient;

  const dir = yield* path.fromFileUrl(new URL("../../migrations", import.meta.url));
  const files = (yield* fs.readDirectory(dir)).filter((file) => file.endsWith(".sql")).toSorted();
  for (const file of files) {
    const contents = yield* fs.readFileString(path.join(dir, file));
    for (const statement of splitStatements(contents)) {
      yield* sql.unsafe(statement);
    }
  }
});

/** A migrated, in-memory SQLite `SqlClient`: stands in for `SQL.D1Layer(d1)` in unit tests. */
export const layer = Layer.effectDiscard(applyMigrations).pipe(
  Layer.provideMerge(SqliteClient.layer({ filename: ":memory:" })),
  Layer.provide(NodeServices.layer),
  Layer.orDie,
);
