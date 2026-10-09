import type { Todo } from "@app/contracts/todos";
import { useAtomSet, useAtomValue } from "@effect/atom-react";
import * as Exit from "effect/Exit";
import * as AsyncResult from "effect/reactivity/AsyncResult";
import { type FormEvent, useState } from "react";

import { createTodoAtom, invalidates, removeTodoAtom, todosAtom, updateTodoAtom } from "./atoms.ts";

export function TodoList() {
  return (
    <section className="card">
      <NewTodoForm />
      <TodoItems />
    </section>
  );
}

function TodoItems() {
  const todos = useAtomValue(todosAtom);

  if (AsyncResult.isInitial(todos)) return <p className="muted">Loading…</p>;
  if (AsyncResult.isFailure(todos)) {
    return <p className="error">Couldn't reach the API. Is `alchemy dev` running?</p>;
  }
  if (todos.value.length === 0) return <p className="muted">Nothing to do yet.</p>;
  return (
    <ul className="todos">
      {todos.value.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function NewTodoForm() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createTodo = useAtomSet(createTodoAtom, { mode: "promiseExit" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    // The contract's TodoTitle is trimmed and non-empty; the typed client won't send anything else.
    const trimmed = title.trim();
    if (trimmed.length === 0) return;
    const exit = await createTodo({ payload: { title: trimmed }, ...invalidates });
    if (Exit.isSuccess(exit)) {
      setTitle("");
      setError(null);
    } else {
      setError("Couldn't add that todo.");
    }
  };

  return (
    <form className="new-todo" onSubmit={submit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
        aria-label="New todo"
      />
      <button type="submit">Add</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

function TodoItem({ todo }: { readonly todo: Todo }) {
  const updateTodo = useAtomSet(updateTodoAtom);
  const removeTodo = useAtomSet(removeTodoAtom);

  return (
    <li className={todo.completed ? "done" : undefined}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(event) =>
            updateTodo({
              params: { id: todo.id },
              payload: { completed: event.target.checked },
              ...invalidates,
            })
          }
        />
        {todo.title}
      </label>
      <button
        type="button"
        className="remove"
        aria-label={`Remove ${todo.title}`}
        onClick={() => removeTodo({ params: { id: todo.id }, ...invalidates })}
      >
        ×
      </button>
    </li>
  );
}
