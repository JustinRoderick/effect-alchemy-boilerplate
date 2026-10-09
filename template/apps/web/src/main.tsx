import { RegistryProvider } from "@effect/atom-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";
import { TodoList } from "./todos/TodoList.tsx";

function App() {
  return (
    <main>
      <h1>Todos</h1>
      <p className="muted">
        React → <code>@app/contracts</code> → Effect HttpApi on a Cloudflare Worker → D1.
      </p>
      <TodoList />
    </main>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <RegistryProvider>
        <App />
      </RegistryProvider>
    </StrictMode>,
  );
}
