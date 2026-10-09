import * as Schema from "effect/Schema";

/** Identifies a todo. Branded so it can't be confused with other string ids. */
export const TodoId = Schema.String.pipe(Schema.brand("TodoId"));
export type TodoId = typeof TodoId.Type;
