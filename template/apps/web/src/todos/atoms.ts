import { ApiClient } from "../lib/ApiClient.ts";

/** Queries and mutations sharing this key are refreshed together after a write. */
const todosKey = ["todos"];

export const todosAtom = ApiClient.query("todos", "list", { reactivityKeys: todosKey });
export const createTodoAtom = ApiClient.mutation("todos", "create");
export const updateTodoAtom = ApiClient.mutation("todos", "update");
export const removeTodoAtom = ApiClient.mutation("todos", "remove");

export const invalidates = { reactivityKeys: todosKey } as const;
